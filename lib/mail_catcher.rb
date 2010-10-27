require 'eventmachine'
require 'thin'

module MailCatcher
  autoload :Events, 'mail_catcher/events'
  autoload :Mail, 'mail_catcher/mail'
  autoload :Smtp, 'mail_catcher/smtp'
  autoload :Web, 'mail_catcher/web'
  
  def self.run(options = {})
    options[:smtp_ip] ||= '127.0.0.1'
    options[:smtp_port] ||= 1025
    options[:http_ip] ||= '127.0.0.1'
    options[:http_port] ||= 1080
    
    puts "Starting MailCatcher"
    puts "==> smtp://#{options[:smtp_ip]}:#{options[:smtp_port]}"
    puts "==> http://#{options[:http_ip]}:#{options[:http_port]}"

    Thin::Logging.silent = true
    EventMachine.run do
      EventMachine.start_server options[:smtp_ip], options[:smtp_port], Smtp
      Thin::Server.start options[:http_ip], options[:http_port], Web
    end
  end
end
