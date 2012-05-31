module Ajaxr
  module Controller
    #extend ActiveSupport::Concern

    module InstanceMethods
      def render_for_ajaxr(*args, &block)
        options = _normalize_args(*args, &block)
        if (params[:format] || '').to_sym == :json
          options.merge!({
            :layout       => 'ajaxr.json',
            :formats      => [:html],
            :content_type => 'application/json'
          })
        end
        render(options)
      end
    end
  end
end

::ActionController::Base.send :include, Ajaxr::Controller::InstanceMethods
