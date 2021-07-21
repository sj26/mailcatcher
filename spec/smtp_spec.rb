# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "mail_catcher"

SMTP_PORT = 20025

RSpec.describe MailCatcher::SMTP do
  describe MailCatcher::SMTP::URLEndpoint do
    let(:scheme) { 'smtp' }
    let(:path) { '/path' }
    let(:ip) { '127.0.0.1' }
    let(:smtp_url_1) { "#{scheme}://#{ip}:#{SMTP_PORT}" }
    let(:smtp_url_2) { "#{scheme}s://#{ip}#{path}" }
    let(:http_address) { Async::IO::Address.tcp(ip, SMTP_PORT) }
    let(:http_endpoint) { Async::IO::AddressEndpoint.new(http_address) }
    let(:url_endpoint_1) { MailCatcher::SMTP::URLEndpoint.new(URI.parse(smtp_url_1), http_endpoint) }
    let(:url_endpoint_2) { MailCatcher::SMTP::URLEndpoint.new(URI.parse(smtp_url_2), http_endpoint, reuse_port: true) }

    context '#to_s' do
      it 'returns string url' do
        expect(url_endpoint_1.to_s).to eql(smtp_url_1)
        expect(url_endpoint_2.to_s).to eql(smtp_url_2)
      end
    end

    context '#secure?' do
      it 'returns if endpoint is secure or not' do
        expect(url_endpoint_1.secure?).to be(false)
        expect(url_endpoint_2.secure?).to be(true)
      end
    end

    context '#protocol' do
      it 'returns endpoint protocol' do
        expect(url_endpoint_1.protocol).to be(MailCatcher::SMTP::Protocol::SMTP)
        expect(url_endpoint_2.protocol).to be(MailCatcher::SMTP::Protocol::SMTP)
      end
    end

    context '#default_port' do
      it 'returns default_port' do
        expect(url_endpoint_1.default_port).to be(25)
      end
    end

    context '#default_port?' do
      it 'returns if endpoint used default_port' do
        expect(url_endpoint_1.default_port?).to be(false)
        expect(url_endpoint_2.default_port?).to be(true)
      end
    end

    context '#port' do
      it 'returns endpoint port' do
        expect(url_endpoint_1.port).to be(SMTP_PORT)
        expect(url_endpoint_2.port).to be(url_endpoint_2.default_port)
      end
    end

    context '#hostname' do
      it 'returns hostname of endpoint' do
        expect(url_endpoint_1.hostname).to eql(ip)
        expect(url_endpoint_2.hostname).to eql(ip)
      end
    end

    context '#scheme' do
      it 'returns scheme of endpoint' do
        expect(url_endpoint_1.scheme).to eql(scheme)
        expect(url_endpoint_2.scheme).to eql("#{scheme}s")
      end
    end

    context '#authority' do
      it 'checks authority of endpoint' do
        expect(url_endpoint_1.authority).to eql("#{ip}:#{SMTP_PORT}")
        expect(url_endpoint_2.authority).to eql(ip)
      end
    end

    context '#path' do
      it 'returns path of endpoint' do
        expect(url_endpoint_1.path).to eql('')
        expect(url_endpoint_2.path).to eql(path)
      end
    end

    context '#ssl_verify_mode' do
      it 'checks ssl is in verify mode for the endpoint' do
        expect(url_endpoint_1.ssl_verify_mode).to be(OpenSSL::SSL::VERIFY_PEER)
        expect(url_endpoint_2.ssl_verify_mode).to be(OpenSSL::SSL::VERIFY_PEER)
      end
    end

    context '#ssl_context' do
      it 'returns ssl context of the endpoint' do
        expect(url_endpoint_1.ssl_context.class).to be(OpenSSL::SSL::SSLContext)
        expect(url_endpoint_2.ssl_context.class).to be(OpenSSL::SSL::SSLContext)
      end
    end

    context '#tcp_options' do
      it 'returns tcp_options of the endpoint' do
        expect(url_endpoint_1.tcp_options).to eql({ :reuse_port => false })
        expect(url_endpoint_2.tcp_options).to eql({ :reuse_port => true })
      end
    end

    context '#build_endpoint' do
      it 'builds smtp endpoint for the endpoint' do
        expect(url_endpoint_1.build_endpoint.class).to be(Async::IO::HostEndpoint)
        expect(url_endpoint_2.build_endpoint.class).to be(Async::IO::SSLEndpoint)
      end
    end
  end
end
