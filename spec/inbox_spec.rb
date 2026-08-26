# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Inbox", type: :feature do
  def deliver_message(subject, body: "Message body", content_type: "text/plain", **options)
    deliver <<~MESSAGE, options
      From: A User <user@example.com>
      To: A Recipient <recipient@example.com>
      Subject: #{subject}
      Content-Type: #{content_type}

      #{body}
    MESSAGE
  end

  def message_rows
    "#messages table tbody tr"
  end

  it "searches across message details without regard to case" do
    deliver_message("Build finished", from: "buildbot@example.com")
    deliver_message("Weekly Report", from: "reports@example.com")
    deliver_message("Lunch plans", from: "friend@example.com")

    expect(page).to have_selector(message_rows, count: 3)
    expect(page).to have_title("MailCatcher (3)")

    page.find("input[name=search]").set("REPORTS weekly")

    expect(page).to have_selector(message_rows, count: 1, visible: true, text: "Weekly Report")
    expect(page).to have_selector(message_rows, count: 3, visible: :all)

    page.find("input[name=search]").set("")

    expect(page).to have_selector(message_rows, count: 3, visible: true)
  end

  it "navigates messages and formats with the keyboard and deletes the selected message" do
    deliver_message("First message")
    deliver_message("Second message", body: "<p>Second body</p>", content_type: "text/html")
    deliver_message("Third message")

    expect(page).to have_selector(message_rows, count: 3)

    body = page.find("body")
    body.send_keys(:down)
    expect(page).to have_selector("#{message_rows}.selected", text: "Third message")

    body.send_keys(:down)
    expect(page).to have_selector("#{message_rows}.selected", text: "Second message")
    expect(page).to have_selector("#message dd.subject", text: "Second message")

    body.send_keys(:right)
    expect(page).to have_selector("#message li.format.source.selected")
    within_frame do
      expect(page.find("body")).to have_text("Content-Type: text/html")
    end

    body.send_keys(:left)
    expect(page).to have_selector("#message li.format.html.selected")
    within_frame do
      expect(page.find("body")).to have_text("Second body")
    end

    body.send_keys(:delete)

    expect(page).to have_no_selector(message_rows, text: "Second message")
    expect(page).to have_selector(message_rows, count: 2)
    expect(page).to have_selector("#{message_rows}.selected", text: "First message")
    expect(page).to have_title("MailCatcher (2)")
  end

  it "remembers the message list height after a reload" do
    initial_height = page.find("#messages").rect.height
    resizer = page.find("#resizer")

    page.driver.browser.action
      .move_to(resizer.native)
      .click_and_hold
      .move_by(0, 80)
      .release
      .perform

    resized_height = page.find("#messages").rect.height
    expect(resized_height).to be > initial_height + 50

    refresh
    wait.until { page.evaluate_script("MailCatcher.websocket.readyState") == 1 rescue false }

    expect(page.find("#messages").rect.height).to be_within(2).of(resized_height)
  end

  it "polls for new messages when WebSockets are unavailable", websocket: false do
    deliver_message("Delivered by polling")

    expect(page).to have_selector(message_rows, text: "Delivered by polling")
  end
end
