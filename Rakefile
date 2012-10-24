require 'rubygems'
require 'rubygems/package'
require File.expand_path('../lib/mail_catcher/version', __FILE__)

spec_file = File.expand_path __FILE__ + '/../mailcatcher.gemspec'
spec = Gem::Specification.load spec_file

require 'rdoc/task'
RDoc::Task.new :rdoc => "doc",
    :clobber_rdoc => "doc:clean",
    :rerdoc => "doc:force" do |rdoc|
  rdoc.title = "MailCatcher #{MailCatcher::VERSION}"
  rdoc.rdoc_dir = 'doc'
  rdoc.main = 'README.md'
  rdoc.rdoc_files.include 'lib/**/*.rb'
end

desc "Compile SASS/SCSS files into SCSS"
task "build:sass" do
  Dir["public/stylesheets/**/*.sass"].each do |file|
    css_file = file.sub /\.sass$/, ".css"
    system "sass", "--no-cache", "--compass", file, css_file
  end
end

desc "Compile CoffeeScript files into JavaScript"
task "build:coffee" do
  require 'coffee-script'
  Dir["public/javascripts/**/*.coffee"].each do |file|
    js_file = file.sub /\.coffee$/, ".js"
    File.new(js_file, "w").write CoffeeScript.compile File.read file
  end
end

multitask "build" => ["build:sass", "build:coffee"]

desc "Send mails for testing"
task "test:send", :number do |t, args|
  require 'mail'
  require 'pathname'
  require 'active_support/core_ext/array/random_access'
  require 'active_support/core_ext/object/blank'

  number = (args[:number] || 10).to_i
  ip, port = '127.0.0.1', 1025
  ip = ENV['SMTP_IP'] if ENV['SMTP_IP'].present?
  port = ENV['SMTP_PORT'].to_i if ENV['SMTP_PORT'].present?
  mails = Pathname.glob('examples/*')

  Mail.defaults do
    delivery_method :smtp,
      :address => ip,
      :port => port
  end

  $stderr.puts "Sending #{number} mails to #{ip}:#{port}"
  number.times do |n|
    message = Mail.new mails.sample.read
    message.subject += " (#{n + 1})"
    message.deliver
  end
end

desc "Package as Gem"
task "package:gem" do
  Gem::Package.build spec
end

task "package" => ["build", "package:gem"]

desc "Release Gem to RubyGems"
task "release:gem" do
  %x[gem push mailcatcher-#{MailCatcher::VERSION}.gem]
end

task "release" => ["package", "release:gem"]

task "default" => "build"
