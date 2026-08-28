# frozen_string_literal: true

require "sprockets"
require "compass"

module MailCatcher
  module Web
    Assets = Sprockets::Environment.new(File.expand_path("#{__FILE__}/../../../..")).tap do |sprockets|
      Dir["#{sprockets.root}/{,vendor}/assets/*"].each do |path|
        sprockets.append_path(path)
      end
      Compass.configuration.sass_load_paths.each do |path|
        sprockets.append_path(path.root) if path.respond_to?(:root)
      end
      sprockets.register_transformer "text/sass", "text/css", Sprockets::SassCompressor.new(
        :syntax => :sass,
        :style => :expanded,
        :load_paths => sprockets.paths,
      )
    end
  end
end
