# frozen_string_literal: true

require "rack/builder"

require "./lib/mail_catcher/web/application"

module MailCatcher
  module Web
    module_function

    def app
      @@app ||= Rack::Builder.new do
        map(MailCatcher.options[:http_path]) do
          run Application
        end

        # This should only affect when http_path is anything but "/" above
        run ->(_env) { [302, { "Location" => MailCatcher.options[:http_path] }, []] }
      end
    end

    def call(env)
      app.call(env)
    end
  end
end
