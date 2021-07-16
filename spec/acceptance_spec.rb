# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "mail_catcher"
require "socket"
require "net/smtp"
require "selenium-webdriver"

SMTP_PORT = 20025
HTTP_PORT = 20080

RSpec.describe MailCatcher do
  DEFAULT_FROM = "from@example.com"
  DEFAULT_TO = "to@example.com"

  before :all do
    # Start MailCatcher
    @pid = spawn "bundle", "exec", "mailcatcher", "--foreground", "--smtp-port", SMTP_PORT.to_s, "--http-port", HTTP_PORT.to_s

    # Wait for it to boot
    begin
      TCPSocket.new("127.0.0.1", SMTP_PORT).close
      TCPSocket.new("127.0.0.1", HTTP_PORT).close
    rescue Errno::ECONNREFUSED
      retry
    end
  end

  after :all do
    # Quit MailCatcher at the end
    Process.kill("TERM", @pid) and Process.wait
  end

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
        options.headless! unless ENV["HEADLESS"] == "false"
        options.add_argument "no-sandbox" if ENV["CI"]

        Selenium::WebDriver.for(:chrome, options: options).tap do |selenium|
          if ENV["CI"]
            selenium.manage.timeouts.page_load = 10 # seconds
            selenium.manage.timeouts.implicit_wait = 10 # seconds
          end
        end
      end
  end

  def wait
    @wait ||= Selenium::WebDriver::Wait.new
  end

  before do
    selenium.navigate.to("http://127.0.0.1:#{HTTP_PORT}")
  end

  def messages_element
    selenium.find_element(:id, "messages")
  end

  def message_row_element
    messages_element.find_element(:xpath, ".//table/tbody/tr[1]")
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

    expect(message_from_element.text).to include(DEFAULT_FROM)
    expect(message_to_element.text).to include(DEFAULT_TO)
    expect(message_subject_element.text).to include("Plain mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    wait.until { source_tab_element.displayed? }
    wait.until { plain_tab_element.displayed? }
    wait.until { !html_tab_element.displayed? }

    plain_tab_element.click

    wait.until { iframe_element.displayed? }
    expect(iframe_element.attribute(:src)).to match(/\.plain\Z/)

    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).not_to include("Subject: Plain mail")
    expect(body_element.text).to include("Here's some text")

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include("Subject: Plain mail")
    expect(body_element.text).to include("Here's some text")
  end

  it "catches and displays an html message as html and source" do
    deliver_example("htmlmail")

    expect(message_from_element.text).to include(DEFAULT_FROM)
    expect(message_to_element.text).to include(DEFAULT_TO)
    expect(message_subject_element.text).to eql("Test HTML Mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    wait.until { source_tab_element.displayed? }
    wait.until { !plain_tab_element.displayed? }
    wait.until { html_tab_element.displayed? }

    html_tab_element.click

    wait.until { iframe_element.displayed? }
    expect(iframe_element.attribute(:src)).to match(/\.html\Z/)

    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include("Yo, you slimey scoundrel.")
    expect(body_element.text).not_to include("Content-Type: text/html")
    expect(body_element.text).not_to include("Yo, you <em>slimey scoundrel</em>.")

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "Content-Type: text/html"
    expect(body_element.text).to include "Yo, you <em>slimey scoundrel</em>."
    expect(body_element.text).not_to include "Yo, you slimey scoundrel."
  end

  it "catches and displays a multipart message as text, html and source" do
    deliver_example("multipartmail")

    expect(message_from_element.text).to include DEFAULT_FROM
    expect(message_to_element.text).to include DEFAULT_TO
    expect(message_subject_element.text).to eql "Test Multipart Mail"
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    wait.until { source_tab_element.displayed? }
    wait.until { plain_tab_element.displayed? }
    wait.until { html_tab_element.displayed? }

    plain_tab_element.click

    wait.until { iframe_element.displayed? }
    expect(iframe_element.attribute(:src)).to match /\.plain\Z/

    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "Plain text mail"
    expect(body_element.text).not_to include "HTML mail"
    expect(body_element.text).not_to include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    html_tab_element.click
    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "HTML mail"
    expect(body_element.text).not_to include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    expect(body_element.text).to include "Plain text mail"
    expect(body_element.text).to include "<em>HTML</em> mail"
  end

  it "catches and displays a multipart UTF8 message as text, html and source" do
    deliver_example("multipartmail-with-utf8")

    expect(message_from_element.text).to include DEFAULT_FROM
    expect(message_to_element.text).to include DEFAULT_TO
    expect(message_subject_element.text).to eql "Test Multipart UTF8 Mail"
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    wait.until { source_tab_element.displayed? }
    wait.until { plain_tab_element.displayed? }
    wait.until { html_tab_element.displayed? }

    plain_tab_element.click

    wait.until { iframe_element.displayed? }
    expect(iframe_element.attribute(:src)).to match /\.plain\Z/

    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "Plain text mail"
    expect(body_element.text).not_to include "HTML mail"
    expect(body_element.text).not_to include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    html_tab_element.click
    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "HTML mail"
    expect(body_element.text).not_to include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"

    selenium.switch_to.default_content
    source_tab_element.click
    selenium.switch_to.frame(iframe_element)

    expect(body_element.text).to include "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    expect(body_element.text).to include "Plain text mail"
    expect(body_element.text).to include "<em>© HTML</em> mail"
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
