# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "capybara/rspec"
require "capybara-screenshot/rspec"
require "selenium/webdriver"

# Use headless chrome
Capybara.default_driver = :selenium
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new app, browser: :chrome,
    service: Selenium::WebDriver::Service.chrome(args: { log_path: "chrome.log" }),
    options: Selenium::WebDriver::Chrome::Options.new(args: %w[--headless --disable-gpu --force-device-scale-factor=1 --window-size=1400,900])
end

# Don't start a rack server, connect to mailcatcher process
Capybara.run_server = false

# Give a little more leeway for slow compute in CI
Capybara.default_max_wait_time = 10 if ENV["CI"]
