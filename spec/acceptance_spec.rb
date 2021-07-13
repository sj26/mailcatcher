# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "minitest/autorun"
require "mail_catcher"
require "socket"
require "net/smtp"
require "selenium-webdriver"

SMTP_PORT = 20025
HTTP_PORT = 20080

# Start MailCatcher
MAILCATCHER_PID = spawn "bundle", "exec", "mailcatcher", "--foreground", "--smtp-port", SMTP_PORT.to_s, "--http-port", HTTP_PORT.to_s

# Make sure it will be stopped
MiniTest.after_run do
  Process.kill("TERM", MAILCATCHER_PID) and Process.wait
end

# Wait for it to boot
begin
  TCPSocket.new("127.0.0.1", SMTP_PORT).close
  TCPSocket.new("127.0.0.1", HTTP_PORT).close
rescue Errno::ECONNREFUSED
  retry
end

describe MailCatcher do
  DEFAULT_FROM = "from@example.com"
  DEFAULT_TO = "to@example.com"

  def deliver(message, options={})
    options = {:from => DEFAULT_FROM, :to => DEFAULT_TO}.merge(options)
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

  def selenium
    @selenium ||=
      begin
        options = Selenium::WebDriver::Chrome::Options.new
        options.headless!
        options.add_argument "no-sandbox" if ENV["TRAVIS"]

        Selenium::WebDriver.for(:chrome, options: options)
      end
  end

  before do
    selenium.navigate.to("http://127.0.0.1:#{HTTP_PORT}")
  end

  def messages_element
    selenium.find_element(:id, "messages")
  end

  def message_row_element
    messages_element.find_element(:xpath, ".//table/tbody/tr[last()]")
  end

  def message_from_element
    message_row_element.find_element(:xpath, ".//td[1]")
  end

  def message_to_element
    message_row_element.find_element(:xpath, ".//td[2]")
  end

  def message_subject_element
    message_row_element.find_element(:xpath, ".//td[3]")
  end

  def message_received_element
    message_row_element.find_element(:xpath, ".//td[4]")
  end

  def html_tab_element
    selenium.find_element(:css, "#message header .format.html a")
  end

  def plain_tab_element
    selenium.find_element(:css, "#message header .format.plain a")
  end

  def source_tab_element
    selenium.find_element(:css, "#message header .format.source a")
  end

  def iframe_element
    selenium.find_element(:css, "#message iframe")
  end

  def body_element
    selenium.find_element(:tag_name, "body")
  end

  it "catches and displays a plain text message as plain text and source" do
    deliver_example("plainmail")

    _(message_from_element.text).must_include DEFAULT_FROM
    _(message_to_element.text).must_include DEFAULT_TO
    _(message_subject_element.text).must_equal "Plain mail"
    _(Time.parse(message_received_element.text)).must_be_close_to Time.now, 5

    message_row_element.click

    _(source_tab_element.displayed?).must_equal true
    _(plain_tab_element.displayed?).must_equal true
    _(html_tab_element.displayed?).must_equal false

    plain_tab_element.click

    _(iframe_element.displayed?).must_equal true
    _(iframe_element.attribute(:src)).must_match(/\.plain\Z/)

    selenium.switch_to.frame(iframe_element)

    _(body_element.text).wont_include "Subject: Plain mail"
    _(body_element.text).must_include "Here's some text"

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Subject: Plain mail"
    _(body_element.text).must_include "Here's some text"
  end

  it "catches and displays an html message as html and source" do
    deliver_example("htmlmail")

    _(message_from_element.text).must_include DEFAULT_FROM
    _(message_to_element.text).must_include DEFAULT_TO
    _(message_subject_element.text).must_equal "Test HTML Mail"
    _(Time.parse(message_received_element.text)).must_be_close_to Time.now, 5

    message_row_element.click

    _(source_tab_element.displayed?).must_equal true
    _(plain_tab_element.displayed?).must_equal false
    _(html_tab_element.displayed?).must_equal true

    html_tab_element.click

    _(iframe_element.displayed?).must_equal true
    _(iframe_element.attribute(:src)).must_match /\.html\Z/

    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Yo, you slimey scoundrel."
    _(body_element.text).wont_include "Content-Type: text/html"
    _(body_element.text).wont_include "Yo, you <em>slimey scoundrel</em>."

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Content-Type: text/html"
    _(body_element.text).must_include "Yo, you <em>slimey scoundrel</em>."
    _(body_element.text).wont_include "Yo, you slimey scoundrel."
  end

  it "catches and displays a multipart message as text, html and source" do
    deliver_example("multipartmail")

    _(message_from_element.text).must_include DEFAULT_FROM
    _(message_to_element.text).must_include DEFAULT_TO
    _(message_subject_element.text).must_equal "Test Multipart Mail"
    _(Time.parse(message_received_element.text)).must_be_close_to Time.now, 5

    message_row_element.click

    _(source_tab_element.displayed?).must_equal true
    _(plain_tab_element.displayed?).must_equal true
    _(html_tab_element.displayed?).must_equal true

    plain_tab_element.click

    _(iframe_element.displayed?).must_equal true
    _(iframe_element.attribute(:src)).must_match /\.plain\Z/

    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Plain text mail"
    _(body_element.text).wont_include "HTML mail"
    _(body_element.text).wont_include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    html_tab_element.click
    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "HTML mail"
    _(body_element.text).wont_include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    _(body_element.text).must_include "Plain text mail"
    _(body_element.text).must_include "<em>HTML</em> mail"
  end

  it "catches and displays a multipart UTF8 message as text, html and source" do
    deliver_example("multipartmail-with-utf8")

    _(message_from_element.text).must_include DEFAULT_FROM
    _(message_to_element.text).must_include DEFAULT_TO
    _(message_subject_element.text).must_equal "Test Multipart UTF8 Mail"
    _(Time.parse(message_received_element.text)).must_be_close_to Time.now, 5

    message_row_element.click

    _(source_tab_element.displayed?).must_equal true
    _(plain_tab_element.displayed?).must_equal true
    _(html_tab_element.displayed?).must_equal true

    plain_tab_element.click

    _(iframe_element.displayed?).must_equal true
    _(iframe_element.attribute(:src)).must_match /\.plain\Z/

    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Plain text mail"
    _(body_element.text).wont_include "HTML mail"
    _(body_element.text).wont_include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    html_tab_element.click
    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "HTML mail"
    _(body_element.text).wont_include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    _(body_element.text).must_include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    _(body_element.text).must_include "Plain text mail"
    _(body_element.text).must_include "<em>© HTML</em> mail"
  end

  it "catches and displays an unknown message as source" do
    deliver_example("unknownmail")

    skip
  end

  it "catches and displays a message with multipart attachments" do
    deliver_example("attachmail")

    skip
  end

  it "doesn't choke on messages containing dots" do
    deliver_example("dotmail")

    skip
  end

  it "doesn't choke on messages containing quoted printables" do
    deliver_example("quoted_printable_htmlmail")

    skip
  end
end
