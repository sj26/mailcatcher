# frozen_string_literal: true

require "mail_catcher/version"

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
