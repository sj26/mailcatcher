require File.expand_path('../lib/mail_catcher/version', __FILE__)

Gem::Specification.new do |s|
  s.name = "mailcatcher"
  s.version = MailCatcher::VERSION
  s.license = "MIT"
  s.summary = "Runs an SMTP server, catches and displays email in a web interface."
  s.description = <<-END
    MailCatcher runs a super simple SMTP server which catches any
    message sent to it to display in a web interface. Run
    mailcatcher, set your favourite app to deliver to
    smtp://127.0.0.1:1025 instead of your default SMTP server,
    then check out http://127.0.0.1:1080 to see the mail.
  END

  s.author = "Samuel Cochran"
  s.email = "sj26@sj26.com"
  s.homepage = "http://mailcatcher.me"

  s.files = Dir[
    "README.md", "LICENSE", "VERSION",
    "bin/*",
    "lib/**/*.rb",
    "public/**/*",
    "views/**/*",
  ] - Dir["lib/mail_catcher/web/assets.rb"]
  s.require_paths = ["lib"]
  s.executables = ["mailcatcher", "catchmail"]
  s.extra_rdoc_files = ["README.md", "LICENSE"]

  s.required_ruby_version = '>= 1.8.7'

  s.add_dependency "activesupport", ">= 4.0.0", "< 5"
  s.add_dependency "eventmachine", "~> 1.0.0"
  s.add_dependency "haml", ">= 3.1", "< 4.1"
  s.add_dependency "mail", "~> 2.3"
  s.add_dependency "sinatra", "~> 1.2"
  s.add_dependency "sqlite3", "~> 1.3"
  s.add_dependency "thin", "~> 1.5.0"
  s.add_dependency "skinny", "~> 0.2.3"

  s.add_development_dependency "coffee-script"
  s.add_development_dependency "compass"
  s.add_development_dependency "minitest", "~> 5.0"
  s.add_development_dependency "rake"
  s.add_development_dependency "rdoc"
  s.add_development_dependency "sass"
  s.add_development_dependency "selenium-webdriver"
  s.add_development_dependency "sprockets"
  s.add_development_dependency "sprockets-sass"
  s.add_development_dependency "sprockets-helpers"
  s.add_development_dependency "uglifier"
end
