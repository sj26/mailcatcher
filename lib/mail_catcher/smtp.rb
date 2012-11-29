require 'eventmachine'
require 'mail'

class MailCatcher::Smtp < EventMachine::Protocols::SmtpServer
  # We override EM's mail from processing to allow multiple mail-from commands
  # per [RFC 2821](http://tools.ietf.org/html/rfc2821#section-4.1.1.2)
  def process_mail_from sender
    if @state.include? :mail_from
      @state -= [:mail_from, :rcpt, :data]
      receive_reset
    end

    super
  end

  def current_message
    @current_message ||= {}
  end

  def receive_reset
    @current_message = nil
    true
  end

  def receive_sender(sender)
    current_message[:sender] = sender
    true
  end

  def ms_logger
    #print fake log lines
    recipient = current_message[:recipients][0]
    sender = current_message[:sender]

    ts = Time.now.to_i
    puts "#{ts}@00/00-25004-31B987F3@00/00-03736-F4101B54@00/00-04532-A3456B54@R@#{recipient}@#{sender}@10.0.1.1@201@esmtp@default@default"
    logger.info("#{ts}@00/00-25004-31B987F3@00/00-03736-F4101B54@00/00-04532-A3456B54@R@#{recipient}@#{sender}@10.0.1.1@201@esmtp@default@default")

    ts = Time.now.to_i
    puts "#{ts}@20/00-25593-945A87F3@00/00-03736-F4101B54@00/00-04532-A3456B54@D@mail.vresp.com@266@group-a@binding-a@0@0.393@10.0.0.1"
    logger.info("#{ts}@20/00-25593-945A87F3@00/00-03736-F4101B54@00/00-04532-A3456B54@D@mail.vresp.com@266@group-a@binding-a@0@0.393@10.0.0.1")
    ts = Time.now.to_i
  end

  def receive_recipient(recipient)
    current_message[:recipients] ||= []
    current_message[:recipients] << recipient
    true
  end

  def receive_data_chunk(lines)
    current_message[:source] ||= ""
    lines.each do |line|
      # RFC821 4.5.2 says leading periods should be stripped from the body data.
      current_message[:source] << line.sub(/\A\./, "") << "\n"
    end
    true
  end

  def receive_message
    MailCatcher::Mail.add_message current_message
    ms_logger 
    puts "==> SMTP: Received message from '#{current_message[:sender]}' (#{current_message[:source].length} bytes)"
    true
  rescue
    puts "*** Error receiving message: #{current_message.inspect}"
    puts "    Exception: #{$!}"
    puts "    Backtrace:"
    $!.backtrace.each do |line|
      puts "       #{line}"
    end
    puts "    Please submit this as an issue at http://github.com/sj26/mailcatcher/issues"
    false
  ensure
    @current_message = nil
  end
end
