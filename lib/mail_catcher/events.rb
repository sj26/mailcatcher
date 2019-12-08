# frozen_string_literal: true

require "eventmachine"

module MailCatcher
  module Events
    MessageAdded = EventMachine::Channel.new
    MessageRemoved = EventMachine::Channel.new
    MessagesCleared = EventMachine::Channel.new
  end
end
