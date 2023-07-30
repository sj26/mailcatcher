# frozen_string_literal: true

require "open3"
require "optparse"
require "rbconfig"

require "eventmachine"
require "thin"

module EventMachine
  # Monkey patch fix for 10deb4
  # See https://github.com/eventmachine/eventmachine/issues/569
  def self.reactor_running?
    (@reactor_running || false)
  end
end

require "mail_catcher/version"

module MailCatcher extend self
  autoload :Bus, "mail_catcher/bus"
  autoload :Mail, "mail_catcher/mail"
  autoload :Smtp, "mail_catcher/smtp"
  autoload :Web, "mail_catcher/web"

  def env
    ENV.fetch("MAILCATCHER_ENV", "production")
  end

  def development?
    env == "development"
  end

  def which?(command)
    ENV["PATH"].split(File::PATH_SEPARATOR).any? do |directory|
      File.executable?(File.join(directory, command.to_s))
    end
  end

  def windows?
    RbConfig::CONFIG["host_os"] =~ /mswin|mingw/
  end

  def browsable?
    windows? or which? "open"
  end

  def browse url
    if windows?
      system "start", "/b", url
    elsif which? "open"
      system "open", url
    end
  end

  def log_exception(message, context, exception)
    gems_paths = (Gem.path | [Gem.default_dir]).map { |path| Regexp.escape(path) }
    gems_regexp = %r{(?:#{gems_paths.join("|")})/gems/([^/]+)-([\w.]+)/(.*)}
    gems_replace = '\1 (\2) \3'

    puts "*** #{message}: #{context.inspect}"
    puts "    Exception: #{exception}"
    puts "    Backtrace:", *exception.backtrace.map { |line| "       #{line.sub(gems_regexp, gems_replace)}" }
    puts "    Please submit this as an issue at https://github.com/sj26/mailcatcher/issues"
  end

  @@defaults = {
    :smtp_ip => "127.0.0.1",
    :smtp_port => "1025",
    :http_ip => "127.0.0.1",
    :http_port => "1080",
    :http_path => "/",
    :messages_limit => nil,
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
        parser.separator ""
        parser.separator "MailCatcher v#{VERSION}"
        parser.separator ""

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

        parser.on("--messages-limit COUNT", Integer, "Only keep up to COUNT most recent messages") do |count|
          options[:messages_limit] = count
        end

        parser.on("--http-path PATH", String, "Add a prefix to all HTTP paths") do |path|
          clean_path = Rack::Utils.clean_path_info("/#{path}")

          options[:http_path] = clean_path
        end

        parser.on("--no-quit", "Don't allow quitting the process") do
          options[:quit] = false
        end

        unless windows?
          parser.on("-f", "--foreground", "Run in the foreground") do
            options[:daemon] = false
          end
        end

        if browsable?
          parser.on("-b", "--browse", "Open web browser") do
            options[:browse] = true
          end
        end

        parser.on("-v", "--verbose", "Be more verbose") do
          options[:verbose] = true
        end

        parser.on_tail("-h", "--help", "Display this help information") do
          puts parser
          exit
        end

        parser.on_tail("--version", "Display the current version") do
          puts "MailCatcher v#{VERSION}"
          exit
        end
      end.parse!
    end
  end

  def run! options=nil
    # If we are passed options, fill in the blanks
    options &&= @@defaults.merge options
    # Otherwise, parse them from ARGV
    options ||= parse!

    # Stash them away for later
    @@options = options

    # If we're running in the foreground sync the output.
    unless options[:daemon]
      $stdout.sync = $stderr.sync = true
    end

    puts "Starting MailCatcher v#{VERSION}"

    Thin::Logging.debug = development?
    Thin::Logging.silent = !development?

    # One EventMachine loop...
    EventMachine.run do
      # Set up an SMTP server to run within EventMachine
      rescue_port options[:smtp_port] do
        EventMachine.start_server options[:smtp_ip], options[:smtp_port], Smtp
        puts "==> #{smtp_url}"
      end

      # Let Thin set itself up inside our EventMachine loop
      # Faye connections are hijacked but continue to be supervised by thin
      rescue_port options[:http_port] do
        Thin::Server.start(options[:http_ip], options[:http_port], Web, signals: false)
        puts "==> #{http_url}"
      end

      # Make sure we quit nicely when asked
      # We need to handle outside the trap context, hence the timer
      %w(INT TERM QUIT).each do |signal|
        trap(signal) { EM.add_timer(0) { quit! } }
      end

      # Open the web browser before detaching console
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
    MailCatcher::Bus.push(type: "quit")

    EventMachine.next_tick { EventMachine.stop_event_loop }
  end

protected

  def smtp_url
    "smtp://#{@@options[:smtp_ip]}:#{@@options[:smtp_port]}"
  end

  def http_url
    "http://#{@@options[:http_ip]}:#{@@options[:http_port]}#{@@options[:http_path]}".chomp("/")
  end

  def rescue_port port
    begin
      yield

    # XXX: EventMachine only spits out RuntimeError with a string description
    rescue RuntimeError
      if $!.to_s =~ /\bno acceptor\b/
        puts "~~> ERROR: Something's using port #{port}. Are you already running MailCatcher?"
        puts "==> #{smtp_url}"
        puts "==> #{http_url}"
        exit -1
      else
        raise
      end
    end
  end
end
