require 'rubygems'
require 'rake'
require 'rdoc/task'

RDoc::Task.new do |rdoc|
  version = File.read('VERSION')

  rdoc.title = "MailCatcher #{version}"
  rdoc.rdoc_dir = 'rdoc'
  rdoc.rdoc_files.include('README.md')
  rdoc.rdoc_files.include('lib/**/*.rb')
end