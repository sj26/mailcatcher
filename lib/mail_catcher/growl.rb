module MailCatcher
  module Growl extend self
    def start
      MailCatcher::Events::MessageAdded.subscribe MailCatcher::Growl.method :notify
      MailCatcher::Events::BounceAdded.subscribe MailCatcher::Growl.method :notify_bounce
    end

    def notify message
      image_path = File.expand_path(File.join(__FILE__, '..', '..', '..', 'public', 'images', 'logo_large.png'))
      system "growlnotify", "--image", image_path, "--name", "MailCatcher", "--message", "Message received:\n#{message["subject"]}"
    end

    def notify_bounce message
      system "growlnotify", "--name", "MailCatcher", "--message", "Message bounced:\n#{message["subject"]}"
    end

    # TODO: Native support on MacRuby with click backs
    #def click
    #end
  end
end
