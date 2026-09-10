#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "net/http"
require "net/smtp"
require "open3"
require "securerandom"
require "socket"

ROOT = File.expand_path("..", __dir__)
IMAGE = ENV.fetch("MAILCATCHER_DOCKER_IMAGE", "mailcatcher-integration-test:#{Process.pid}")
SUBJECT = "Docker integration #{SecureRandom.hex(6)}"
PLAIN_TEXT = "MailCatcher received this message over SMTP."
HTML_TEXT = "MailCatcher rendered this HTML message."

def capture!(*command)
  output, status = Open3.capture2e(*command)
  raise "Command failed: #{command.join(" ")}\n#{output}" unless status.success?

  output.strip
end

def assert(description, &block)
  raise "Assertion failed: #{description}" unless block.call
end

def http_get(port, path)
  Net::HTTP.start("127.0.0.1", port, open_timeout: 1, read_timeout: 2) do |http|
    http.get(path)
  end
end

def http_delete(port, path)
  Net::HTTP.start("127.0.0.1", port, open_timeout: 1, read_timeout: 2) do |http|
    http.delete(path)
  end
end

def wait_until_ready(container, smtp_port, http_port)
  deadline = Process.clock_gettime(Process::CLOCK_MONOTONIC) + 30

  loop do
    running = capture!("docker", "inspect", "--format", "{{.State.Running}}", container) == "true"
    raise "MailCatcher container exited during startup" unless running

    smtp_ready = Socket.tcp("127.0.0.1", smtp_port, connect_timeout: 1) { true } rescue false
    http_ready = begin
      response = http_get(http_port, "/messages")
      response.is_a?(Net::HTTPOK) && JSON.parse(response.body).is_a?(Array)
    rescue Errno::ECONNREFUSED, Errno::ECONNRESET, EOFError, JSON::ParserError, Net::OpenTimeout, Net::ReadTimeout
      false
    end
    return if smtp_ready && http_ready

    raise "MailCatcher did not become ready within 30 seconds" if Process.clock_gettime(Process::CLOCK_MONOTONIC) >= deadline

    sleep 0.25
  end
end

def published_port(container, container_port)
  capture!("docker", "port", container, "#{container_port}/tcp").split(":").last.to_i
end

def message
  <<~EMAIL.gsub("\n", "\r\n")
    From: sender@example.com
    To: recipient@example.com
    Subject: #{SUBJECT}
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary="mailcatcher-test"

    --mailcatcher-test
    Content-Type: text/plain; charset=UTF-8

    #{PLAIN_TEXT}
    --mailcatcher-test
    Content-Type: text/html; charset=UTF-8

    <p>#{HTML_TEXT}</p>
    --mailcatcher-test
    Content-Type: application/octet-stream
    Content-Disposition: attachment; filename="test.bin"
    Content-ID: <binary-attachment>
    Content-Transfer-Encoding: base64

    AAH+/w==
    --mailcatcher-test--
  EMAIL
end

container = nil

begin
  unless ENV.key?("MAILCATCHER_DOCKER_IMAGE")
    puts "Building #{IMAGE}"
    system("docker", "build", "--tag", IMAGE, ROOT) || raise("Docker image build failed")
  end

  container = capture!(
    "docker", "run", "--detach",
    "--publish", "127.0.0.1::1025",
    "--publish", "127.0.0.1::1080",
    IMAGE,
  )
  smtp_port = published_port(container, 1025)
  http_port = published_port(container, 1080)
  wait_until_ready(container, smtp_port, http_port)

  Net::SMTP.start("127.0.0.1", smtp_port) do |smtp|
    smtp.send_message(message, "sender@example.com", "recipient@example.com")
  end

  messages = nil
  40.times do
    response = http_get(http_port, "/messages")
    messages = JSON.parse(response.body) if response.is_a?(Net::HTTPOK)
    break if messages&.any? { |candidate| candidate["subject"] == SUBJECT }

    sleep 0.25
  end

  delivered = messages&.find { |candidate| candidate["subject"] == SUBJECT }
  assert("the HTTP API lists the SMTP-delivered message") { delivered }
  assert("the API reports the envelope sender") { delivered["sender"] == "<sender@example.com>" }
  assert("the API reports the envelope recipient") { delivered["recipients"] == ["<recipient@example.com>"] }

  id = delivered.fetch("id")
  plain = http_get(http_port, "/messages/#{id}.plain")
  html = http_get(http_port, "/messages/#{id}.html")
  source = http_get(http_port, "/messages/#{id}.source")
  interface = http_get(http_port, "/")

  assert("the web interface is served") { interface.is_a?(Net::HTTPOK) && interface.body.include?("MailCatcher") }
  assert("the plain body is available over HTTP") { plain.is_a?(Net::HTTPOK) && plain.body.include?(PLAIN_TEXT) }
  assert("the HTML body is available over HTTP") { html.is_a?(Net::HTTPOK) && html.body.include?(HTML_TEXT) }
  assert("the original source is available over HTTP") do
    source.is_a?(Net::HTTPOK) && source.body.include?("Subject: #{SUBJECT}")
  end

  original = http_get(http_port, "/messages/#{id}.eml")
  assert("the downloadable email preserves the source") do
    original.is_a?(Net::HTTPOK) && original.body == source.body &&
      original["Content-Type"].start_with?("message/rfc822")
  end

  metadata = JSON.parse(http_get(http_port, "/messages/#{id}.json").body)
  attachment = metadata.fetch("attachments").fetch(0)
  attachment_path = "/messages/#{id}/parts/#{attachment.fetch("cid")}"
  part = http_get(http_port, attachment_path)
  assert("SQLite-backed attachment storage preserves binary bytes") do
    part.is_a?(Net::HTTPOK) && part.body.b == "\x00\x01\xfe\xff".b &&
      attachment.fetch("filename") == "test.bin"
  end

  # Exercise the other executable shipped in the image and retain a second
  # message so deleting one cannot accidentally clear the entire inbox.
  output, status = Open3.capture2e(
    "docker", "exec", "--interactive", container, "catchmail",
    "-f", "bounce@example.com", "second@example.com", "third@example.com",
    stdin_data: "From: sender@example.com\nSubject: Catchmail delivery\n\nSecond message.\n",
  )
  assert("catchmail submits standard input successfully: #{output}") { status.success? }
  second = JSON.parse(http_get(http_port, "/messages").body).find { |item| item["subject"] == "Catchmail delivery" }
  assert("catchmail preserves the envelope sender and multiple recipients") do
    second && second["sender"] == "<bounce@example.com>" &&
      second["recipients"] == ["<second@example.com>", "<third@example.com>"]
  end

  assert("individual deletion succeeds") { http_delete(http_port, "/messages/#{id}").is_a?(Net::HTTPNoContent) }
  assert("individual deletion preserves the other message") do
    JSON.parse(http_get(http_port, "/messages").body).map { |item| item.fetch("id") } == [second.fetch("id")]
  end
  ["/messages/#{id}.json", "/messages/#{id}.source", "/messages/#{id}.plain", attachment_path].each do |path|
    assert("deleted message data is unavailable at #{path}") { http_get(http_port, path).is_a?(Net::HTTPNotFound) }
  end

  assert("clearing the inbox succeeds") { http_delete(http_port, "/messages").is_a?(Net::HTTPNoContent) }
  assert("clearing the inbox removes all messages") { JSON.parse(http_get(http_port, "/messages").body).empty? }
  Net::SMTP.start("127.0.0.1", smtp_port) do |smtp|
    smtp.send_message(message, "sender@example.com", "recipient@example.com")
  end
  assert("the database accepts new mail after clearing") do
    JSON.parse(http_get(http_port, "/messages").body).map { |item| item["subject"] } == [SUBJECT]
  end

  capture!("docker", "stop", "--time", "10", container)
  assert("SIGTERM shuts down gracefully instead of requiring SIGKILL") do
    capture!("docker", "inspect", "--format", "{{.State.ExitCode}}", container) == "0"
  end

  puts "Docker integration test passed"
ensure
  if container
    warn capture!("docker", "logs", container) rescue nil
    system("docker", "rm", "--force", container, out: File::NULL, err: File::NULL)
  end
  system("docker", "image", "rm", "--force", IMAGE, out: File::NULL, err: File::NULL)
end
