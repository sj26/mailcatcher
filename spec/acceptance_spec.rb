# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "mail_catcher"

require "capybara/rspec"
require "selenium/webdriver"
require "net/smtp"
require "socket"

RSpec.describe MailCatcher, type: :feature do
  DEFAULT_FROM = "from@example.com"
  DEFAULT_TO = "to@example.com"

  SMTP_PORT = 20025
  HTTP_PORT = 20080

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

  before :all do
    # Use headless chrome
    Capybara.default_driver = :selenium
    Capybara.register_driver :selenium do |app|
      Capybara::Selenium::Driver.new app, browser: :chrome,
        options: Selenium::WebDriver::Chrome::Options.new(args: %w[--headless --disable-gpu --force-device-scale-factor=1 --window-size=1400,900])
    end

    # Don't start a rack server, connect to mailcatcher process
    Capybara.run_server = false
    Capybara.app_host = "http://127.0.0.1:#{HTTP_PORT}"
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

  before do
    visit "/"
  end

  def messages_element
    page.find("#messages")
  end

  def message_row_element
    messages_element.find(:xpath, ".//table/tbody/tr[1]")
  end

  def message_from_element
    message_row_element.find(:xpath, ".//td[1]")
  end

  def message_to_element
    message_row_element.find(:xpath, ".//td[2]")
  end

  def message_subject_element
    message_row_element.find(:xpath, ".//td[3]")
  end

  def message_received_element
    message_row_element.find(:xpath, ".//td[4]")
  end

  def html_tab_element
    page.find("#message header .format.html a")
  end

  def plain_tab_element
    page.find("#message header .format.plain a")
  end

  def source_tab_element
    page.find("#message header .format.source a")
  end

  def body_element
    page.find("body")
  end

  it "catches and displays a plain text message as plain text and source" do
    deliver_example("plainmail")

    expect(message_from_element).to have_text(DEFAULT_FROM)
    expect(message_to_element).to have_text(DEFAULT_TO)
    expect(message_subject_element).to have_text("Plain mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(plain_tab_element).to be_visible
    expect(page).to have_no_selector("#message header .format.html a")

    plain_tab_element.click

    within_frame do
      expect(body_element).to have_no_text("Subject: Plain mail")
      expect(body_element).to have_text("Here's some text")
    end

    source_tab_element.click

    within_frame do
      expect(body_element.text).to include("Subject: Plain mail")
      expect(body_element.text).to include("Here's some text")
    end
  end

  it "catches and displays an html message as html and source" do
    deliver_example("htmlmail")

    expect(message_from_element).to have_text(DEFAULT_FROM)
    expect(message_to_element).to have_text(DEFAULT_TO)
    expect(message_subject_element).to have_text("Test HTML Mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(page).to have_no_selector("#message header .format.plain a")
    expect(html_tab_element).to be_visible

    html_tab_element.click

    within_frame do
      expect(page).to have_text("Yo, you slimey scoundrel.")
      expect(page).to have_no_text("Content-Type: text/html")
      expect(page).to have_no_text("Yo, you <em>slimey scoundrel</em>.")
    end

    source_tab_element.click

    within_frame do
      expect(page).to have_no_text("Yo, you slimey scoundrel.")
      expect(page).to have_text("Content-Type: text/html")
      expect(page).to have_text("Yo, you <em>slimey scoundrel</em>.")
    end
  end

  it "catches and displays a multipart message as text, html and source" do
    deliver_example("multipartmail")

    expect(message_from_element).to have_text(DEFAULT_FROM)
    expect(message_to_element).to have_text(DEFAULT_TO)
    expect(message_subject_element).to have_text("Test Multipart Mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(plain_tab_element).to be_visible
    expect(html_tab_element).to be_visible

    plain_tab_element.click

    within_frame do
      expect(page).to have_text "Plain text mail"
      expect(page).to have_no_text "HTML mail"
      expect(page).to have_no_text "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    end

    html_tab_element.click

    within_frame do
      expect(page).to have_no_text "Plain text mail"
      expect(page).to have_text "HTML mail"
      expect(page).to have_no_text "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    end

    source_tab_element.click

    within_frame do
      expect(page).to have_text "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
      expect(page).to have_text "Plain text mail"
      expect(page).to have_text "<em>HTML</em> mail"
    end
  end

  it "catches and displays a multipart UTF8 message as text, html and source" do
    deliver_example("multipartmail-with-utf8")

    expect(message_from_element).to have_text(DEFAULT_FROM)
    expect(message_to_element).to have_text(DEFAULT_TO)
    expect(message_subject_element).to have_text("Test Multipart UTF8 Mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(plain_tab_element).to be_visible
    expect(html_tab_element).to be_visible

    plain_tab_element.click

    within_frame do
      expect(page).to have_text "Plain text mail"
      expect(page).to have_no_text "© HTML mail"
      expect(page).to have_no_text "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    end

    html_tab_element.click

    within_frame do
      expect(page).to have_no_text "Plain text mail"
      expect(page).to have_text "© HTML mail"
      expect(page).to have_no_text "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
    end

    source_tab_element.click

    within_frame do
      expect(page).to have_text "Content-Type: multipart/alternative; boundary=BOUNDARY--198849662"
      expect(page).to have_text "Plain text mail"
      expect(page).to have_text "<em>© HTML</em> mail"
    end
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
