# frozen_string_literal: true

require "open3"
require "spec_helper"

RSpec.describe "mailcatcher command" do
  it "shows its version then exits successfully" do
    stdout, stderr, status = Open3.capture3("bundle", "exec", "mailcatcher", "--version")

    expect(status).to be_success, stderr
    expect(stdout).to include("MailCatcher v#{MailCatcher::VERSION}")
  end

  it "documents its command-line configuration then exits successfully" do
    stdout, stderr, status = Open3.capture3("bundle", "exec", "mailcatcher", "--help")

    expect(status).to be_success, stderr
    expect(stdout).to include("MailCatcher v#{MailCatcher::VERSION}")
    expect(stdout).to include(
      "--ip", "--smtp-ip", "--smtp-port", "--http-ip", "--http-port",
      "--messages-limit", "--http-path", "--no-quit", "--foreground",
      "--verbose", "--help", "--version",
    )
    expect(stdout).to include("--browse") if MailCatcher.browsable?
  end

  it "reports an occupied port and exits unsuccessfully" do
    listener = TCPServer.new(LOCALHOST, 0)
    occupied_port = listener.local_address.ip_port

    stdout, stderr, status = Open3.capture3(
      "bundle", "exec", "mailcatcher", "--foreground",
      "--smtp-port", occupied_port.to_s,
      "--http-port", HTTP_PORT.to_s,
    )

    expect(status).not_to be_success
    expect(stderr).to be_empty
    expect(stdout).to include(
      "Something's using port #{occupied_port}",
      "smtp://127.0.0.1:#{occupied_port}",
      "http://127.0.0.1:#{HTTP_PORT}",
    )
  ensure
    listener&.close
  end
end

RSpec.describe "catchmail command" do
  it "shows its sendmail-compatible options then exits successfully" do
    stdout, stderr, status = Open3.capture3("bundle", "exec", "catchmail", "--help")

    expect(status).to be_success, stderr
    expect(stdout).to include("Usage: catchmail", "--smtp-ip", "--smtp-port", "-f FROM", "-t")
  end
end
