# frozen_string_literal: true

require 'async/io/protocol/line'
require 'async/io/socket'
require 'mail_catcher'
require 'net/smtp'

message = <<~MESSAGE
  From: Your Name <your@mail.address>
  To: Destination Address <someone@example.com>
  Subject: test message
  Date: Sat, 23 Jun 2001 16:26:43 +0900
  Message-Id: <unique.message.id.string@example.com>

  This is a test message.
MESSAGE

SMTP_PORT = 20_025
HTTP_PORT = 20_080

RSpec.describe MailCatcher::SMTP::Protocol::SMTP::Server do
  let(:pipe) { @pipe = Async::IO::Socket.pair(Socket::AF_UNIX, Socket::SOCK_STREAM) }
  let(:remote) { pipe.first }
  let(:code) { 220 }
  subject { described_class.new(Async::IO::Stream.new(pipe.last, deferred: true)) }
  let(:domain) { 'test@mail.com' }

  after(:each) { defined?(@pipe) && @pipe&.each(&:close) }

  before :all do
    # Start MailCatcher
    @pid = spawn 'bundle', 'exec', 'mailcatcher', '--foreground', '--smtp-port', SMTP_PORT.to_s, '--http-port',
                 HTTP_PORT.to_s

    # Wait for it to boot
    begin
      TCPSocket.new('127.0.0.1', SMTP_PORT).close
      TCPSocket.new('127.0.0.1', HTTP_PORT).close
    rescue Errno::ECONNREFUSED
      retry
    end
  end

  after :all do
    # Quit MailCatcher at the end
    Process.kill('TERM', @pid) and Process.wait
  end

  context '#write_response' do
    it 'should write response' do
      subject.write_response(code, 'Hello World')
      subject.close

      expect(remote.read.strip).to eql("#{code} Hello World")
    end
  end

  context '#read_line' do
    before(:each) do
      remote.write("Hello World\n")
      remote.close
    end

    it 'should read one line' do
      expect(subject.read_line).to be == 'Hello World'
    end

    it 'should be binary encoding' do
      expect(subject.read_line.encoding).to be == Encoding::BINARY
    end
  end

  context '#each' do
    it 'returns 250 code when HELO command' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect(smtp.helo(domain).status.to_i).to eql(250)
      end
    end

    it 'returns 250 code when EHLO command' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect(smtp.ehlo(domain).status.to_i).to eql(250)
      end
    end

    it 'raise Net::SMTPSyntaxError error when RCPT command' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect { smtp.rcptto(domain).status.to_i }.to raise_error(Net::SMTPSyntaxError)
      end
    end

    it 'raise Net::SMTPUnknownError when DATA command used' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect do
          smtp.data("From: john@example.com
						To: betty@example.com
						Subject: I found a bug

						Check vm.c:58879.
					")
        end.to raise_error(Net::SMTPUnknownError)
      end
    end

    it 'returns 250 code when RSET command' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect(smtp.rset.status.to_i).to eql(250)
      end
    end

    it 'returns 250 code MAIL command' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect(smtp.send_message(message, 'your@example.com', 'to@example.com').status.to_i).to eql(250)
      end
    end

    it 'returns 502 code STARTTLS command' do
      Net::SMTP.start('127.0.0.1', SMTP_PORT) do |smtp|
        expect { smtp.starttls }.to raise_error(Net::SMTPSyntaxError)
      end
    end

    it 'returns 221 code QUIT command' do
      smtp = Net::SMTP.start('127.0.0.1', SMTP_PORT)
      expect(smtp.quit.status.to_i).to eql(221)
    end
  end
end
