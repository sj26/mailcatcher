Gem::Specification.new do |gem|
  gem.rubygems_version = "1.3.7"
  gem.name = "mailcatcher"
  gem.version = "0.1.2"
  gem.date = "2010-10-25"
  gem.summary = "Runs an SMTP server, catches and displays email in a web interface."
  gem.description = <<-EOD
    MailCatcher runs a super simple SMTP server which catches any
    message sent to it to display in a web interface. Run
    mailcatcher, set your favourite app to deliver to
    smtp://127.0.0.1:1025 instead of your default SMTP server,
    then check out http://127.0.0.1:1080 to see the mail.
  EOD
  gem.homepage = "http://github.com/sj26/mailcatcher"
  
  gem.authors = ["Samuel Cochran"]
  gem.email = "sj26@sj26.com"
  
  gem.add_dependency 'bundler'
  gem.add_dependency 'eventmachine'
  gem.add_dependency 'json'
  gem.add_dependency 'mail'
  gem.add_dependency 'thin'
  gem.add_dependency 'sqlite3-ruby'
  gem.add_dependency 'sinatra'
  gem.add_dependency 'sunshowers'

  # Required by activesupport, required by mail, but not listed.
  gem.add_dependency 'i18n'
  
  gem.files = %w[
    bin/mailcatcher
    lib/mail_catcher.rb
    views/index.haml
    README.md
    LICENSE
  ];
  gem.executables = ["mailcatcher"]
end