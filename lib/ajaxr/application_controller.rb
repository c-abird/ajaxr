module Ajaxr
  module Controller
    #extend ActiveSupport::Concern

    module InstanceMethods
      def render_as_json
        template = "#{params[:controller]}/#{params[:action]}"
        render :template     => template,
               :layout       => 'ajaxr.json',
               :formats      => [:html],
               :content_type => 'application/json'
      end
    end
  end
end

::ActionController::Base.send :include, Ajaxr::Controller::InstanceMethods
