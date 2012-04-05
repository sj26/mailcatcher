require 'active_support/all'
require 'eventmachine'
require 'optparse'
require 'rbconfig'
require 'thin'
require 'launchy'

module MailCatcher
  extend ActiveSupport::Autoload

  autoload :Events
  autoload :Growl
  autoload :Mail
  autoload :Smtp
  autoload :Web

module_function

  def mac?
    RbConfig::CONFIG['host_os'] =~ /darwin/
  end

  def windows?
    RbConfig::CONFIG['host_os'] =~ /mswin|mingw/
  end

  def macruby?
    mac? and const_defined? :MACRUBY_VERSION
  end

  def growlnotify?
    system "which", "-s", "growlnotify"
  end

  def growlframework?
    macruby? and
    # TODO: Look for growl framework accessible
    false
  end

  def growl?
    growlnotify? or growlframework?
  end

  @@defaults = {
    :smtp_ip => '127.0.0.1',
    :smtp_port => '1025',
    :http_ip => '127.0.0.1',
    :http_port => '1080',
    :verbose => false,
    :daemon => !windows?,
    :growl => growlnotify?,
  }

  def parse! arguments=ARGV, defaults=@@defaults
    @@defaults.dup.tap do |options|
      OptionParser.new do |parser|
        parser.banner = "Usage: mailcatcher [options]"
        parser.version = File.read(File.expand_path("../../VERSION", __FILE__))

        parser.on("--ip IP", "Set the ip address of both servers") do |ip|
          options[:smtp_ip] = options[:http_ip] = ip
        end

        parser.on("--smtp-ip IP", "Set the ip address of the smtp server") do |ip|
          options[:smtp_ip] = ip
        end

        parser.on("--smtp-port PORT", Integer, "Set the port of the smtp server") do |port|
          options[:smtp_port] = port
        end

        parser.on("--http-ip IP", "Set the ip address of the http server") do |ip|
          options[:http_ip] = ip
        end

        parser.on("--http-port PORT", Integer, "Set the port address of the http server") do |port|
          options[:http_port] = port
        end

        if mac?
          parser.on("--[no-]growl", "Growl to the local machine when a message arrives") do |growl|
            if growl and not growlnotify?
              puts "You'll need to install growlnotify from the Growl installer."
              puts
              puts "See: http://growl.info/extras.php#growlnotify"
              exit!
            end

            options[:growl] = growl
          end
        end

        unless windows?
          parser.on('-f', '--foreground', 'Run in the foreground') do
            options[:daemon] = false
          end
        end

        parser.on('-o', '--open', 'Open the web interface in your default browser on startup') do |open|
          options[:open] = open
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

  def run! options=nil
    # If we are passed options, fill in the blanks
    options &&= @@defaults.merge options
    # Otherwise, parse them from ARGV
    options ||= parse!

    puts "Starting MailCatcher"

    Thin::Logging.silent = true

    # One EventMachine loop...
    EventMachine.run do
      # Get our lion on if asked
      MailCatcher::Growl.start if options[:growl]

      smtp_url = "smtp://#{options[:smtp_ip]}:#{options[:smtp_port]}"
      http_url = "http://#{options[:http_ip]}:#{options[:http_port]}"

      # TODO: DRY this up

      # Set up an SMTP server to run within EventMachine
      rescue_port options[:smtp_port] do
        EventMachine.start_server options[:smtp_ip], options[:smtp_port], Smtp
        puts "==> #{smtp_url}"
      end

      # Let Thin set itself up inside our EventMachine loop
      # (Skinny/WebSockets just works on the inside)
      rescue_port options[:http_port] do
        Thin::Server.start options[:http_ip], options[:http_port], Web
        puts "==> #{http_url}"
      end

      # Open the web interface if asked
      if options[:open]
        Launchy.open(http_url)
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

  def quit!
    EventMachine.next_tick { EventMachine.stop_event_loop }
  end

protected
module_function

  def rescue_port port
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
