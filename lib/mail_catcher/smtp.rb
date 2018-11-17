require "midi-smtp-server"

require "mail_catcher/mail"

class MailCatcher::Smtp < MidiSmtpServer::Smtpd

  def initialize(ports = DEFAULT_SMTPD_PORT, hosts = DEFAULT_SMTPD_HOST, max_processings = DEFAULT_SMTPD_MAX_PROCESSINGS, opts = {})
    # set compatible modes and enable optional TLS and AUTH per default
    opts[:io_cmd_timeout] = nil
    opts[:tls_mode] = :TLS_OPTIONAL
    opts[:auth_mode] = :AUTH_OPTIONAL
    opts[:pipelining_extension] = true
    # initialize MidiSmtpServer::Smtpd
    super ports, hosts, max_processings, opts
  end

  def on_auth_event(ctx, authorization_id, authentication_id, authentication)
    # simply allow any combination of user and password
    if authentication_id != '' && authentication != ''
      # simulate successful authentification
      return 'mailcatcher'
    end
    # otherwise exit with authentification exception
    raise MidiSmtpServer::Smtpd535Exception
  end

  def on_message_data_event(ctx)
    # build current_message from ctx values
    current_message = {}
    current_message[:sender] = ctx[:envelope][:from]
    current_message[:recipients] = ctx[:envelope][:to]
    current_message[:source] = ctx[:message][:data]
    # append to MailCatcher
    MailCatcher::Mail.add_message current_message
    puts "==> SMTP: Received message from '#{current_message[:sender]}' (#{current_message[:source].length} bytes)"
  rescue => exception
    MailCatcher.log_exception("Error receiving message", @current_message, exception)
    # re-raise to signal error to smtp client
    raise
  end

end
