# frozen_string_literal: true

source "https://rubygems.org"

gemspec

# mime-types 3+, required by mail, requires ruby 2.0+
gem "mime-types", "< 3" if RUBY_VERSION < "2"

if RUBY_VERSION < "2.7"
  # Ruby 2.7 requirement introduced
  # https://github.com/SeleniumHQ/selenium/blob/selenium-4.2.0/rb/CHANGES#L25
  gem "selenium-webdriver", "< 4.2.0", group: :development
elsif RUBY_VERSION < "2.8"
  # Ruby 3.0 requirement introduced
  # https://github.com/SeleniumHQ/selenium/blob/selenium-4.9.1/rb/CHANGES#L5
  gem "selenium-webdriver", "< 4.9.1", group: :development
end

#group :development do
#  gem "pry"
#end
