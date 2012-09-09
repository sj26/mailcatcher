class MailCatcher::DeliveryService
  attr_reader :message

  mattr_accessor :address
  mattr_accessor :port
  mattr_accessor :domain
  mattr_accessor :user_name
  mattr_accessor :password
  mattr_accessor :authentication
  @@authentication = 'login'

  def initialize(message)
    @message = message
  end

  def config
    self.class
  end

  def deliver!
    smtp = Net::SMTP.new config.address, config.port
    smtp.enable_starttls
    smtp.start(config.domain, config.user_name, config.password, config.authentication) do |smtp| 
      smtp.send_message message['source'], message['sender'], config.recipient || message['recipients']
    end
  end

  class << self
    def configure(options = {})
      @@address = options[:delivery_address]
      @@port = options[:delivery_port]
      @@domain = options[:delivery_domain]
      @@user_name = options[:delivery_user_name]
      @@password = options[:delivery_password]
      @@recipient = options["delivery_recipient"]
    end
  end
end
