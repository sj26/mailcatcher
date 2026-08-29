# frozen_string_literal: true

require "mail_catcher/version"

desc "Package as Gem"
task "package" do
  require "rubygems/package"
  require "rubygems/specification"

  spec_file = File.expand_path("../mailcatcher.gemspec", __FILE__)
  spec = Gem::Specification.load(spec_file)

  Gem::Package.build spec
end

desc "Release Gem to RubyGems"
task "release" => ["package"] do
  %x[gem push mailcatcher-#{MailCatcher::VERSION}.gem]
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
