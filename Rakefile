require 'rubygems'
require 'rake'

begin
  require 'jeweler'
  Jeweler::Tasks.new do |gem|
    gem.name = "mailcatcher"
    gem.summary = %Q{Runs an SMTP server, catches and displays email in a web interface.}
    gem.description = <<-EOD
      MailCatcher runs a super simple SMTP server which catches any
      message sent to it to display in a web interface. Run
      mailcatcher, set your favourite app to deliver to
      smtp://127.0.0.1:1025 instead of your default SMTP server,
      then check out http://127.0.0.1:1080 to see the mail.
    EOD
    gem.email = "sj26@sj26.com"
    gem.homepage = "http://github.com/sj26/mailcatcher"
    gem.authors = ["Samuel Cochran"]
    
    gem.add_dependency 'eventmachine'
    gem.add_dependency 'mail'
    gem.add_dependency 'i18n'
    gem.add_dependency 'sqlite3-ruby'
    gem.add_dependency 'thin'
    gem.add_dependency 'skinny', '>=0.1.2'
    gem.add_dependency 'sinatra'
    gem.add_dependency 'haml'
    gem.add_dependency 'json'
  end
  Jeweler::GemcutterTasks.new
rescue LoadError
  puts "Jeweler (or a dependency) not available. Install it with: gem install jeweler"
end

require 'rake/rdoctask'
Rake::RDocTask.new do |rdoc|
  version = File.exist?('VERSION') ? File.read('VERSION') : ""

  rdoc.rdoc_dir = 'rdoc'
  rdoc.title = "MailCatcher #{version}"
  rdoc.rdoc_files.include('README*')
  rdoc.rdoc_files.include('lib/*.rb')
  rdoc.rdoc_files.include('lib/**/*.rb')
end