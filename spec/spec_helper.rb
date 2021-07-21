# frozen_string_literal: true

ENV["MAILCATCHER_ENV"] ||= "test"

require "capybara/rspec"
require "capybara-screenshot/rspec"
require "selenium/webdriver"

require "net/smtp"
require "socket"

require "mail_catcher"

DEFAULT_FROM = "from@example.com"
DEFAULT_TO = "to@example.com"

LOCALHOST = "127.0.0.1"
SMTP_PORT = 20025
HTTP_PORT = 20080

# Use headless chrome by default
Capybara.default_driver = :selenium
Capybara.register_driver :selenium do |app|
  args = %w[--disable-gpu --force-device-scale-factor=1 --window-size=1400,900]

  # Use NO_HEADLESS to open real chrome when debugging tests
  unless ENV["NO_HEADLESS"]
    args << "--headless"
  end

  Capybara::Selenium::Driver.new app, browser: :chrome,
    service: Selenium::WebDriver::Service.chrome(args: { log_path: File.expand_path("../tmp/chromedriver.log", __dir__) }),
    options: Selenium::WebDriver::Chrome::Options.new(args: args)
end

Capybara.configure do |config|
  # Don't start a rack server, connect to mailcatcher process
  config.run_server = false

  # Give a little more leeway for slow compute in CI
  config.default_max_wait_time = 10 if ENV["CI"]

  # Save into tmp directory
  config.save_path = File.expand_path("../tmp/capybara", __dir__)
end

# Tell Capybara to talk to mailcatcher
Capybara.app_host = "http://#{LOCALHOST}:#{HTTP_PORT}"

RSpec.configure do |config|
  # Helpers for delivering example email
  def deliver(message, options={})
    options = {:from => DEFAULT_FROM, :to => DEFAULT_TO}.merge(options)
    Net::SMTP.start(LOCALHOST, SMTP_PORT) do |smtp|
      smtp.send_message message, options[:from], options[:to]
    end
  end

  def read_example(name)
    File.read(File.expand_path("../../examples/#{name}", __FILE__))
  end

  def deliver_example(name, options={})
    deliver(read_example(name), options)
  end

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

  def wait
    Selenium::WebDriver::Wait.new
  end

  config.before :each, type: :feature do
    # If not already started, or quit ..
    unless @pid && (Process.kill(0, @pid) rescue false)
      # Start MailCatcher
      @pid = spawn "bundle", "exec", "mailcatcher", "--foreground", "--smtp-port", SMTP_PORT.to_s, "--http-port", HTTP_PORT.to_s

      # Wait for it to boot
      begin
        TCPSocket.new(LOCALHOST, SMTP_PORT).close
        TCPSocket.new(LOCALHOST, HTTP_PORT).close
      rescue Errno::ECONNREFUSED
        retry
      end
    end

    # Open the web interface
    visit "/"

    # Wait for the websocket to be available to avoid race conditions
    wait.until { page.evaluate_script("MailCatcher.websocket.readyState") == 1 rescue false }
  end

  config.after :all, type: :feature do
    # Quit any remaining subprocesses at the end
    Process.kill("TERM", 0) and Process.wait
  rescue Errno::ESRCH
    # It's already gone
  end
end
