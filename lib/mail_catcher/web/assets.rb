# frozen_string_literal: true

require "sprockets"

module MailCatcher
  module Web
    Assets = Sprockets::Environment.new(File.expand_path("#{__FILE__}/../../../..")).tap do |sprockets|
      Dir["#{sprockets.root}/{,vendor}/assets/*"].each do |path|
        sprockets.append_path(path)
      end
    end
  end
end
