# frozen_string_literal: true

require "rack/builder"

require "mail_catcher/web/application"

module MailCatcher
  module Web extend self
    def app
      @@app ||= Rack::Builder.new do

        auth_basic_username = ENV['AUTH_BASIC_USERNAME']
        auth_basic_password =  ENV['AUTH_BASIC_PASSWORD']

        if auth_basic_username && auth_basic_password
          use Rack::Auth::Basic do |username, password|
            username == auth_basic_username and password == auth_basic_password
          end
        end


        map(MailCatcher.options[:http_path]) do
          if MailCatcher.development?
            require "mail_catcher/web/assets"
            map("/assets") { run Assets }
          end

          run Application
        end

        # This should only affect when http_path is anything but "/" above
        run lambda { |env| [302, {"Location" => MailCatcher.options[:http_path]}, []] }
      end
    end

    def call(env)
      app.call(env)
    end
  end
end
