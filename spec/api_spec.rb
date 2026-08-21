# frozen_string_literal: true

require "spec_helper"

RSpec.describe "HTTP API", type: :feature, browser: false do
  def json_response(path)
    response = http_request(:get, path)
    expect(response).to be_a(Net::HTTPOK)
    expect(response["Content-Type"]).to start_with("application/json")
    JSON.parse(response.body)
  end

  it "serves the message list, metadata, bodies, attachments, and original email" do
    deliver_example("multipartmail")
    deliver_example("attachmail")

    messages = json_response("/messages")
    expect(messages.map { |message| message["subject"] }).to contain_exactly(
      "Test Multipart Mail",
      "Test Attachment Mail",
    )

    multipart_id = messages.find { |message| message["subject"] == "Test Multipart Mail" }.fetch("id")
    attachment_id = messages.find { |message| message["subject"] == "Test Attachment Mail" }.fetch("id")
    multipart = json_response("/messages/#{multipart_id}.json")

    expect(multipart).to include(
      "id" => multipart_id,
      "sender" => "<#{DEFAULT_FROM}>",
      "recipients" => ["<#{DEFAULT_TO}>"],
      "subject" => "Test Multipart Mail",
      "attachments" => [],
    )
    expect(multipart.fetch("formats")).to contain_exactly("source", "html", "plain")

    plain = http_request(:get, "/messages/#{multipart_id}.plain")
    expect(plain).to be_a(Net::HTTPOK)
    expect(plain["Content-Type"]).to start_with("text/plain")
    expect(plain.body).to include("Plain text mail")

    html = http_request(:get, "/messages/#{multipart_id}.html")
    expect(html).to be_a(Net::HTTPOK)
    expect(html["Content-Type"]).to start_with("text/html")
    expect(html.body).to include("<em>HTML</em> mail")

    source = http_request(:get, "/messages/#{multipart_id}.source")
    expect(source).to be_a(Net::HTTPOK)
    expect(source["Content-Type"]).to start_with("text/plain")
    expect(source.body).to include("Subject: Test Multipart Mail")

    original = http_request(:get, "/messages/#{multipart_id}.eml")
    expect(original).to be_a(Net::HTTPOK)
    expect(original["Content-Type"]).to start_with("message/rfc822")
    expect(original.body).to eq(source.body)

    attachment = json_response("/messages/#{attachment_id}.json").fetch("attachments").fetch(0)
    part = http_request(:get, "/messages/#{attachment_id}/parts/#{attachment.fetch("cid")}")
    expect(part).to be_a(Net::HTTPOK)
    expect(part["Content-Type"]).to start_with("text/plain")
    expect(part["Content-Disposition"]).to match(%r{\Aattachment; filename="?attachment"?\z})
    expect(part.body).to eq("Hello, I am an attachment!\r\n")
  end

  it "deletes individual messages and the entire inbox" do
    deliver_example("plainmail")
    deliver_example("htmlmail")

    message_ids = json_response("/messages").map { |message| message.fetch("id") }

    response = http_request(:delete, "/messages/#{message_ids.first}")
    expect(response).to be_a(Net::HTTPNoContent)
    expect(json_response("/messages").map { |message| message["id"] }).to eq([message_ids.last])

    response = http_request(:delete, "/messages")
    expect(response).to be_a(Net::HTTPNoContent)
    expect(json_response("/messages")).to be_empty
  end

  it "returns a useful not-found page for missing messages and formats" do
    deliver_example("plainmail")
    message_id = json_response("/messages").fetch(0).fetch("id")

    [
      "/messages/999.json",
      "/messages/#{message_id}.html",
      "/messages/#{message_id}/parts/missing",
    ].each do |path|
      response = http_request(:get, path)
      expect(response).to be_a(Net::HTTPNotFound)
      expect(response.body).to include("No Dice", "does not exist")
    end
  end
end
