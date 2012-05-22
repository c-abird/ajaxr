module ApplicationHelper
  def link_to(*args, &block)   
    name         = args[0]     
    options      = args[1] || {}    
    html_options = args[2] || {}    

    if html_options.delete(:remote_with_history)
      html_options['data-history'] = true
      html_options[:remote] = true    
    end
    super(*args, &block)       
  end
end
