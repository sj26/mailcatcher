# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "mail_catcher"

SMTP_PORT = 20025

def smtp_url_1
  "#{scheme}://#{ip}:#{SMTP_PORT}"
end

def smtp_url_2
  "#{scheme}s://#{ip}#{path}"
end

def path
  '/path'
end

def scheme
  'smtp'
end

def ip
  '127.0.0.1'
end

def url_endpoint_1
  MailCatcher::SMTP::URLEndpoint.new(URI.parse(smtp_url_1), SMTP_PORT)
end

def url_endpoint_2
  MailCatcher::SMTP::URLEndpoint.new(URI.parse(smtp_url_2), SMTP_PORT)
end

RSpec.describe MailCatcher::SMTP do
  describe MailCatcher::SMTP::URLEndpoint do
    it 'returns string url' do
      expect(url_endpoint_1.to_s).to eql(smtp_url_1)
      expect(url_endpoint_2.to_s).to eql(smtp_url_2)
    end

    it 'returns if endpoint is secure or not' do
      expect(url_endpoint_1.secure?).to be(false)
      expect(url_endpoint_2.secure?).to be(true)
    end

    it 'returns endpoint protocol' do
      expect(url_endpoint_1.protocol).to be(MailCatcher::SMTP::Protocol::SMTP)
      expect(url_endpoint_2.protocol).to be(MailCatcher::SMTP::Protocol::SMTP)
    end

    it 'returns default_port' do
      expect(url_endpoint_1.default_port).to be(25)
    end

    it 'returns if endpoint used default_port' do
      expect(url_endpoint_1.default_port?).to be(false)
      expect(url_endpoint_2.default_port?).to be(true)
    end

    it 'returns endpoint port' do
      expect(url_endpoint_1.port).to be(SMTP_PORT)
      expect(url_endpoint_2.port).to be(url_endpoint_2.default_port)
    end

    it 'returns hostname of endpoint' do
      expect(url_endpoint_1.hostname).to eql(ip)
      expect(url_endpoint_2.hostname).to eql(ip)
    end

    it 'returns scheme of endpoint' do
      expect(url_endpoint_1.scheme).to eql(scheme)
      expect(url_endpoint_2.scheme).to eql("#{scheme}s")
    end

    it 'checks authority of endpoint' do
      expect(url_endpoint_1.authority).to eql("#{ip}:#{SMTP_PORT}")
      expect(url_endpoint_2.authority).to eql(ip)
    end

    it 'returns path of endpoint' do
      expect(url_endpoint_1.path).to eql('')
      expect(url_endpoint_2.path).to eql(path)
    end
  end
end
