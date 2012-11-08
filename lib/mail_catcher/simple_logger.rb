require 'eventmachine'
require 'mail'

module MailCatcher
  module SimpleLogger extend self
    
    def deliver
      puts "Deliver Event"
    end

    def bounce message_id
      message = MailCatcher::Mail.message message_id
      unless message 
        puts "Bounce Event: no email found."
        return true
      end
      
      current_message = {
        :ts => Time.now.to_i,
        :message_id => message['id'],
        :message_size => message['size'],
        :batch_id => message['id'],                     # WIP: Where do I get this?
        :connection_id => message['id'],                # WIP: Where do I get this?
        :recipient_localpart => parse_address(message["recipients"].first).local,
        :recipient_domain => parse_address(message["recipients"].first).domain,
        :sender_localpart => parse_address(message["sender"]).local,
        :sender_domain => parse_address(message["sender"]).domain,
        :binding_group => "binding_group",              # WIP: Where do I get this?
        :binding => "binding",                          # WIP: Where do I get this?
        :bounce_ip => "#{ENV["HOSTNAME"]}",
        :bounce_message => "Bounce Event enforced by user"
      }

      puts "Bounce Event"      
      puts "#{current_message[:ts]}@#{current_message[:message_id]}@#{current_message[:batch_id]}@#{current_message[:connection_id]}@B@#{current_message[:recipient_localpart]}@#{current_message[:recipient_domain]}@#{current_message[:sender_localpart]}@#{current_message[:sender_domain]}@#{current_message[:binding_group]}@#{current_message[:binding]}@21@40@#{current_message[:message_size]}@#{current_message[:bounce_ip]}@#{current_message[:bounce_message]}"
      EventMachine.next_tick do
        MailCatcher::Events::BounceAdded.push message
      end
    end
    
    
    def parse_address address
      ::Mail::AddressList.new(address).addresses.first
    end

  end
end
