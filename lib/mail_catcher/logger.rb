require 'logger'

module MailCatcher
  @@logger = nil

  def self.setup_logger(output = STDOUT)
      @@logger = Logger.new(output)
      @@logger.level = Logger::DEBUG
  end

  def self.logger
    @@logger
  end

end

