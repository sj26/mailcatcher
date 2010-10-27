require 'eventmachine'

module MailCatcher
  module Events
    MessageAdded = EventMachine::Channel.new
  end
end