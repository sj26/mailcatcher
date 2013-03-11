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
