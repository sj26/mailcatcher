# Apparently rubygems won't activate these on its own, so here we go. Let's
# repeat the invention of Bundler all over again.
gem "eventmachine", "1.0.9.1"
gem "midi-smtp-server", "~> 2.3.1"
gem "mail", "~> 2.3"
gem "rack", "~> 1.5"
gem "sinatra", "~> 1.2"
gem "sqlite3", "~> 1.3"
gem "thin", "~> 1.5.0"
gem "skinny", "~> 0.2.3"

require "open3"
require "optparse"
require "rbconfig"


require "midi-smtp-server"
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
  autoload :Events, "mail_catcher/events"
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

  def mac?
    RbConfig::CONFIG["host_os"] =~ /darwin/
  end

  def windows?
    RbConfig::CONFIG["host_os"] =~ /mswin|mingw/
  end

  def macruby?
    mac? and const_defined? :MACRUBY_VERSION
  end

  def browseable?
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
    puts "    Please submit this as an issue at http://github.com/sj26/mailcatcher/issues"
  end

  @@defaults = {
    :smtp_ip => "127.0.0.1",
    :smtp_port => "1025",
    :http_ip => "127.0.0.1",
    :http_port => "1080",
    :http_path => "/",
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

        parser.on("--smtp-tls", "Enable tls for the smtp server") do
          options[:smtp_tls] = true
        end

        parser.on("--http-ip IP", "Set the ip address of the http server") do |ip|
          options[:http_ip] = ip
        end

        parser.on("--http-port PORT", Integer, "Set the port address of the http server") do |port|
          options[:http_port] = port
        end

        parser.on("--http-path PATH", String, "Add a prefix to all HTTP paths") do |path|
          clean_path = Rack::Utils.clean_path_info("/#{path}")

          options[:http_path] = clean_path
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
          parser.on("-f", "--foreground", "Run in the foreground") do
            options[:daemon] = false
          end
        end

        if browseable?
          parser.on("-b", "--browse", "Open web browser") do
            options[:browse] = true
          end
        end

        parser.on("-v", "--verbose", "Be more verbose") do
          options[:verbose] = true
        end

        parser.on("-h", "--help", "Display this help information") do
          puts parser
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

    puts "Starting MailCatcher"

    Thin::Logging.debug = development?
    Thin::Logging.silent = !development?

    # One EventMachine loop...
    EventMachine.run do
      # Set up  MidiSmtpServer server to run within EventMachine loop
      rescue_port options[:smtp_port] do
        midi_smtp_server_opts = {}
        midi_smtp_server_opts[:tls_mode] = :TLS_OPTIONAL if options[:smtp_tls]
        midi_smtp_server_opts[:logger_severity] = development? ? 0:9
        Smtp.new(options[:smtp_port], options[:smtp_ip], 4, midi_smtp_server_opts).start
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
          # when daemonize redirect standard input, standard output and standard error to /dev/null
          $stdin.reopen "/dev/null"
          $stdout.reopen "/dev/null", "a"
          $stderr.reopen '/dev/null', 'a'
          # daemonize mode, reap the child automatically to prevent zombie
          if pid = fork
            Process.detach(pid)
            exit
          end
        end
      end
    end
  end

  def quit!
    EventMachine.next_tick { EventMachine.stop_event_loop }
  end

protected

  def smtp_url
    "smtp://#{@@options[:smtp_ip]}:#{@@options[:smtp_port]}"
  end

  def http_url
    "http://#{@@options[:http_ip]}:#{@@options[:http_port]}#{@@options[:http_path]}"
  end

  def rescue_port port
    begin
      yield

    # XXX: EventMachine only spits out RuntimeError with a string description
    # XXX: MidiSmtpServer uses seperate ErrorClass
    rescue RuntimeError, Errno::EADDRINUSE
      if $!.to_s =~ /\bno acceptor\b/ || $!.class == Errno::EADDRINUSE
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
