module MailCatcher
  def endpoint
    Async::HTTP::Endpoint.parse("#{MailCatcher.http_url}/messages")
  end

  def self.connection
    @connection ||= begin
      Async::WebSocket::Client.connect(endpoint)
    rescue Errno::ECONNREFUSED
      puts 'Cannot connect to the host. Please try again...'
    end
  end

  def send_data(data)
    connection.write data
    connection.flush
  end
end
