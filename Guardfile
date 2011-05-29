# Guardfile
# More info at https://github.com/guard/guard#readme

guard 'ego' do
  watch 'Guardfile'
end

guard 'sass', :output => 'stylesheets' do
  watch %r{^public/stylesheets/.+\.s[ac]ss}
end

guard 'coffeescript', :input => 'public/javascripts'
