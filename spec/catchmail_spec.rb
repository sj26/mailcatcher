# frozen_string_literal: true

require "open3"
require "spec_helper"

RSpec.describe "catchmail command", type: :feature do
  def catchmail(*arguments, message:)
    Open3.capture3(
      "bundle", "exec", "catchmail",
      "--smtp-ip", LOCALHOST,
      "--smtp-port", SMTP_PORT.to_s,
      *arguments,
      stdin_data: message,
    )
  end

  it "submits standard input using header or command-line recipients" do
    header_message = <<~MESSAGE
      From: Web App <web-app@example.com>
      To: header-recipient@example.com
      Subject: Header recipients

      Sent through the sendmail interface.
    MESSAGE
    _, stderr, status = catchmail("-f", "bounce@example.com", "-t", message: header_message)
    expect(status).to be_success, stderr

    argument_message = <<~MESSAGE
      From: Web App <web-app@example.com>
      Subject: Argument recipients

      Sent to command-line recipients.
    MESSAGE
    _, stderr, status = catchmail(
      "-f", "sender@example.com",
      "first@example.com", "second@example.com",
      message: argument_message,
    )
    expect(status).to be_success, stderr

    expect(page).to have_selector("#messages tbody tr", count: 2)
    expect(page).to have_selector(
      "#messages tbody tr",
      text: "<bounce@example.com> <header-recipient@example.com> Header recipients",
    )
    expect(page).to have_selector(
      "#messages tbody tr",
      text: "<sender@example.com> <first@example.com>, <second@example.com> Argument recipients",
    )
  end
end
