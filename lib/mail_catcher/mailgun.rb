# frozen_string_literal: true

require "rack/builder"

require "mail"

module MailCatcher
  class Application < Sinatra::Base
    set :environment, MailCatcher.env
    get "/" do
      'ok'
    end

    get "/count" do
      messages = MailCatcher::Mail.messages
      puts "*** message count #{messages.count}"
      {count: messages.count}.to_json
    end

    post "/v3/:domain/messages" do
      puts "mailgun from: #{params[:from]} to: #{params[:to]}, subject: #{params[:subject]}"
      mail = ::Mail.new do |mail|
        mail.to params[:to]
        mail.from params[:from]
        mail.subject params[:subject]
        mail.text_part do |part|
          part.body params[:text]
        end
        mail.html_part do |part|
          part.body params[:html]
        end
      end
      MailCatcher::Mail.add_message(
        sender: params[:from],
        recipients: params[:to],
        source: mail.to_s
      )
      status 201
    end

    not_found do
      puts "*** 404 at #{request.path} ***"
    end
  end
  module Mailgun extend self
    def app
      @@app ||= Rack::Builder.new do
        map('/') do
          run Application
        end
      end
    end

    def call(env)
      app.call(env)
    end
  end
end
