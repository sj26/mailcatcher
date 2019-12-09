# frozen_string_literal: true

require "eventmachine"

module MailCatcher
  Bus = EventMachine::Channel.new
end
