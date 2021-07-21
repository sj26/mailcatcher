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

  it "catches and displays an html message as html and source" do
    deliver_example("htmlmail")

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

  it "catches and displays a multipart message as text, html and source" do
    deliver_example("multipartmail")

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
