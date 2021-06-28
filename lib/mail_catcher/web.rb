# frozen_string_literal: true

require "rack/builder"

# require '/Users/ahmedgagan/Rails Gem/mailcatcher/lib/mail_catcher/web/application'
require "mail_catcher/web/application"

module MailCatcher
  module Web extend self
    def app
      @@app ||= Rack::Builder.new do
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
