# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Quit", type: :feature do
  it "quits cleanly via the Quit button" do
    # Quitting and cancelling ..
    dismiss_confirm do
      click_on "Quit"
    end

    # .. should not exit the process
    expect { Process.kill(0, @pid) }.not_to raise_error

    # Reload the page to be sure
    visit "/"
    wait.until { page.evaluate_script("MailCatcher.websocket.readyState") == 1 rescue false }

    # Quitting and confirming ..
    accept_confirm "Are you sure you want to quit?" do
      click_on "Quit"
    end

    # .. should exit the process ..
    _, status = Process.wait2(@pid)

    expect(status).to be_exited
    expect(status).to be_success

    # .. and navigate to the mailcatcher website
    expect(page).to have_current_path "https://mailcatcher.me"
  end

  it "quits cleanly on Ctrl+C" do
    # Sending a SIGINT (Ctrl+C) ...
    Process.kill(:SIGINT, @pid)

    # .. should cause the process to exit cleanly
    _, status = Process.wait2(@pid)

    expect(status).to be_exited
    expect(status).to be_success
  end
end
