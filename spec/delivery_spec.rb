# frozen_string_literal: true

require "spec_helper"

RSpec.describe MailCatcher, type: :feature do
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

  def html_source_tab_element
    page.find("#message header .format.html-source a")
  end

  def plain_tab_element
    page.find("#message header .format.plain a")
  end

  def source_tab_element
    page.find("#message header .format.source a")
  end

  def attachment_header_element
    page.find("#message header .metadata dt.attachments")
  end

  def attachment_contents_element
    page.find("#message header .metadata dd.attachments")
  end

  def first_attachment_element
    attachment_contents_element.find("ul li:first-of-type a")
  end

  def body_element
    page.find("body")
  end

  it "catches and displays a plain text message as plain text and source" do
    deliver_example("plainmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Plain mail")

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

  it "catches multiple messages sent over one SMTP connection" do
    Net::SMTP.start(LOCALHOST, SMTP_PORT) do |smtp|
      smtp.send_message read_example("plainmail"), DEFAULT_FROM, DEFAULT_TO
      smtp.send_message read_example("htmlmail"), DEFAULT_FROM, DEFAULT_TO
    end

    expect(page).to have_selector("#messages table tbody tr", count: 2)
    expect(page).to have_selector("#messages table tbody tr", text: "Plain mail")
    expect(page).to have_selector("#messages table tbody tr", text: "Test HTML Mail")
  end

  it "catches and displays an html message as html and source" do
    deliver_example("htmlmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test HTML Mail")

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

  it "catches and displays an html message as html source" do
    deliver_example("htmlmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test HTML Mail")

    message_row_element.click

    expect(html_tab_element).to be_visible
    expect(html_source_tab_element).to be_visible

    html_source_tab_element.click

    # Load the HTML mail but discard the headers
    html_source = read_example("htmlmail").split("\n\n", 2).last.chomp

    within_frame do
      expect(page.text).to eq(html_source)
    end
  end

  it "catches and displays a multipart message as text, html and source" do
    deliver_example("multipartmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test Multipart Mail")

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

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test Multipart UTF8 Mail")

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

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test mail")

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(page).to have_no_selector("#message header .format.plain a")
    expect(page).to have_no_selector("#message header .format.html a")

    within_frame do
      expect(body_element).to have_text("Content-Type: application/x-weird")
      expect(body_element).to have_text("Weird stuff~")
    end
  end

  it "catches and displays a message with multipart attachments" do
    deliver_example("attachmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test Attachment Mail")

    expect(message_from_element).to have_text(DEFAULT_FROM)
    expect(message_to_element).to have_text(DEFAULT_TO)
    expect(message_subject_element).to have_text("Test Attachment Mail")
    expect(Time.parse(message_received_element.text)).to be <= Time.now + 5

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(plain_tab_element).to be_visible
    expect(attachment_header_element).to be_visible

    plain_tab_element.click

    within_frame do
      expect(page).to have_text "This is plain text"
    end

    expect(first_attachment_element).to be_visible
    expect(first_attachment_element).to have_text("attachment")

    # Downloading via the browser is hard, so just grab from the URI directly
    expect(Net::HTTP.get(URI.join(Capybara.app_host, first_attachment_element[:href]))).to eql("Hello, I am an attachment!\r\n")

    download_element = page.find("#message .views .download a")
    expect(download_element[:href]).to match(%r{/messages/[^/]+\.eml\z})
    downloaded_message = Net::HTTP.get(URI(download_element[:href]))
    expect(downloaded_message).to include("Subject: Test Attachment Mail")
    expect(downloaded_message).to include("Content-Type: multipart/mixed")

    source_tab_element.click

    within_frame do
      expect(page).to have_text "Content-Type: multipart/mixed"
      expect(page).to have_text "This is plain text"

      expect(page).to have_text "Content-Disposition: attachment"
      # Too hard to add expectations on the transfer encoded attachment contents
    end
  end

  it "doesn't choke on messages containing dots" do
    deliver_example("dotmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Whatever")

    message_row_element.click
    plain_tab_element.click

    within_frame do
      lines = body_element.text.lines.map(&:strip)
      expect(lines).to include(".", "...", "Done.")
    end
  end

  it "doesn't choke on messages containing quoted printables" do
    deliver_example("quoted_printable_htmlmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test quoted-printable HTML mail")

    message_row_element.click
    html_tab_element.click

    within_frame do
      expect(body_element).to have_text("Thank you for allowing Grand Rounds to provide a test case that may demonstrate a limitation in MailCatcher.")
      link = page.find_link("here")
      expect(link[:href]).to eq("http://localhost:9876/big/long/d50243b933ddd425")
      expect(link[:target]).to eq("_blank")
    end
  end

  it "renders XHTML messages as HTML" do
    deliver_example("xhtmlmail")

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test XHTML Mail")

    message_row_element.click

    expect(html_tab_element).to be_visible
    expect(page).to have_no_selector("#message header .format.plain a")

    within_frame do
      expect(body_element).to have_text("Yo, you slimey scoundrel.")
      expect(body_element).to have_no_text("<em>")
    end
  end

  it "escapes and links URLs in plain text messages" do
    deliver_example("plainlinkmail")

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Plain mail")

    message_row_element.click
    plain_tab_element.click

    within_frame do
      expect(body_element).to have_text('You "should" <really> visit:')
      link = page.find_link("https://mailcatcher.me")
      expect(link[:href]).to eq("https://mailcatcher.me/")
      expect(link[:target]).to eq("_blank")
    end
  end

  it "displays embedded images referenced by content ID" do
    deliver_example("inlinemail")

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Inline image")

    message_row_element.click
    html_tab_element.click

    within_frame do
      image = page.find("img[alt='A tiny image']")
      expect(image[:src]).to match(%r{/messages/[^/]+/parts/inline-image@example\.com\z})
      wait.until { image.evaluate_script("this.complete && this.naturalWidth === 1") }
    end
  end
end
