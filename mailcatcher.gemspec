# frozen_string_literal: true

require File.expand_path("../lib/mail_catcher/version", __FILE__)

Gem::Specification.new do |s|
  s.name = "mailcatcher"
  s.version = "2.0.0.pre"
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
    "lib/**/*",
  ]
  s.require_paths = ["lib"]
  s.executables = ["mailcatcher", "catchmail"]
  s.extra_rdoc_files = ["README.md", "LICENSE"]

  s.required_ruby_version = ">= 2.7.0"

  s.add_dependency "falcon"
end
