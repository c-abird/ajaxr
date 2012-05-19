module Ajaxr
  class Engine < Rails::Engine
    #rake_tasks do
    #  load File.join(File.dirname(__FILE__), '../rails/railties/tasks.rake')
    #end

    initializer 'ajaxr.asset_pipeline' do |app|
      #app.config.assets.precompile += %w( oyambre/admin.js oyambre/admin.css )

      # load oymabre.yml
      #config_file = File.join(Rails.root, 'config', 'oyambre.yml')
      #app.config.oyambre = OpenStruct.new(YAML::load_file(config_file)) rescue OpenStruct.new
      #app.config.oyambre.languages ||= %w(en)
    end 
  end
end
