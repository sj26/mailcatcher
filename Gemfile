# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) { |repo| "https://github.com/#{repo}.git" }

gem "eventmachine", "~> 1.2.7"
gem "faye-websocket", "~> 0.11.1"
gem "mail", "~> 2.8.1"
gem "net-smtp", "~> 0.3.3"
gem "rake", "~> 13.0.6"
gem "sinatra", "~> 3.0.6"
gem "sinatra-basic-auth"
gem "sqlite3", "~> 1.6.3"
gem "thin", "~> 1.8.2"

group :development do
  gem "pry-byebug"
  gem "rerun", require: false
end

group :development, :lint do
  gem "rubocop"
  gem "rubocop-capybara", require: false
  gem "rubocop-i18n", require: false
  gem "rubocop-packaging", require: false
  gem "rubocop-performance", require: false
  gem "rubocop-rake", require: false
  gem "rubocop-rspec", require: false
  gem "rubocop-thread_safety", "~> 0.5.1", require: false
end

group :test do
  gem "brakeman"
  gem "bundler-audit"
  gem "capybara"
  gem "capybara-screenshot"
  gem "rspec"
  gem "selenium-webdriver"
end
