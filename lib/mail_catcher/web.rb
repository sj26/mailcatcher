require "active_support/core_ext/module/delegation"
require "rack/builder"

require "mail_catcher/web/application"

module MailCatcher
  module Web extend self
    def app
      @@app ||= Rack::Builder.new do
        if ENV["MAILCATCHER_ENV"] == "development"
          require "mail_catcher/web/assets"
          map("/assets") { run Assets }
        end

        map("/") { run Application }
      end
    end

    delegate :call, :to => :app
  end
end
