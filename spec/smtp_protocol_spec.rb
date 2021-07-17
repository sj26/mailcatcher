# frozen_string_literal: true

require 'async/io/protocol/line'
require 'async/io/socket'
require 'mail_catcher'

RSpec.describe MailCatcher::SMTP::Protocol::SMTP::Server do
  let(:pipe) { @pipe = Async::IO::Socket.pair(Socket::AF_UNIX, Socket::SOCK_STREAM) }
	let(:remote) { pipe.first }
  let(:code) { 220 }
	subject { described_class.new(Async::IO::Stream.new(pipe.last, deferred: true)) }

	after(:each) { defined?(@pipe) && @pipe&.each(&:close) }

  describe '#write_response' do
		it "should write response" do
			subject.write_response(code, 'Hello World')
			subject.close

			expect(remote.read.strip).to eql("#{code} Hello World")
		end
	end

  describe '#read_line' do
		before(:each) do
			remote.write("Hello World\n")
			remote.close
		end

		it "should read one line" do
			expect(subject.read_line).to be == "Hello World"
		end

		it "should be binary encoding" do
			expect(subject.read_line.encoding).to be == Encoding::BINARY
		end
	end
end
