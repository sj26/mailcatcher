#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "net/http"
require "net/smtp"
require "open3"
require "securerandom"
require "socket"

ROOT = File.expand_path("..", __dir__)
IMAGE = "mailcatcher-integration-test:#{Process.pid}"
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

def wait_until_ready(container, smtp_port, http_port)
  deadline = Process.clock_gettime(Process::CLOCK_MONOTONIC) + 30

  loop do
    running = capture!("docker", "inspect", "--format", "{{.State.Running}}", container) == "true"
    raise "MailCatcher container exited during startup" unless running

    smtp_ready = Socket.tcp("127.0.0.1", smtp_port, connect_timeout: 1) { true } rescue false
    http_ready = begin
      response = http_get(http_port, "/messages")
      response.is_a?(Net::HTTPOK) && JSON.parse(response.body).is_a?(Array)
    rescue Errno::ECONNREFUSED, Errno::ECONNRESET, JSON::ParserError, Net::OpenTimeout, Net::ReadTimeout
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
    Content-Type: multipart/alternative; boundary="mailcatcher-test"

    --mailcatcher-test
    Content-Type: text/plain; charset=UTF-8

    #{PLAIN_TEXT}
    --mailcatcher-test
    Content-Type: text/html; charset=UTF-8

    <p>#{HTML_TEXT}</p>
    --mailcatcher-test--
  EMAIL
end

container = nil

begin
  puts "Building #{IMAGE}"
  system("docker", "build", "--tag", IMAGE, ROOT) || raise("Docker image build failed")

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

  puts "Docker integration test passed"
ensure
  if container
    warn capture!("docker", "logs", container) rescue nil
    system("docker", "rm", "--force", container, out: File::NULL, err: File::NULL)
  end
  system("docker", "image", "rm", "--force", IMAGE, out: File::NULL, err: File::NULL)
end
