# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Remote resource handling", type: :feature do
  it "rewrites embedded remote images through the proxy" do
    deliver_example("accessible_email")
    sleep(0.5)

    messages = JSON.parse(page.evaluate_script("fetch('/messages').then(r => r.json()).then(d => JSON.stringify(d))"))
    message_id = messages.first["id"]

    visit "/messages/#{message_id}.html"

    expect(page.html).to include("/resources/proxy?url=")
    expect(page.html).to include("https%3A%2F%2Fexample.com%2Fimage.jpg")
  end

  it "keeps normal message links untouched" do
    deliver_example("accessible_email")
    sleep(0.5)

    messages = JSON.parse(page.evaluate_script("fetch('/messages').then(r => r.json()).then(d => JSON.stringify(d))"))
    message_id = messages.first["id"]

    visit "/messages/#{message_id}.html"

    expect(page.html).to include('href="https://company.example.com/dashboard"')
  end
end
