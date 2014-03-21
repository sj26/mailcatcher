require "minitest/autorun"
require "mail_catcher"
require "socket"
require "net/smtp"

SMTP_PORT = 10025
HTTP_PORT = 10080

# Start MailCatcher
MAILCATCHER_PID = spawn "bundle", "exec", "mailcatcher", "--foreground", "--smtp-port", SMTP_PORT.to_s, "--http-port", HTTP_PORT.to_s

# Make sure it will be stopped
MiniTest.after_run do
  Process.kill("TERM", MAILCATCHER_PID) and Process.wait
end

# Wait for it to boot
begin
  TCPSocket.new("127.0.0.1", SMTP_PORT).close
rescue Errno::ECONNREFUSED
  retry
end

describe MailCatcher do
  def deliver(message, options={})
    options = {:from => "from@example.com", :to => "to@example.com"}.merge(options)
    Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
      smtp.send_message message, options[:from], options[:to]
    end
  end

  def read_example(name)
    File.read(File.expand_path("../../examples/#{name}", __FILE__))
  end

  def deliver_example(name, options={})
    deliver(read_example(name), options)
  end

  it "catches and displays a plain text message as plain text and source" do
    deliver_example("plainmail")
  end

  it "catches and displays an html message as html and source" do
    deliver_example("htmlmail")
  end

  it "catches and displays a multipart message as text, html and source" do
    deliver_example("multipartmail")
  end

  it "catches and displays an unknown message as source" do
    deliver_example("unknownmail")
  end

  it "catches and displays a message with multipart attachments" do
    deliver_example("attachmail")
  end

  it "doesn't choke on messages containing dots" do
    deliver_example("dotmail")
  end

  it "doesn't choke on messages containing quoted printables" do
    deliver_example("quoted_printable_htmlmail")
  end
end
