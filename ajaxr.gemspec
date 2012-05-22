# Generated by jeweler
# DO NOT EDIT THIS FILE DIRECTLY
# Instead, edit Jeweler::Tasks in Rakefile, and run 'rake gemspec'
# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "ajaxr"
  s.version = "0.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Claas Abert"]
  s.date = "2012-05-22"
  s.email = "claas@cabird.de"
  s.extra_rdoc_files = [
    "LICENSE.txt",
    "README.rdoc"
  ]
  s.files = [
    "app/assets/javascripts/ajaxr.js",
    "app/assets/javascripts/history_adapter_jquery.js",
    "app/assets/javascripts/history_adapter_jquery.min.js",
    "app/assets/javascripts/history_core.js",
    "app/assets/javascripts/history_core.min.js",
    "app/assets/javascripts/history_html4.js",
    "app/assets/javascripts/history_html4.min.js",
    "app/assets/javascripts/history_jquery.js",
    "app/assets/javascripts/history_jquery.min.js",
    "app/assets/javascripts/history_jquery_html5.js",
    "app/assets/javascripts/history_jquery_html5.min.js",
    "app/assets/javascripts/json2.js",
    "app/assets/javascripts/json2.min.js",
    "app/views/layouts/ajaxr.json.erb",
    "lib/ajaxr.rb",
    "lib/ajaxr/application_controller.rb",
    "lib/ajaxr/application_helper.rb",
    "lib/ajaxr/engine.rb"
  ]
  s.require_paths = ["lib"]
  s.rubygems_version = "1.8.10"
  s.summary = "Description of your gem"

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>, ["~> 1.0.0"])
      s.add_development_dependency(%q<jeweler>, ["~> 1.8.3"])
    else
      s.add_dependency(%q<bundler>, ["~> 1.0.0"])
      s.add_dependency(%q<jeweler>, ["~> 1.8.3"])
    end
  else
    s.add_dependency(%q<bundler>, ["~> 1.0.0"])
    s.add_dependency(%q<jeweler>, ["~> 1.8.3"])
  end
end

