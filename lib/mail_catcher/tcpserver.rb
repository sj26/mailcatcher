module MailCatcher
  class TcpServer < Thin::Backends::Base
    # Address and port on which the server is listening for connections.
    attr_accessor :socket

    def initialize(host, port, options)
      @host = host
      @port = port
      @socket = options.fetch(:socket)
      super()
    end

    # Connect the server
    def connect
      @signature = EventMachine.attach_server(@socket, Thin::Connection, &method(:initialize_connection))
      binary_name = EventMachine.get_sockname(@signature)
      port_name = Socket.unpack_sockaddr_in(binary_name)
      @port = port_name[0]
      @host = port_name[1]
      @signature
    end

    # Stops the server
    def disconnect
      EventMachine.stop_server(@signature)
    end

    def to_s
      "#{@host}:#{@port}"
    end
  end
end
