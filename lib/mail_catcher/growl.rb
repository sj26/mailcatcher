module MailCatcher
  module Growl
  module_function
    def start
      MailCatcher::Events::MessageAdded.subscribe MailCatcher::Growl.method :notify
    end

    def notify message
      system "growlnotify", "--name", "MailCatcher", "--message", "Message received:\n#{message["subject"]}"
    end

    # TODO: Native support on MacRuby with click backs
    #def click
    #end
  end
end
