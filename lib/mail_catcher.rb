# frozen_string_literal: true

require 'async/io/address_endpoint'
require 'async/http/endpoint'
require 'async/websocket/adapters/rack'
require 'async/io/shared_endpoint'
require 'falcon'
require "open3"
require "optparse"
require "rbconfig"
require 'socket'
require 'mail'

require "mail_catcher/version"

module MailCatcher extend self
  autoload :Bus, "mail_catcher/bus"
  autoload :Mail, "mail_catcher/mail"
  autoload :SMTP, "mail_catcher/smtp"
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

        if browseable?
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

    Async.run do
      @smtp_address = Async::IO::Address.tcp(options[:smtp_ip], options[:smtp_port])
      @smtp_endpoint = Async::IO::AddressEndpoint.new(@smtp_address)
      @smtp_socket = rescue_port(options[:smtp_port]) { @smtp_endpoint.bind }
      puts "==> #{smtp_url}"

      @http_address = Async::IO::Address.tcp(options[:http_ip], options[:http_port])
      @http_endpoint = Async::IO::AddressEndpoint.new(@http_address)
      @http_socket = rescue_port(options[:http_port]) { @http_endpoint.bind }
      puts "==> #{http_url}"
    end

    Async.logger.level = :debug if options[:verbose]

    if options[:daemon]
      if quittable?
        puts "*** MailCatcher runs as a daemon by default. Go to the web interface to quit."
      else
        puts "*** MailCatcher is now running as a daemon that cannot be quit."
      end
      Process.daemon
    end

    Async::Reactor.run do |task|
      smtp_endpoint = MailCatcher::SMTP::URLEndpoint.new(URI.parse(smtp_url), @smtp_endpoint)
      smtp_server = MailCatcher::SMTP::Server.new(smtp_endpoint) do |envelope|
        MailCatcher::Mail.add_message(sender: envelope.sender, recipients: envelope.recipients,
                                      source: envelope.content)
      end

      smtp_task = task.async do |task|
        task.annotate "binding to #{@smtp_socket.local_address.inspect}"

        begin
          @smtp_socket.listen(Socket::SOMAXCONN)
          @smtp_socket.accept_each(task: task, &smtp_server.method(:accept))
        ensure
          @smtp_socket.close
        end
      end

      http_endpoint = Async::HTTP::Endpoint.new(URI.parse(http_url), @http_endpoint)
      http_app = Falcon::Adapters::Rack.new(Web.app)
      http_server = Falcon::Server.new(http_app, http_endpoint)

      task.async do |task|
        task.annotate "binding to #{@http_socket.local_address.inspect}"

        begin
          @http_socket.listen(Socket::SOMAXCONN)
          @http_socket.accept_each(task: task, &http_server.method(:accept))
        ensure
          @http_socket.close
        end
      end

      browse(http_url) if options[:browse]
    end
  rescue Interrupt
    # Cool story
  end

  def quit!
    Async::Task.current.reactor.stop
  end

  def http_url
    "http://#{@@options[:http_ip]}:#{@@options[:http_port]}#{@@options[:http_path]}"
  end

  protected

  def smtp_url
    "smtp://#{@@options[:smtp_ip]}:#{@@options[:smtp_port]}"
  end

  def rescue_port port
    begin
      yield
    rescue Errno::EADDRINUSE
      puts "~~> ERROR: Something's using port #{port}. Are you already running MailCatcher?"
      puts "==> #{smtp_url}"
      puts "==> #{http_url}"
      exit(-1)
    end
  end
end
