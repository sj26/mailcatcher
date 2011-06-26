# Guardfile
# More info at https://github.com/guard/guard#readme

guard 'ego' do
  watch 'Guardfile'
end

guard 'compass', :sass_dir => "public/stylesheets", :css_dir => "public/stylesheets" do
  watch %r{^public/stylesheets/.+\.s[ac]ss}
end

guard 'coffeescript', :input => 'public/javascripts'
