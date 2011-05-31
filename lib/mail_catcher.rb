require 'active_support/all'
require 'daemons'
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
    :daemon => true,
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

        parser.on('-f', '--foreground', 'Run in the foreground') do
          options[:daemon] = false
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

    Thin::Logging.silent = true
    
    # One EventMachine loop...
    EventMachine.run do
      # TODO: DRY this up
      
      # Set up an SMTP server to run within EventMachine
      rescue_port options[:smtp_port] do
        EventMachine.start_server options[:smtp_ip], options[:smtp_port], Smtp
        puts "==> smtp://#{options[:smtp_ip]}:#{options[:smtp_port]}"
      end
      
      # Let Thin set itself up inside our EventMachine loop
      # (Skinny/WebSockets just works on the inside)
      rescue_port options[:http_port] do
        Thin::Server.start options[:http_ip], options[:http_port], Web
        puts "==> http://#{options[:http_ip]}:#{options[:http_port]}"
      end
      
      # Daemonize, if we should, but only after the servers have started.
      if options[:daemon]
        EventMachine.next_tick do
          puts "*** MailCatcher now runs as a daemon by default. Go to the web interface to quit."
          Process.daemon
        end
      end
    end
  end
  
  def self.quit!
    EventMachine.next_tick { EventMachine.stop_event_loop }
  end

protected 

  def self.rescue_port port
    begin
      yield
      
    # XXX: EventMachine only spits out RuntimeError with a string description
    rescue RuntimeError
      if $!.to_s =~ /\bno acceptor\b/
        puts "~~> ERROR: Something's using port #{port}. Are you already running MailCatcher?"
        exit -1
      else
        raise
      end
    end
  end
end
