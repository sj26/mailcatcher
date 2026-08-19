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
  opts = Selenium::WebDriver::Chrome::Options.new

  opts.add_argument('disable-gpu')
  opts.add_argument('force-device-scale-factor=1')
  opts.add_argument('window-size=1400,900')

  # Use NO_HEADLESS to open real chrome when debugging tests
  unless ENV["NO_HEADLESS"]
    opts.add_argument('headless=new')
  end

  Capybara::Selenium::Driver.new app, browser: :chrome,
    service: Selenium::WebDriver::Service.chrome(log: File.expand_path("../tmp/chromedriver.log", __dir__)),
    options: opts
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
    # Start MailCatcher
    @pid = spawn "bundle", "exec", "mailcatcher", "--foreground", "--smtp-port", SMTP_PORT.to_s, "--http-port", HTTP_PORT.to_s

    # Wait for it to boot
    begin
      Socket.tcp(LOCALHOST, SMTP_PORT, connect_timeout: 1) { |s| s.close }
      Socket.tcp(LOCALHOST, HTTP_PORT, connect_timeout: 1) { |s| s.close }
    rescue Errno::ECONNREFUSED, Errno::ETIMEDOUT
      retry
    end

    # Open the web interface
    visit "/"

    # Wait for the websocket to be available to avoid race conditions
    wait.until { page.evaluate_script("MailCatcher.websocket.readyState") == 1 rescue false }
  end

  config.after :each, type: :feature do
    # Quit MailCatcher
    Process.kill("TERM", @pid)
    Process.wait
  rescue Errno::ESRCH
    # It's already gone
  end
end
