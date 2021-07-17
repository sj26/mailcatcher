require "spec_helper"

RSpec.describe "mailcatcher command" do
  context "--version" do
    it "shows a version then exits" do
      expect { system %(mailcatcher --version) }
        .to output(a_string_including("MailCatcher v#{MailCatcher::VERSION}"))
        .to_stdout_from_any_process
    end
  end

  context "--help" do
    it "shows help then exits" do
      expect { system %(mailcatcher --help) }
        .to output(a_string_including("MailCatcher v#{MailCatcher::VERSION}") & a_string_including("--help") & a_string_including("Display this help information"))
        .to_stdout_from_any_process
    end
  end
end
