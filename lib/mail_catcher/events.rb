require 'eventmachine'

module MailCatcher::Events
  MessageAdded = EventMachine::Channel.new
end
