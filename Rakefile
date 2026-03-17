# frozen_string_literal: true

require 'fileutils'
require 'rubygems'

require 'mail_catcher/version'

# XXX: Would prefer to use Rake::SprocketsTask but can't populate
# non-digest assets, and we don't want sprockets at runtime so
# can't use manifest directly. Perhaps index.html should be
# precompiled with digest assets paths?

desc 'Compile assets'
task 'assets' do
  compiled_path = File.expand_path('public/assets', __dir__)
  FileUtils.mkdir_p(compiled_path)

  require 'mail_catcher/web/assets'
  sprockets = MailCatcher::Web::Assets

  # Sprockets 4.x compatibility: access the internal environment
  environment = sprockets.instance_variable_get(:@environment)
  require 'uglifier'

  # Custom compressor that conditionally minifies based on file extension
  class SelectiveUglifier
    def initialize(uglifier)
      @uglifier = uglifier
    end

    def call(input)
      # Skip minification for already-minified files, modern ES syntax, and newer JS modules
      filename = input[:filename] || ''
      if filename.include?('.min.') || filename.include?('mailcatcher.js') || filename.include?('mailcatcher-ui') || filename.include?('modules/')
        input[:data]
      else
        @uglifier.compress(input[:data])
      end
    end
  end

  uglifier = Uglifier.new(harmony: true, output: { beautify: false })
  environment.js_compressor = SelectiveUglifier.new(uglifier)

  # Compile specific assets (MailCatcher-specific code + pre-built minified libs)
  # Development: Sprockets serves these directly from assets/ with correct MIME types
  # Production: These are minified and compiled to public/assets/
  asset_names = ['mailcatcher.js', 'mailcatcher.css', 'mailcatcher-ui.js', 'highlight.min.js']
  asset_names.each do |asset_name|
    if asset = environment.find_asset(asset_name)
      target = File.join(compiled_path, asset_name)
      asset.write_to target
    end
  end

  # Copy image assets referenced by stylesheets
  assets_dir = File.expand_path('assets/images', __dir__)
  if Dir.exist?(assets_dir)
    Dir.glob("#{assets_dir}/*.png").each do |image_path|
      filename = File.basename(image_path)
      target = File.join(compiled_path, filename)
      FileUtils.cp(image_path, target)
    end
  end

  # Copy npm dependencies to public/assets/
  npm_source_files = {
    # JavaScript files
    'node_modules/jquery/dist/jquery.min.js' => 'jquery.min.js',
    'node_modules/jquery/dist/jquery.min.map' => 'jquery.min.map',
    'node_modules/@popperjs/core/dist/umd/popper.min.js' => 'popper.min.js',
    'node_modules/@popperjs/core/dist/umd/popper.min.js.map' => 'popper.min.js.map',
    'node_modules/tippy.js/dist/tippy-bundle.umd.min.js' => 'tippy.min.js',
    # CSS files (moved from local assets to npm)
    'node_modules/tippy.js/themes/light.css' => 'tippy-light.min.css',
    'node_modules/highlight.js/styles/atom-one-light.min.css' => 'atom-one-light.min.css'
  }

  npm_source_files.each do |source, dest|
    source_path = File.expand_path(source, __dir__)
    target_path = File.join(compiled_path, dest)
    if File.exist?(source_path)
      FileUtils.cp(source_path, target_path)
    else
      puts "Warning: npm dependency not found: #{source_path}"
    end
  end

  # Keep favcount as vendored file since it's not on npm
  favcount_source = File.expand_path('vendor/assets/javascripts/favcount.js', __dir__)
  if File.exist?(favcount_source)
    FileUtils.cp(favcount_source, File.join(compiled_path, 'favcount.js'))
  end
end

desc 'Package as Gem'
task 'package' => ['assets'] do
  require 'rubygems/package'
  require 'rubygems/specification'

  spec_file = File.expand_path('mailcatcher-ng.gemspec', __dir__)
  spec = Gem::Specification.load(spec_file)

  Gem::Package.build spec
end

desc 'Release Gem to RubyGems'
task 'release' => ['package'] do
  `gem push mailcatcher-#{MailCatcher::VERSION}.gem`
end

require 'rdoc/task'

RDoc::Task.new(rdoc: 'doc', clobber_rdoc: 'doc:clean', rerdoc: 'doc:force') do |rdoc|
  rdoc.title = "MailCatcher #{MailCatcher::VERSION}"
  rdoc.rdoc_dir = 'doc'
  rdoc.main = 'README.md'
  rdoc.rdoc_files.include 'lib/**/*.rb'
end

require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:test) do |rspec|
  rspec.rspec_opts = '--format doc'
end

task test: :assets

task default: :test
