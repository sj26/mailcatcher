module MailCatcher
  def send_data(data)
    Async do
      endpoint = Async::HTTP::Endpoint.parse("#{MailCatcher.http_url}/messages")

      begin
        Async::WebSocket::Client.connect(endpoint) do |connection|
          puts 'Connected...'

          connection.write data
          connection.flush
        end
      rescue Errno::ECONNREFUSED
        puts 'Cannot connect to the host. Please try again...'
      end
    end
  end
end
