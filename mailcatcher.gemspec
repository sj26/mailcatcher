Gem::Specification.new do |s|
  s.name = "mailcatcher"
  s.version = File.read(File.expand_path("../VERSION", __FILE__)).strip
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
    "public/images/**/*",
    "public/javascripts/**/*.js",
    "public/stylesheets/**/*.css",
    "public/stylesheets/**/*.xsl",
    "views/**/*"
  ]
  s.require_paths = ["lib"]
  s.executables = ["mailcatcher", "catchmail"]
  s.extra_rdoc_files = ["README.md", "LICENSE"]

  s.required_ruby_version = '>= 1.8.7'

  s.add_dependency "activesupport", "~> 3.0"
  s.add_dependency "eventmachine", "~> 0.12"
  s.add_dependency "haml", "~> 3.1"
  s.add_dependency "mail", "~> 2.3"
  s.add_dependency "sinatra", "~> 1.2"
  s.add_dependency "skinny", "~> 0.2"
  s.add_dependency "sqlite3", "~> 1.3"
  s.add_dependency "thin", "~> 1.2"
  s.add_dependency "launchy", "~> 2.1"

  s.add_development_dependency "coffee-script", "~> 2.2"
  s.add_development_dependency "compass", "~> 0.11.1"
  s.add_development_dependency "rake"
  s.add_development_dependency "rdoc"
  s.add_development_dependency "sass", "~> 3.1"
end
