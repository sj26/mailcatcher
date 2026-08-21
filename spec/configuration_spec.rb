# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Configuration", type: :feature do
  def deliver_with_subject(subject)
    deliver <<~MESSAGE
      From: Sender <sender@example.com>
      To: Recipient <recipient@example.com>
      Subject: #{subject}
      Content-Type: text/plain

      #{subject} body
    MESSAGE
  end

  it "keeps only the configured number of most recent messages",
    mailcatcher_options: %w[--messages-limit 2] do
    deliver_with_subject("First")
    deliver_with_subject("Second")
    deliver_with_subject("Third")

    expect(page).to have_selector("#messages tbody tr", count: 2)
    expect(page).to have_selector("#messages tbody tr", text: "Third")
    expect(page).to have_selector("#messages tbody tr", text: "Second")
    expect(page).to have_no_selector("#messages tbody tr", text: "First")
  end

  it "serves the complete application below an HTTP path prefix",
    mailcatcher_options: %w[--ip 127.0.0.1 --http-path mail],
    http_path: "/mail/" do
    redirect = http_request(:get, "/")
    expect(redirect).to be_a(Net::HTTPRedirection)
    expect(redirect["Location"]).to eq("/mail")

    expect(page).to have_current_path("/mail/")
    deliver_with_subject("Prefixed message")
    expect(page).to have_selector("#messages tbody tr", text: "Prefixed message")

    page.find("#messages tbody tr", text: "Prefixed message").click
    within_frame do
      expect(page.find("body")).to have_text("Prefixed message body")
    end

    response = http_request(:get, "/mail/messages")
    expect(response).to be_a(Net::HTTPOK)
    expect(JSON.parse(response.body).fetch(0).fetch("subject")).to eq("Prefixed message")
  end

  it "hides and rejects the quit action when quitting is disabled",
    mailcatcher_options: %w[--no-quit] do
    expect(page).to have_no_link("Quit")

    response = http_request(:delete, "/")
    expect(response).to be_a(Net::HTTPForbidden)
    expect { Process.kill(0, @pid) }.not_to raise_error
  end
end
