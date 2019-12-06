# frozen_string_literal: true

require "eventmachine"

module MailCatcher
  module Events
    MessageAdded = EventMachine::Channel.new
  end
end
