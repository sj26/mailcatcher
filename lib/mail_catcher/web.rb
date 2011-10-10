require 'sinatra'
require 'pathname'
require 'net/http'
require 'uri'

require 'skinny'

class Sinatra::Request
  include Skinny::Helpers
end

class MailCatcher::Web < Sinatra::Base
  set :root, Pathname.new(__FILE__).dirname.parent.parent
  set :haml, :format => :html5

  get '/' do
    haml :index
  end

  delete '/' do
    MailCatcher.quit!
    status 204
  end

  get '/messages' do
    if request.websocket?
      puts "Gots a websocket"
      request.websocket!(
        :protocol => "MailCatcher 0.2 Message Push",
        :on_start => proc do |websocket|
          subscription = MailCatcher::Events::MessageAdded.subscribe { |message| websocket.send_message message.to_json }
          websocket.on_close do |websocket|
            MailCatcher::Events::MessageAdded.unsubscribe subscription
          end
        end)
    else
      MailCatcher::Mail.messages.to_json
    end
  end

  delete '/messages' do
    MailCatcher::Mail.delete!
    status 204
  end

  get '/messages/:id.json' do
    id = params[:id].to_i
    if message = MailCatcher::Mail.message(id)
      message.merge({
        "formats" => [
          "source",
          ("html" if MailCatcher::Mail.message_has_html? id),
          ("plain" if MailCatcher::Mail.message_has_plain? id),
        ].compact,
        "attachments" => MailCatcher::Mail.message_attachments(id).map do |attachment|
          attachment.merge({"href" => "/messages/#{escape(id)}/#{escape(attachment['cid'])}"})
        end,
      }).to_json
    else
      not_found
    end
  end

  get '/messages/:id.html' do
    id = params[:id].to_i
    if part = MailCatcher::Mail.message_part_html(id)
      content_type part["type"], :charset => (part["charset"] || "utf8")

      body = part["body"]

      # Rewrite body to link to embedded attachments served by cid
      body.gsub! /cid:([^'"> ]+)/, "#{id}/parts/\\1"

      # Rewrite body to open links in a new window
      body.gsub! /<a\s+/, '<a target="_blank" '

      body
    else
      not_found
    end
  end

  get "/messages/:id.plain" do
    id = params[:id].to_i
    if part = MailCatcher::Mail.message_part_plain(id)
      content_type part["type"], :charset => (part["charset"] || "utf8")
      part["body"]
    else
      not_found
    end
  end

  get "/messages/:id.source" do
    id = params[:id].to_i
    if message = MailCatcher::Mail.message(id)
      content_type "text/plain"
      message["source"]
    else
      not_found
    end
  end

  get "/messages/:id.eml" do
    id = params[:id].to_i
    if message = MailCatcher::Mail.message(id)
      content_type "message/rfc822"
      message["source"]
    else
      not_found
    end
  end

  get "/messages/:id/parts/:cid" do
    id = params[:id].to_i
    if part = MailCatcher::Mail.message_part_cid(id, params[:cid])
      content_type part["type"], :charset => (part["charset"] || "utf8")
      attachment part["filename"] if part["is_attachment"] == 1
      body part["body"].to_s
    else
      not_found
    end
  end

  get "/messages/:id/analysis.?:format?" do
    id = params[:id].to_i
    if part = MailCatcher::Mail.message_part_html(id)
      # TODO: Server-side cache? Make the browser cache based on message create time? Hmm.
      uri = URI.parse("http://api.getfractal.com/api/v2/validate#{"/format/#{params[:format]}" if params[:format].present?}")
      response = Net::HTTP.post_form(uri, :api_key => "5c463877265251386f516f7428", :html => part["body"])
      content_type ".#{params[:format]}" if params[:format].present?
      body response.body
    else
      not_found
    end
  end

  not_found do
    "<html><body><h1>No Dice</h1><p>The message you were looking for does not exist, or doesn't have content of this type.</p></body></html>"
  end
end
