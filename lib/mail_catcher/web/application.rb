# frozen_string_literal: true

require "pathname"
require "net/http"
require "uri"

require "faye/websocket"
require "sinatra"

require "mail_catcher/bus"
require "mail_catcher/mail"

Faye::WebSocket.load_adapter("thin")

# Faye's adapter isn't smart enough to close websockets when thin is stopped,
# so we teach it to do so.
class Thin::Backends::Base
  alias :thin_stop :stop

  def stop
    thin_stop
    @connections.each_value do |connection|
      if connection.socket_stream
        connection.socket_stream.close_connection_after_writing
      end
    end
  end
end

class Sinatra::Request
  include Faye::WebSocket::Adapter
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

          def generate_plugin_openapi_spec(request)
            base_url = "#{request.scheme}://#{request.host_with_port}#{settings.prefix}"

            {
              openapi: "3.0.0",
              info: {
                title: "MailCatcher NG Plugin API",
                description: "API for searching and extracting data from caught emails",
                version: MailCatcher::VERSION
              },
              servers: [
                { url: base_url, description: "MailCatcher Server" }
              ],
              paths: {
                "/plugin/search": {
                  post: {
                    summary: "Search emails",
                    description: "Search through caught emails with flexible filtering",
                    parameters: [
                      {
                        name: "query",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "Search term"
                      },
                      {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 5 },
                        description: "Maximum results"
                      }
                    ],
                    responses: {
                      "200": {
                        description: "Search results",
                        content: {
                          "application/json": {
                            schema: {
                              type: "object",
                              properties: {
                                count: { type: "integer" },
                                messages: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      id: { type: "integer" },
                                      from: { type: "string" },
                                      to: { type: "array", items: { type: "string" } },
                                      subject: { type: "string" },
                                      created_at: { type: "string" }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "/plugin/message/{id}/latest": {
                  get: {
                    summary: "Get latest message for recipient",
                    parameters: [
                      {
                        name: "recipient",
                        in: "query",
                        required: true,
                        schema: { type: "string" }
                      },
                      {
                        name: "subject_contains",
                        in: "query",
                        required: false,
                        schema: { type: "string" }
                      }
                    ],
                    responses: {
                      "200": { description: "Message details" },
                      "404": { description: "No matching message" }
                    }
                  }
                },
                "/plugin/message/{id}/tokens": {
                  get: {
                    summary: "Extract tokens from message",
                    parameters: [
                      {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" }
                      },
                      {
                        name: "kind",
                        in: "query",
                        required: false,
                        schema: {
                          type: "string",
                          enum: ["magic_link", "otp", "reset_token", "all"]
                        }
                      }
                    ],
                    responses: {
                      "200": { description: "Extracted tokens" }
                    }
                  }
                },
                "/plugin/message/{id}/auth-info": {
                  get: {
                    summary: "Get authentication information",
                    parameters: [
                      {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" }
                      }
                    ],
                    responses: {
                      "200": { description: "Auth information" }
                    }
                  }
                },
                "/plugin/message/{id}/preview": {
                  get: {
                    summary: "Get HTML preview of message",
                    parameters: [
                      {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" }
                      },
                      {
                        name: "mobile",
                        in: "query",
                        required: false,
                        schema: { type: "boolean" }
                      }
                    ],
                    responses: {
                      "200": { description: "HTML preview" }
                    }
                  }
                },
                "/plugin/messages": {
                  delete: {
                    summary: "Delete all messages",
                    responses: {
                      "204": { description: "All messages deleted" }
                    }
                  }
                }
              }
            }.to_json
          end
        end
      end

      get "/" do
        @version = MailCatcher::VERSION
        erb :index
      end

      get "/websocket-test" do
        erb :websocket_test
      end

      get "/version.json" do
        content_type :json
        JSON.generate({
          version: MailCatcher::VERSION
        })
      end

      get "/server-info" do
        @version = MailCatcher::VERSION
        @smtp_ip = MailCatcher.options[:smtp_ip]
        @smtp_port = MailCatcher.options[:smtp_port]
        @http_ip = MailCatcher.options[:http_ip]
        @http_port = MailCatcher.options[:http_port]
        @http_path = MailCatcher.options[:http_path]

        # Get current connection counts
        @http_connections = MailCatcher.http_server&.backend&.size || 0
        @smtp_connections = MailCatcher::Smtp.connection_count

        require "socket"
        if @http_ip == "127.0.0.1"
          @hostname = "localhost"
          @fqdn = "localhost"
        else
          begin
            hostname = Socket.gethostname
            fqdn = Socket.getfqdn(Socket.gethostname)
          rescue
            hostname = "unknown"
            fqdn = "unknown"
          end
          @hostname = hostname
          @fqdn = fqdn
        end

        # Fetch all SMTP transcripts and flatten entries for display
        transcripts = Mail.all_transcript_entries
        @log_entries = transcripts.flat_map do |transcript|
          transcript['entries'].map do |entry|
            entry.merge({
              'session_id' => transcript['session_id'],
              'client_ip' => transcript['client_ip'],
              'server_port' => transcript['server_port'],
              'tls_enabled' => transcript['tls_enabled']
            })
          end
        end.sort_by { |e| e['timestamp'] }

        erb :server_info
      end

      get "/logs.json" do
        content_type :json
        transcripts = Mail.all_transcript_entries
        log_entries = transcripts.flat_map do |transcript|
          transcript['entries'].map do |entry|
            entry.merge({
              'session_id' => transcript['session_id'],
              'client_ip' => transcript['client_ip'],
              'server_port' => transcript['server_port'],
              'tls_enabled' => transcript['tls_enabled']
            })
          end
        end.sort_by { |e| e['timestamp'] }

        JSON.generate(entries: log_entries)
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
          bus_subscription = nil
          ping_timer = nil
          session_id = SecureRandom.uuid
          client_ip = request.ip

          ws = Faye::WebSocket.new(request.env)

          ws.on(:open) do |_|
            $stderr.puts "[WebSocket] Connection opened (session: #{session_id}, ip: #{client_ip})"
            MailCatcher::Mail.create_websocket_connection(session_id, client_ip)

            bus_subscription = MailCatcher::Bus.subscribe do |message|
              begin
                $stderr.puts "[WebSocket] Sending message: #{message.inspect}"
                ws.send(JSON.generate(message))
              rescue => exception
                $stderr.puts "[WebSocket] Error sending message: #{exception.message}"
                MailCatcher.log_exception("Error sending message through websocket", message, exception)
              end
            end

            # Send initial ping and set up periodic ping timer (every 30 seconds)
            ping_interval = 30
            ping_timer = EventMachine.add_periodic_timer(ping_interval) do
              begin
                $stderr.puts "[WebSocket] Sending ping (session: #{session_id})"
                MailCatcher::Mail.record_websocket_ping(session_id)
                ws.send(JSON.generate({ type: "ping" }))
              rescue => exception
                $stderr.puts "[WebSocket] Error sending ping: #{exception.message}"
              end
            end
          end

          ws.on(:message) do |event|
            begin
              data = JSON.parse(event.data)
              if data["type"] == "pong"
                $stderr.puts "[WebSocket] Received pong (session: #{session_id})"
                MailCatcher::Mail.record_websocket_pong(session_id)
              end
            rescue => exception
              $stderr.puts "[WebSocket] Error processing message: #{exception.message}"
            end
          end

          ws.on(:close) do |_|
            $stderr.puts "[WebSocket] Connection closed (session: #{session_id})"
            EventMachine.cancel_timer(ping_timer) if ping_timer
            MailCatcher::Bus.unsubscribe(bus_subscription) if bus_subscription
            MailCatcher::Mail.close_websocket_connection(session_id)
          end

          ws.on(:error) do |event|
            $stderr.puts "[WebSocket] WebSocket error: #{event} (session: #{session_id})"
          end

          ws.rack_response
        else
          content_type :json
          JSON.generate(Mail.messages)
        end
      end

      get "/messages/search" do
        content_type :json
        begin
          results = Mail.search_messages(
            query: params[:q],
            has_attachments: params[:has_attachments] == 'true',
            from_date: params[:from],
            to_date: params[:to]
          )
          JSON.generate(results)
        rescue => e
          status 400
          JSON.generate({ error: e.message, backtrace: e.backtrace.first(5) })
        end
      end

      delete "/messages" do
        Mail.delete!
        status 204
      end

      get "/messages/:id.json" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          JSON.generate(message.merge({
            "content_type" => message["type"],
            "formats" => [
              "source",
              ("html" if Mail.message_has_html? id),
              ("plain" if Mail.message_has_plain? id),
              ("transcript" if Mail.message_transcript(id))
            ].compact,
            "attachments" => Mail.message_attachments(id),
            "bimi_location" => Mail.message_bimi_location(id),
            "preview_text" => Mail.message_preview_text(id),
            "authentication_results" => Mail.message_authentication_results(id),
            "encryption_data" => Mail.message_encryption_data(id),
            "from_header" => Mail.message_from(id),
            "to_header" => Mail.message_to(id)
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
          body = body.gsub /cid:([^'"> ]+)/, "#{id}/parts/\\1"

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

      get "/messages/:id/transcript.json" do
        id = params[:id].to_i
        if transcript = Mail.message_transcript(id)
          content_type :json
          JSON.generate(transcript)
        else
          not_found
        end
      end

      get "/messages/:id.transcript" do
        id = params[:id].to_i
        if transcript = Mail.message_transcript(id)
          content_type :html, charset: "utf-8"
          erb :transcript, locals: { transcript: transcript }
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

      get "/messages/:id/extract" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          JSON.generate(Mail.extract_tokens(id, type: params[:type]))
        else
          not_found
        end
      end

      get "/messages/:id/links.json" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          JSON.generate(Mail.extract_all_links(id))
        else
          not_found
        end
      end

      get "/messages/:id/parsed.json" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          JSON.generate(Mail.parse_message_structured(id))
        else
          not_found
        end
      end

      get "/messages/:id/accessibility.json" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          begin
            JSON.generate(Mail.accessibility_score(id))
          rescue => e
            status 500
            JSON.generate({ error: e.message })
          end
        else
          not_found
        end
      end

      post "/messages/:id/forward" do
        id = params[:id].to_i
        if message = Mail.message(id)
          content_type :json
          result = Mail.forward_message(id)

          if result[:error]
            status 500
            JSON.generate(result)
          else
            JSON.generate(result)
          end
        else
          not_found
        end
      end

      delete "/messages/:id" do
        id = params[:id].to_i
        if Mail.message(id)
          Mail.delete_message!(id)
          status 204
        else
          not_found
        end
      end

      # Claude Plugin Routes
      # These routes provide Claude Plugin marketplace compatible endpoints

      get "/.well-known/ai-plugin.json" do
        content_type :json
        {
          schema_version: "v1",
          name_for_human: "MailCatcher NG",
          name_for_model: "MailCatcher",
          description_for_human: "Inspect, search, and extract data from caught emails for testing and debugging",
          description_for_model: "Plugin for MailCatcher NG - a mail catching and inspection tool. Allows searching emails, extracting authentication tokens, parsing email structure, and managing caught messages.",
          auth: { type: "none" },
          api: {
            type: "openapi",
            url: "#{request.base_url}#{settings.prefix}/plugin/openapi.json"
          },
          logo_url: "#{request.base_url}#{settings.prefix}/assets/logo.png",
          contact_email: "support@mailcatcher.app",
          legal_info_url: "#{request.base_url}#{settings.prefix}/"
        }.to_json
      end

      get "/plugin/openapi.json" do
        content_type :json
        generate_plugin_openapi_spec(request)
      end

      post "/plugin/search" do
        content_type :json
        begin
          query = params[:query]
          limit = (params[:limit] || 5).to_i

          unless query
            return status(400) && JSON.generate({ error: "query parameter is required" })
          end

          results = Mail.search_messages(query: query)
          results = results.slice(0, limit)

          JSON.generate({
            count: results.size,
            messages: results.map { |msg|
              {
                id: msg["id"],
                from: msg["sender"],
                to: msg["recipients"],
                subject: msg["subject"],
                created_at: msg["created_at"]
              }
            }
          })
        rescue => e
          status 400
          JSON.generate({ error: e.message })
        end
      end

      get "/plugin/message/:id/latest" do
        content_type :json
        begin
          recipient = params[:recipient]
          subject_contains = params[:subject_contains]

          unless recipient
            return status(400) && JSON.generate({ error: "recipient parameter is required" })
          end

          all_messages = Mail.messages
          matching = all_messages.select do |msg|
            recipients = msg["recipients"]
            recipients_array = recipients.is_a?(Array) ? recipients : [recipients]
            recipients_array.any? { |r| r.to_s.include?(recipient) }
          end

          matching = matching.select { |msg| msg["subject"].to_s.include?(subject_contains) } if subject_contains

          latest = matching.max_by { |msg| msg["created_at"] }

          if latest
            msg = latest
            JSON.generate({
              id: msg["id"],
              from: msg["sender"],
              to: msg["recipients"],
              subject: msg["subject"],
              size: msg["size"],
              created_at: msg["created_at"]
            })
          else
            not_found
          end
        rescue => e
          status 400
          JSON.generate({ error: e.message })
        end
      end

      get "/plugin/message/:id/tokens" do
        id = params[:id].to_i
        content_type :json

        unless Mail.message(id)
          return not_found
        end

        begin
          kind = params[:kind] || "all"

          type_map = {
            "magic_link" => "link",
            "otp" => "otp",
            "reset_token" => "token",
            "all" => "all"
          }

          type = type_map[kind]
          return status(400) && JSON.generate({ error: "Invalid kind: #{kind}" }) unless type

          if kind == "all"
            JSON.generate({
              magic_links: Mail.extract_tokens(id, type: 'link'),
              otps: Mail.extract_tokens(id, type: 'otp'),
              reset_tokens: Mail.extract_tokens(id, type: 'token')
            })
          else
            JSON.generate({
              extracted: Mail.extract_tokens(id, type: type)
            })
          end
        rescue => e
          status 400
          JSON.generate({ error: e.message })
        end
      end

      get "/plugin/message/:id/auth-info" do
        id = params[:id].to_i
        content_type :json

        unless Mail.message(id)
          return not_found
        end

        begin
          parsed = Mail.parse_message_structured(id)
          JSON.generate({
            verification_url: parsed[:verification_url],
            otp_code: parsed[:otp_code],
            reset_token: parsed[:reset_token],
            unsubscribe_link: parsed[:unsubscribe_link],
            links_count: parsed[:all_links]&.count || 0
          })
        rescue => e
          status 400
          JSON.generate({ error: e.message })
        end
      end

      get "/plugin/message/:id/preview" do
        id = params[:id].to_i
        content_type :html

        html_part = Mail.message_part_html(id)
        unless html_part
          return status(404) && "No HTML content found"
        end

        begin
          mobile = params[:mobile] == 'true'
          body = html_part["body"].to_s

          if mobile && !body.include?("viewport")
            body = "<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head>\n" + body
          end

          if body.bytesize > 200_000
            body = body[0, 200_000] + "\n<!-- Truncated for display -->"
          end

          body
        rescue => e
          status 400
          "Error generating preview: #{e.message}"
        end
      end

      delete "/plugin/messages" do
        status 204
        Mail.delete!
      end

      delete "/plugin/message/:id" do
        id = params[:id].to_i
        if Mail.message(id)
          Mail.delete_message!(id)
          status 204
        else
          not_found
        end
      end

      not_found do
        erb :"404"
      end
    end
  end
end
