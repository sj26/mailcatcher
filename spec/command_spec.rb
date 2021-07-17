require "spec_helper"

RSpec.describe "mailcatcher command" do
  context "--version" do
    it "shows a version then exits" do
      expect { system %(mailcatcher --version) }
        .to output(a_string_including("MailCatcher v#{MailCatcher::VERSION}"))
        .to_stdout_from_any_process
    end
  end
end
