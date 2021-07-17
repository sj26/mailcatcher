# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "capybara/rspec"
require "capybara-screenshot/rspec"
require "selenium/webdriver"

# Use headless chrome
Capybara.default_driver = :selenium
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new app, browser: :chrome,
    service: Selenium::WebDriver::Service.chrome(args: { log_path: File.expand_path("../tmp/chromedriver.log", __dir__) }),
    options: Selenium::WebDriver::Chrome::Options.new(args: %w[--headless --disable-gpu --force-device-scale-factor=1 --window-size=1400,900])
end

Capybara.configure do |config|
  # Don't start a rack server, connect to mailcatcher process
  config.run_server = false

  # Give a little more leeway for slow compute in CI
  config.default_max_wait_time = 10 if ENV["CI"]

  # Save into tmp directory
  config.save_path = File.expand_path("../tmp/capybara", __dir__)
end

RSpec.configure do |config|
  # Teach RSpec to gather console errors from chrome when there are failures
  config.after(:each, type: :feature) do |example|
    # Did the example fail?
    next unless example.exception # "failed"

    # Do we have a browser?
    next unless page.driver.browser

    # Retrieve console logs if the browser/driver supports it
    logs = page.driver.browser.manage.logs.get(:browser) rescue []

    # Anything to report?
    next if logs.empty?

    # Add the log messages so they appear in failures

    # This might already be a string, an array, or nothing
    # Array(nil) => [], Array("a") => ["a"], Array(["a", "b"]) => ["a", "b"]
    lines = example.metadata[:extra_failure_lines] = Array(example.metadata[:extra_failure_lines])

    # Add a gap if there's anything there and it doesn't end with an empty line
    lines << "" if lines.last

    lines << "Browser console errors:"
    lines << JSON.pretty_generate(logs.map { |log| log.as_json })
  end
end
