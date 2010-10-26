require 'rubygems'
require 'eventmachine'
require 'json'
require 'ostruct'
require 'mail'
require 'thin'
require 'sqlite3'
require 'sinatra/base'
require 'sunshowers'

# Monkey-patch Sinatra to use Sunshowers
class Sinatra::Request < Rack::Request
  include Sunshowers::WebSocket
end

module MailCatcher
  def self.db
    @@__db ||= begin
      SQLite3::Database.new(':memory:', :results_as_hash => true, :type_translation => true).tap do |db|
        begin
          db.execute(<<-SQL)
            CREATE TABLE mail (
              id INTEGER PRIMARY KEY ASC,
              sender TEXT,
              recipients TEXT,
              subject TEXT,
              source BLOB,
              size TEXT,
              created_at DATETIME DEFAULT CURRENT_DATETIME
            )
          SQL
          db.execute(<<-SQL)
            CREATE TABLE part (
              id INTEGER PRIMARY KEY ASC,
              mail_id INTEGER NOT NULL,
              cid TEXT,
              type TEXT,
              is_attachment INTEGER,
              filename TEXT,
              body BLOB,
              size INTEGER,
              created_at DATETIME DEFAULT CURRENT_DATETIME
            )
          SQL
        rescue SQLite3::SQLException
        end
      end
    end
  end
  
  def self.subscribers
    @@subscribers ||= []
  end
  
  class SmtpServer < EventMachine::Protocols::SmtpServer
    def insert_message
      @@insert_message ||= MailCatcher.db.prepare("INSERT INTO mail (sender, recipients, subject, source, size, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))")
    end
    
    def insert_part
      @@insert_part ||= MailCatcher.db.prepare("INSERT INTO part (mail_id, cid, type, is_attachment, filename, body, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))")
    end
    
    def current_message
      @current_message ||= OpenStruct.new
    end
    
    def receive_reset
      @current_message = nil
      true
    end
    
    def receive_sender(sender)
      current_message.sender = sender
      true
    end
    
    def receive_recipient(recipient)
      current_message.recipients ||= []
      current_message.recipients << recipient
      true
    end
    
    def receive_data_chunk(lines)
      current_message.source ||= ""
      current_message.source += lines.join("\n")
      true
    end

    def receive_message
      MailCatcher.db.transaction do
        mail = Mail.new(current_message.source)
        result = insert_message.execute(current_message.sender, current_message.recipients.inspect, mail.subject, current_message.source, current_message.source.length)
        mail_id = MailCatcher.db.last_insert_row_id
        if mail.multipart?
          mail.all_parts.each do |part|
            body = part.body.to_s
            insert_part.execute(mail_id, part.cid, part.mime_type, part.attachment? ? 1 : 0, part.filename, body, body.length)
          end
        else
          body = mail.body.to_s
          insert_part.execute(mail_id, nil, mail.mime_type, 0, mail.filename, body, body.length)
        end
        puts "==> SMTP: Received message '#{mail.subject}' from '#{current_message.sender}'"
        true
      end
    rescue
      puts "*** Error receiving message: #{current_message.inspect}"
      puts "    Exception: #{$!}"
      puts "    Backtrace:"
      $!.backtrace.each do |line|
        puts "       #{line}"
      end
      puts "    Please submit this as an issue at http://github.com/sj26/mailcatcher/issues"
    ensure
      @current_message = nil
    end
  end
  
  class WebApp < Sinatra::Base
    set :views, File.expand_path(File.join(File.dirname(__FILE__), '..', 'views'))
    set :haml, {:format => :html5 }

    get '/' do
      haml :index
    end
    
    get '/mail' do
      if latest = MailCatcher.db.query('SELECT created_at FROM mail ORDER BY created_at DESC LIMIT 1').next
        last_modified latest["created_at"]
      end 
      MailCatcher.db.query('SELECT id, sender, recipients, subject, size, created_at FROM mail ORDER BY created_at DESC').to_a.to_json
    end
    
    get '/mail/:id.json' do
      mail_id = params[:id].to_i
      message = MailCatcher.db.query('SELECT * FROM mail WHERE id = ? LIMIT 1', mail_id).to_a.first
      if message
        last_modified message["created_at"]
        message["formats"] = ['eml']
        message["formats"] << 'html' if MailCatcher.db.query('SELECT id FROM part WHERE mail_id = ? AND type = "text/html" LIMIT 1', mail_id).next
        message["formats"] << 'txt' if MailCatcher.db.query('SELECT id FROM part WHERE mail_id = ? AND type = "text/plain" LIMIT 1', mail_id).next
        message["attachments"] = MailCatcher.db.query('SELECT cid, type, filename, size FROM part WHERE mail_id = ? AND is_attachment = 1 ORDER BY filename ASC', mail_id).to_a.map do |attachment|
          attachment.merge({"href" => "/mail/#{escape(params[:id])}/#{escape(attachment['cid'])}"})
        end
        message.to_json
      else
        not_found
      end
    end
    
    get '/mail/:id.html' do
      mail_id = params[:id].to_i
      part = MailCatcher.db.query('SELECT body, created_at FROM part WHERE mail_id = ? AND type = "text/html" LIMIT 1', mail_id).to_a.first
      if part
        content_type 'text/html'
        last_modified part["created_at"]
        part["body"].gsub(/cid:([^'"> ]+)/, "#{mail_id}/\\1")
      else
        not_found
      end
    end
    
    get '/mail/:id.txt' do
      part = MailCatcher.db.query('SELECT body, created_at FROM part WHERE mail_id = ? AND type = "text/plain" LIMIT 1', params[:id].to_i).to_a.first
      if part
        content_type 'text/plain'
        last_modified part["created_at"]
        part["body"]
      else
        not_found
      end
    end
    
    get '/mail/:id.eml' do
      content_type 'text/plain'
      message = MailCatcher.db.query('SELECT source, created_at FROM mail WHERE id = ? ORDER BY created_at DESC LIMIT 1', params[:id].to_i).to_a.first
      if message
        last_modified message["created_at"]
        message["source"]
      else
        not_found
      end
    end
    
    get '/mail/:id/:cid' do
      result = MailCatcher.db.query('SELECT * FROM part WHERE mail_id = ?', params[:id].to_i)
      part = result.find { |part| part["cid"] == params[:cid] }
      if part
        content_type part["type"]
        attachment part["filename"] if part["is_attachment"] == 1
        last_modified part["created_at"]
        body part["body"].to_s
      else
        not_found
      end
    end
    
    get '/mail/subscribe' do
      return head 400 unless request.ws?
      
      request.ws_handshake!
      request.ws_io.each do |message|
        ws_quit! if message == "goodbye"
      end
    end
    
    not_found do
      "<html><body><h1>No Dice</h1><p>The message you were looking for does not exist, or doesn't have content of this type.</p></body></html>"
    end
  end

  def self.run(options = {})
    options[:smtp_ip] ||= '127.0.0.1'
    options[:smtp_port] ||= 1025
    options[:http_ip] ||= '127.0.0.1'
    options[:http_port] ||= 1080
    
    puts "Starting MailCatcher"
    puts "==> smtp://#{options[:smtp_ip]}:#{options[:smtp_port]}"
    puts "==> http://#{options[:http_ip]}:#{options[:http_port]}"

    Thin::Logging.silent = true
    EM.run do
      EM.start_server options[:smtp_ip], options[:smtp_port], SmtpServer
      Thin::Server.start WebApp, options[:http_ip], options[:http_port]
    end
  end
end
