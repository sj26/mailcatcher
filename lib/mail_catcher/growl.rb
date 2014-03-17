require "mail_catcher/events"

module MailCatcher
  module Growl extend self
    def start
      MailCatcher::Events::MessageAdded.subscribe(method(:notify))
    end

    def notify message
      system "growlnotify",
        "--image", File.expand_path(File.join(__FILE__, "../public/images/logo_large.png")),
        "--name", "MailCatcher",
        "--message", "Message received:\n#{message["subject"]}"
    end
  end
end
