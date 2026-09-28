# frozen_string_literal: true

require "mail_catcher/version"

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
task "package" do
  require "fileutils"
  require "rubygems/package"
  require "rubygems/specification"

  spec_file = File.expand_path("../mailcatcher.gemspec", __FILE__)
  spec = Gem::Specification.load(spec_file)
  package_dir = File.expand_path("pkg", __dir__)

  FileUtils.mkdir_p package_dir
  Gem::Package.build spec, false, false, File.join(package_dir, spec.file_name)
end

desc "Release Gem to RubyGems"
task "release" => ["package"] do
  sh "gem", "push", File.expand_path("pkg/mailcatcher-#{MailCatcher::VERSION}.gem", __dir__)
end

desc "Build and push Docker images (optional: VERSION=#{MailCatcher::VERSION})"
task "docker" do
  version = ENV.fetch("VERSION", MailCatcher::VERSION)

  Dir.chdir(__dir__) do
    system "docker", "buildx", "build",
      # Push straight to Docker Hub (only way to do multi-arch??)
      "--push",
      # Build for both intel and arm (apple, graviton, etc)
      "--platform", "linux/amd64",
      "--platform", "linux/arm64",
      # Version respected within Dockerfile
      "--build-arg", "VERSION=#{version}",
      # Push latest and version
      "-t", "sj26/mailcatcher:latest",
      "-t", "sj26/mailcatcher:v#{version}",
      # Use current dir as context
      "."
  end
end

require "rdoc/task"

RDoc::Task.new(:rdoc => "doc",:clobber_rdoc => "doc:clean", :rerdoc => "doc:force") do |rdoc|
  rdoc.title = "MailCatcher #{MailCatcher::VERSION}"
  rdoc.rdoc_dir = "doc"
  rdoc.main = "README.md"
  rdoc.rdoc_files.include "lib/**/*.rb"
end

require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:test) do |rspec|
  rspec.rspec_opts = "--format doc"
end

task :default => :test
