module MailCatcher
  module Notify
  module_function
  @type = nil

    def start type
      @type = type
      MailCatcher::Events::MessageAdded.subscribe MailCatcher::Notify.method :notify
    end

    def notify message
      image_path = File.expand_path(File.join(__FILE__, '..', '..', '..', 'public', 'images', 'logo_large.png'))

      case @type
        when "grownotify"
          system "growlnotify", "--image", image_path, "--name", "MailCatcher", "--message", "Message received:\n#{message["subject"]}"
        when "libnotify"
          require "libnotify"
          Libnotify.show(:summary => "Mailcatcher", :body => "Message received:\n#{message["subject"]}", :icon_path => image_path,:timeout => 2.5)
      end
    end

    # TODO: Native support on MacRuby with click backs
    #def click
    #end
  end
end
