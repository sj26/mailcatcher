# frozen_string_literal: true

require "pathname"
require "net/http"
require "uri"

require "sinatra"
require "skinny"

require "mail_catcher/bus"
require "mail_catcher/mail"

class Sinatra::Request
  include Skinny::Helpers
end

module MailCatcher
  module Web
    class Application < Sinatra::Base
      set :environment, MailCatcher.env
      set :prefix, MailCatcher.options[:http_path]
      set :asset_prefix, File.join(prefix, "assets")
      set :root, File.expand_path("#{__FILE__}/../../../..")

      if development?
        require "sprockets-helpers"

        configure do
          require "mail_catcher/web/assets"
          Sprockets::Helpers.configure do |config|
            config.environment = Assets
            config.prefix      = settings.asset_prefix
            config.digest      = false
            config.public_path = public_folder
            config.debug       = true
          end
        end

        helpers do
          include Sprockets::Helpers
        end
      else
        helpers do
          def asset_path(filename)
            File.join(settings.asset_prefix, filename)
          end
        end
      end

      get "/" do
        erb :index
      end

      delete "/" do
        if MailCatcher.quittable?
          MailCatcher.quit!
          status 204
        else
          status 403
        end
      end

      get "/messages" do
        if request.websocket?
          request.websocket!(
            :on_start => proc do |websocket|
              bus_subscription = MailCatcher::Bus.subscribe do |message|
                begin
                  websocket.send_message(JSON.generate(message))
                rescue => exception
                  MailCatcher.log_exception("Error sending message through websocket", message, exception)
                end
              end

              websocket.on_close do |*|
                MailCatcher::Bus.unsubscribe bus_subscription
              end
            end)
        else
          content_type :json
          JSON.generate(Mail.messages)
        end
      end

      delete "/messages" do
        if MailCatcher.clear_messages_allowed?
          Mail.delete!
          status 204
        else
          status 403
        end
      end

      get "/messages/:id.json" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          JSON.generate(message.merge({
            "formats" => [
              "source",
              ("html" if Mail.message_has_html? id),
              ("plain" if Mail.message_has_plain? id)
            ].compact,
            "attachments" => Mail.message_attachments(id),
          }))
        else
          not_found
        end
      end

      get "/messages/:id.html" do
        id = params[:id].to_i
        if part = Mail.message_part_html(id)
          content_type :html, :charset => (part["charset"] || "utf8")

          body = part["body"]

          # Rewrite body to link to embedded attachments served by cid
          body.gsub! /cid:([^'"> ]+)/, "#{id}/parts/\\1"

          body
        else
          not_found
        end
      end

      get "/messages/:id.plain" do
        id = params[:id].to_i
        if part = Mail.message_part_plain(id)
          content_type part["type"], :charset => (part["charset"] || "utf8")
          part["body"]
        else
          not_found
        end
      end

      get "/messages/:id.source" do
        id = params[:id].to_i
        if message_source = Mail.message_source(id)
          content_type "text/plain"
          message_source
        else
          not_found
        end
      end

      get "/messages/:id.eml" do
        id = params[:id].to_i
        if message_source = Mail.message_source(id)
          content_type "message/rfc822"
          message_source
        else
          not_found
        end
      end

      get "/messages/:id/parts/:cid" do
        id = params[:id].to_i
        if part = Mail.message_part_cid(id, params[:cid])
          content_type part["type"], :charset => (part["charset"] || "utf8")
          attachment part["filename"] if part["is_attachment"] == 1
          body part["body"].to_s
        else
          not_found
        end
      end

      delete "/messages/:id" do
        if MailCatcher.clear_messages_allowed?
          id = params[:id].to_i
          if Mail.message(id)
            Mail.delete_message!(id)
            status 204
          else
            not_found
          end
        else
            status 403
        end
      end

      not_found do
        erb :"404"
      end
    end
  end
end
