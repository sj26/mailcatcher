require 'rubygems'
require 'bundler/setup'

if ENV['COVERAGE']
  require 'simplecov'
  SimpleCov.start do
    add_filter "/spec/"
  end
end

require 'mail_catcher'

RSpec.configure do |config|
end
