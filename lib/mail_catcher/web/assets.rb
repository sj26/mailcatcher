require "sprockets"
require "sprockets-sass"
require "compass"

require "mail_catcher/web/application"

module MailCatcher
  module Web
    Assets = Sprockets::Environment.new(Application.root).tap do |sprockets|
      Dir["#{Application.root}/{,vendor}/assets/*"].each do |path|
        sprockets.append_path(path)
      end
    end
  end
end
