require 'active_support/all'
require 'eventmachine'
require 'thin'

module MailCatcher
  extend ActiveSupport::Autoload
  
  autoload :Events
  autoload :Mail
  autoload :Smtp
  autoload :Web
  
  @@defaults = {
    :smtp_ip => '127.0.0.1',
    :smtp_port => '1025',
    :http_ip => '127.0.0.1',
    :http_port => '1080',
    :verbose => false,
  }
  
  def self.parse! arguments=ARGV, defaults=@@defaults
    @@defaults.dup.tap do |options|
      OptionParser.new do |parser|
        parser.banner = 'Usage: mailcatcher [options]'
        
        parser.on('--ip IP', 'Set the ip address of both servers') do |ip|
          options[:smtp_ip] = options[:http_ip] = ip
        end

        parser.on('--smtp-ip IP', 'Set the ip address of the smtp server') do |ip|
          options[:smtp_ip] = ip
        end

        parser.on('--smtp-port PORT', Integer, 'Set the port of the smtp server') do |port|
          options[:smtp_port] = port
        end

        parser.on('--http-ip IP', 'Set the ip address of the http server') do |ip|
          options[:http_ip] = ip
        end

        parser.on('--http-port PORT', Integer, 'Set the port address of the http server') do |port|
          options[:http_port] = port
        end

        parser.on('-v', '--verbose', 'Be more verbose') do
          options[:verbose] = true
        end

        parser.on('-h', '--help', 'Display this help information') do
          puts parser
          exit!
        end
      end.parse!
    end
  end
  
  def self.run! options=nil
    # If we are passed options, fill in the blanks
    options &&= @@defaults.merge options
    # Otherwise, parse them from ARGV
    options ||= parse!
    
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
