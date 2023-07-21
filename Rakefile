#!/usr/bin/env rake
# frozen_string_literal: true

begin
  require "bundler/setup"
rescue LoadError
  puts "You must `gem install bundler` and `bundle install` to run rake tasks"
end

begin
  require "rake/testtask"
  require "rubocop/rake_task"

  RuboCop::RakeTask.new(:rubocop) do |t|
    t.options = ["--parallel", "--display-cop-names"]
  end
rescue LoadError
  # no rspec available
end

begin
  require "rspec/core/rake_task"

  RSpec::Core::RakeTask.new(:spec)
rescue LoadError
  # no rspec available
end

task default: %i[rubocop spec]
