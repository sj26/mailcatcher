require 'rubygems'

version_file = File.expand_path __FILE__ + '/../VERSION'
version = File.read version_file

spec_file = File.expand_path __FILE__ + '/../mailcatcher.gemspec'
spec = Gem::Specification.load spec_file

require 'rdoc/task'
RDoc::Task.new :rdoc => "rdoc",
    :clobber_rdoc => "rdoc:clean",
    :rerdoc => "rdoc:force" do |rdoc|
  rdoc.title = "MailCatcher #{version}"
  rdoc.rdoc_dir = 'rdoc'
  rdoc.main = 'README.md'
  rdoc.rdoc_files.include 'lib/**/*.rb'
end

desc "Compile SASS/SCSS files into SCSS"
task "build:sass" do
  require 'sass'
  Dir["public/stylesheets/**/*.scss"].each do |file|
    css_file = file.sub /\.scss$/, ".css"
    Sass.compile_file file, css_file, :cache => false
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

task "build:rdoc" => "rdoc"

multitask "build" => ["build:sass", "build:coffee", "build:rdoc"]

desc "Package as Gem"
task "package:gem" do
  builder = Gem::Builder.new spec
  builder.build
end

task "package" => ["build", "package:gem"]

desc "Release Gem to RubyGems"
task "release:gem" do
  %x[gem push mailcatcher-#{version}.gem]
end

task "release" => ["package", "release:gem"]

task "default" => "build"
