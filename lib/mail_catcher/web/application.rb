require "pathname"
require "net/http"
require "uri"

require "sinatra"
require "skinny"

require "mail_catcher/events"
require "mail_catcher/mail"

class Sinatra::Request
  include Skinny::Helpers
end

module MailCatcher
  module Web
    class Application < Sinatra::Base
      set :development, ENV["MAILCATCHER_ENV"] == "development"
      set :root, File.expand_path("#{__FILE__}/../../../..")
      set :haml, :format => :html5

      if development?
        require "sprockets-helpers"

        configure do
          require "mail_catcher/web/assets"
          Sprockets::Helpers.configure do |config|
            config.environment = MailCatcher::Web::Assets
            config.prefix      = "/assets"
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
          def javascript_tag(name)
            %{<script src="/assets/#{name}.js"></script>}
          end

          def stylesheet_tag(name)
            %{<link rel="stylesheet" href="/assets/#{name}.css">}
          end
        end
      end

      get "/" do
        haml :index
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
              subscription = Events::MessageAdded.subscribe { |message| websocket.send_message message.to_json }
              websocket.on_close do |websocket|
                Events::MessageAdded.unsubscribe subscription
              end
            end)
        else
          Mail.messages.to_json
        end
      end

      delete "/messages" do
        Mail.delete!
        status 204
      end

      get "/messages/:id.json" do
        id = params[:id].to_i
        if message = Mail.message(id)
          message.merge({
            "formats" => [
              "source",
              ("html" if Mail.message_has_html? id),
              ("plain" if Mail.message_has_plain? id)
            ].compact,
            "attachments" => Mail.message_attachments(id).map do |attachment|
              attachment.merge({"href" => "/messages/#{escape(id)}/parts/#{escape(attachment["cid"])}"})
            end,
          }).to_json
        else
          not_found
        end
      end

      get "/messages/:id.html" do
        id = params[:id].to_i
        if part = Mail.message_part_html(id)
          content_type part["type"], :charset => (part["charset"] || "utf8")

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
        if message = Mail.message(id)
          content_type "text/plain"
          message["source"]
        else
          not_found
        end
      end

      get "/messages/:id.eml" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type "message/rfc822"
          message["source"]
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

      get "/messages/:id/analysis.?:format?" do
        id = params[:id].to_i
        if part = Mail.message_part_html(id)
          # TODO: Server-side cache? Make the browser cache based on message create time? Hmm.
          uri = URI.parse("http://api.getfractal.com/api/v2/validate#{"/format/#{params[:format]}" if params[:format].present?}")
          response = Net::HTTP.post_form(uri, :api_key => "5c463877265251386f516f7428", :html => part["body"])
          content_type ".#{params[:format]}" if params[:format].present?
          body response.body
        else
          not_found
        end
      end

      delete "/messages/:id" do
        id = params[:id].to_i
        if message = Mail.message(id)
          MailCatcher::Mail.delete_message!(id)
          status 204
        else
          not_found
        end
      end

      not_found do
        haml :"404"
      end
    end
  end
end
