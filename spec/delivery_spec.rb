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
    message_row_element.find(:xpath, ".//td[3]")
  end

  def message_to_element
    message_row_element.find(:xpath, ".//td[4]")
  end

  def message_subject_element
    message_row_element.find(:xpath, ".//td[5]")
  end

  def message_received_element
    message_row_element.find(:xpath, ".//td[6]")
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

  def attachment_header_element
    page.find("#message header .attachments-column .attachments-header")
  end

  def attachment_contents_element
    page.find("#message header .attachments-column")
  end

  def content_type_notice_element
    page.find("#message header #contentTypeNotice")
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

    # plainmail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Plain mail")
    # Verify the timestamp is present and can be parsed
    expect { Time.parse(message_received_element.text) }.not_to raise_error

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

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test HTML Mail")

    # htmlmail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test HTML Mail")
    # Verify the timestamp is present and can be parsed
    expect { Time.parse(message_received_element.text) }.not_to raise_error

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

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test Multipart Mail")

    # multipartmail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test Multipart Mail")
    # Verify the timestamp is present and can be parsed
    expect { Time.parse(message_received_element.text) }.not_to raise_error

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

    # multipartmail-with-utf8 example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test Multipart UTF8 Mail")
    # Verify the timestamp is present and can be parsed
    expect { Time.parse(message_received_element.text) }.not_to raise_error

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

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test unknown content-type")

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(page).to have_no_selector("#message header .format.html a")
    expect(page).to have_no_selector("#message header .format.plain a")
    expect(page).to have_selector("#message header .format.transcript a")
    expect(content_type_notice_element).to have_text("Content-type error")

    source_tab_element.click

    within_frame do
      expect(page).to have_text("Content-Type: application/x-weird")
      expect(page).to have_text("Subject: Test unknown content-type")
    end
  end

  it "catches and displays a message with multipart attachments" do
    deliver_example("attachmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test Attachment Mail")

    # attachmail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test Attachment Mail")
    # Verify the timestamp is present and can be parsed
    expect { Time.parse(message_received_element.text) }.not_to raise_error

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

    skip
  end

  it "doesn't choke on messages containing quoted printables" do
    deliver_example("quoted_printable_htmlmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test quoted-printable HTML mail")

    # quoted_printable_htmlmail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test quoted-printable HTML mail")

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(html_tab_element).to be_visible

    html_tab_element.click

    within_frame do
      # The Mail gem should decode the quoted-printable content
      expect(page).to have_text("Thank you for allowing Grand Rounds to provide a test case that may demonstrate a limitation in MailCatcher")
      expect(page).to have_text("Open source makes dev good")
      expect(page).to have_text("here")
    end

    source_tab_element.click

    within_frame do
      # Source should show the original quoted-printable encoding
      expect(page).to have_text("Content-Transfer-Encoding: quoted-printable")
    end
  end

  it "supports 8bit UTF-8 transfer encoding with special characters" do
    deliver_example("8bit-utf8mail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test 8bit UTF-8 Mail")

    # 8bit-utf8mail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test 8bit UTF-8 Mail")

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(plain_tab_element).to be_visible

    plain_tab_element.click

    within_frame do
      # The Mail gem should decode the 8bit content and preserve UTF-8 characters
      expect(page).to have_text("Hello! This is a test of 8bit transfer encoding with UTF-8 characters.")
      expect(page).to have_text("café")
      expect(page).to have_text("naïve")
      expect(page).to have_text("résumé")
      expect(page).to have_text("Ελληνικά")
      expect(page).to have_text("Русский")
      expect(page).to have_text("中文")
    end

    source_tab_element.click

    within_frame do
      # Source should show the original 8bit encoding header
      expect(page).to have_text("Content-Transfer-Encoding: 8bit")
      expect(page).to have_text("charset=UTF-8")
    end
  end

  it "supports 8bit UTF-8 transfer encoding in multipart messages" do
    deliver_example("8bit-utf8-multipartmail")

    # Do not reload, make sure that the message appears via websockets

    expect(page).to have_selector("#messages table tbody tr:first-of-type", text: "Test 8bit UTF-8 Multipart Mail")

    # 8bit-utf8-multipartmail example has From: Me <me@sj26.com> and To: Blah <blah@blah.com>
    expect(message_from_element).to have_text("Me")
    expect(message_from_element).to have_text("me@sj26.com")
    expect(message_to_element).to have_text("Blah")
    expect(message_to_element).to have_text("blah@blah.com")
    expect(message_subject_element).to have_text("Test 8bit UTF-8 Multipart Mail")

    message_row_element.click

    expect(source_tab_element).to be_visible
    expect(plain_tab_element).to be_visible
    expect(html_tab_element).to be_visible

    plain_tab_element.click

    within_frame do
      # The plain text part should be decoded correctly with UTF-8
      expect(page).to have_text("Plain text version:")
      expect(page).to have_text("café")
      expect(page).to have_text("naïve")
    end

    html_tab_element.click

    within_frame do
      # The HTML part should be decoded correctly with UTF-8
      expect(page).to have_text("HTML version with 8bit encoding:")
      expect(page).to have_text("café")
      expect(page).to have_text("résumé")
      expect(page).to have_text("Ελληνικά")
      expect(page).to have_text("Русский")
      expect(page).to have_text("العربية")
    end

    source_tab_element.click

    within_frame do
      # Source should show the original 8bit encoding header
      expect(page).to have_text("Content-Transfer-Encoding: 8bit")
    end
  end
end
