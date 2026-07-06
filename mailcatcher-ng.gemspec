# frozen_string_literal: true

require File.expand_path('lib/mail_catcher/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'mailcatcher-ng'
  s.version     = MailCatcher::VERSION
  s.license     = 'MIT'
  s.summary     = 'Modernized MailCatcher – catches emails via SMTP and displays them in a clean web interface'
  s.description = <<~DESCRIPTION
    MailCatcher NG brings the beloved MailCatcher into the modern era: fast, reliable SMTP catching with a stunning real-time interface, updated dependencies, and powerful email inspection features
  DESCRIPTION

  s.author      = 'Stephane Paquet'
  s.email       = 'contact@thepew.io'

  # ── Most important: point homepage to the nice gh-pages site ──
  s.homepage    = 'https://spaquet.github.io/mailcatcher/'

  # Additional useful metadata (shown on RubyGems.org)
  s.metadata    = {
    'source_code_uri' => 'https://github.com/spaquet/mailcatcher',
    'homepage_uri' => 'https://spaquet.github.io/mailcatcher/', # optional redundancy, but nice
    'bug_tracker_uri' => 'https://github.com/spaquet/mailcatcher/issues',
    'changelog_uri' => 'https://github.com/spaquet/mailcatcher/blob/main/CHANGELOG.md',
    'rubygems_mfa_required' => 'true'
  }

  s.files = Dir[
    'README.md', 'LICENSE',
    'bin/*',
    'lib/**/*.rb',
    'public/**/*',
    'views/**/*'
  ] - Dir['lib/mail_catcher/web/assets.rb'] - Dir['public/assets/logo*.png']
  s.require_paths = ['lib']
  s.executables = %w[mailcatcher catchmail]
  s.extra_rdoc_files = ['README.md', 'LICENSE']

  s.required_ruby_version = '>= 3.3'

  s.add_dependency 'eventmachine', '~> 1.2.7'
  s.add_dependency 'faye-websocket', '~> 0.12.0'
  s.add_dependency 'mail', '~> 2.9'
  s.add_dependency 'net-smtp', '~> 0.5.1'
  s.add_dependency 'nokogiri', '~> 1.18'
  s.add_dependency 'ostruct', '~> 0.6.3'
  s.add_dependency 'rack', '~> 3.2.4'
  s.add_dependency 'sinatra', '~> 4.2.1'
  s.add_dependency 'sqlite3', '~> 2.9'
  s.add_dependency 'thin', '~> 2.0'

  s.add_development_dependency 'capybara', '~> 3.40'
  s.add_development_dependency 'capybara-screenshot', '~> 1.0', '>= 1.0.26'
  s.add_development_dependency 'rake', '~> 13.3', '>= 13.3.1'
  s.add_development_dependency 'rdoc', '~> 8.0.0', '>= 8.0.0'
  s.add_development_dependency 'rspec', '~> 3.13', '>= 3.13.2'
  s.add_development_dependency 'rubocop', '~> 1.88.1'
  s.add_development_dependency 'selenium-webdriver', '~> 4.39'
  s.add_development_dependency 'sprockets'
  s.add_development_dependency 'sprockets-helpers'
  s.add_development_dependency 'uglifier', '~> 4.2', '>= 4.2.1'
end
