require 'eventmachine'

module MailCatcher::Events
  MessageAdded = EventMachine::Channel.new
  BounceAdded = EventMachine::Channel.new
end
