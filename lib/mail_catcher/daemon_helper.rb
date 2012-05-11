module MailCatcher
  class DaemonHelper
    def self.start!
      system %{sh -c 'cd #{Dir.pwd} && mailcatcher 2>&1'}
    end

    def self.halt!
      system %{sh -c lsof -i | grep 'localhost:socks (LISTEN)' | awk '{ print $2 }' | xargs kill}
    end

    def self.running?
      pid == "" ? false : true
    end

    def self.pid
      `sh -c lsof -i | grep 'localhost:socks (LISTEN)' | awk '{ print $2 }'`.strip
    end
  end
end