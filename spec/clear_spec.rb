# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Clear", type: :feature do
  it "clears all messages" do
    # Delivering three emails ..
    deliver_example("plainmail")
    deliver_example("plainmail")
    deliver_example("plainmail")

    # .. should display three emails
    expect(page).to have_selector("#messages table tbody tr", text: "Plain mail", count: 3)

    # Clicking Clear but cancelling ..
    dismiss_confirm do
      click_on "Clear"
    end

    # .. should still display three emails
    expect(page).to have_selector("#messages table tbody tr", text: "Plain mail", count: 3)

    # Clicking clear and confirming ..
    accept_confirm "Are you sure you want to clear all messages?" do
      click_on "Clear"
    end

    # .. should display no emails
    expect(page).not_to have_selector("#messages table tbody tr")
  end
end
