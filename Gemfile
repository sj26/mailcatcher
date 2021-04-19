# frozen_string_literal: true

source "https://rubygems.org"

gem "skinny", github: "montdidier/skinny", branch: "upgrade/eventmachine-thin"

gemspec

# mime-types 3+, required by mail, requires ruby 2.0+
gem "mime-types", "< 3" if RUBY_VERSION < "2"

#group :development do
#  gem "pry"
#end
