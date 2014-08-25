require "open3"
require "optparse"
require "rbconfig"

require "active_support/all"
require "eventmachine"
require "thin"

require "mail_catcher/events"
require "mail_catcher/mail"
require "mail_catcher/smtp"
require "mail_catcher/web"
require "mail_catcher/version"

module MailCatcher extend self
  def which(command)
    not windows? and Open3.popen3 'which', 'command' do |stdin, stdout, stderr|
      return stdout.read.chomp.presence
    end
  end

  def mac?
    RbConfig::CONFIG['host_os'] =~ /darwin/
  end

  def windows?
    RbConfig::CONFIG['host_os'] =~ /mswin|mingw/
  end

  def macruby?
    mac? and const_defined? :MACRUBY_VERSION
  end

  def browse?
    windows? or which "open"
  end

  def browse url
    if windows?
      system "start", "/b", url
    elsif which "open"
      system "open", url
    end
  end

  @@defaults = {
    :smtp_ip => '127.0.0.1',
    :smtp_port => '1025',
    :http_ip => '127.0.0.1',
    :http_port => '1080',
    :verbose => false,
    :daemon => !windows?,
    :browse => false,
    :quit => true,
  }

  def options
    @@options
  end

  def quittable?
    options[:quit]
  end

  def parse! arguments=ARGV, defaults=@defaults
    @@defaults.dup.tap do |options|
      OptionParser.new do |parser|
        parser.banner = "Usage: mailcatcher [options]"
        parser.version = VERSION

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

        parser.on("--no-quit", "Don't allow quitting the process") do
          options[:quit] = false
        end

        if mac?
          parser.on("--[no-]growl") do |growl|
            puts "Growl is no longer supported"
            exit -2
          end
        end

        unless windows?
          parser.on('-f', '--foreground', 'Run in the foreground') do
            options[:daemon] = false
          end
        end

        if browse?
          parser.on('-b', '--browse', 'Open web browser') do
            options[:browse] = true
          end
        end

        parser.on('-v', '--verbose', 'Be more verbose') do
          options[:verbose] = true
        end

        parser.on('-h', '--help', 'Display this help information') do
          puts parser
          exit
        end
      end.parse!
    end
  end

  def run! options=nil
    # If we are passed options, fill in the blanks
    options &&= options.reverse_merge @@defaults
    # Otherwise, parse them from ARGV
    options ||= parse!

    # Stash them away for later
    @@options = options

    # If we're running in the foreground sync the output.
    unless options[:daemon]
      $stdout.sync = $stderr.sync = true
    end

    puts "Starting MailCatcher"

    Thin::Logging.silent = (ENV["MAILCATCHER_ENV"] != "development")

    # One EventMachine loop...
    EventMachine.run do
      smtp_url = "smtp://#{options[:smtp_ip]}:#{options[:smtp_port]}"
      http_url = "http://#{options[:http_ip]}:#{options[:http_port]}"

      # Set up an SMTP server to run within EventMachine
      rescue_port options[:smtp_port] do
        EventMachine.start_server options[:smtp_ip], options[:smtp_port], Smtp
        puts "==> #{smtp_url}"
      end

      # Let Thin set itself up inside our EventMachine loop
      # (Skinny/WebSockets just works on the inside)
      rescue_port options[:http_port] do
        Thin::Server.start(options[:http_ip], options[:http_port], Web)
        puts "==> #{http_url}"
      end

      # Open the web browser before detatching console
      if options[:browse]
        EventMachine.next_tick do
          browse http_url
        end
      end

      # Daemonize, if we should, but only after the servers have started.
      if options[:daemon]
        EventMachine.next_tick do
          if quittable?
            puts "*** MailCatcher runs as a daemon by default. Go to the web interface to quit."
          else
            puts "*** MailCatcher is now running as a daemon that cannot be quit."
          end
          Process.daemon
        end
      end
    end
  end

  def quit!
    EventMachine.next_tick { EventMachine.stop_event_loop }
  end

protected

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
