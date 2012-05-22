//= require history_jquery

(function(window, undefined) {
  // get some globals
  var History = window.History,
      $ = window.jQuery,
      document = window.document,
      ajaxr;

  // container for event handlers
  var handlers = {
    beforeSend: [],
    success:    [],
    complete:   [],
    error:      []
  };

  $.ajaxr = ajaxr = {
    // current absolute url
    currentUrl: $(window.location).attr('href'),

    // returns the json URL for a href. may be overridden
    jsonUrl: function(url) {
      // TODO check trailing slash
      return url + ".json";
    },
    
    // find the first handler matching the urls and calls it
    trigger: function(url, eventType, data) {
      $.each(handlers[eventType].reverse(), function() {
        var srcPattern    = this[0],
            targetPattern = this[1],
            handler       = this[2];
        if (ajaxr.currentUrl.match(srcPattern) && url.match(targetPattern)) {
          data.push(url);
          return handler.apply(this, data);
        }
      });
      return true;
    },

    // possible additional AJAX options for an URL
    optionsForUrl: function(url) {
      return {};
    },
    
    //registerEvent: function(eventType, urlPattern, handler) {
    registerEvent: function(eventType) {
      // TODO error checking, parameter types...
      var srcPattern, targetPattern, handler;
      if (arguments.length == 3) {
        srcPattern    = /.*/;
        targetPattern = arguments[1];
        handler       = arguments[2];
      } else if (arguments.length == 4) {
        srcPattern    = arguments[1];
        targetPattern = arguments[2];
        handler       = arguments[3];
      }
      handlers[eventType].push([srcPattern, targetPattern, handler]);
    },

    // handles the AJAX request
    handleRequest: function(url) {
      var options = $.extend(ajaxr.optionsForUrl(url), {
        url: ajaxr.jsonUrl(url),
        beforeSend: function(xhr, settings) {
          return ajaxr.trigger(url, 'beforeSend', [xhr, settings]);
        },
        success: function(data, status, xhr) {
          ajaxr.trigger(url, 'success', [data, status, xhr]);
        },
        complete: function(xhr, status) {
          ajaxr.trigger(url, 'complete', [xhr, status]);
        },
        error: function(xhr, status, error) {
          ajaxr.trigger('error', [xhr, status, error]);
        }
      });

      return $.ajax(options);
    }
  };
  
  // register default success handler
  ajaxr.registerEvent('success', /.*/, function(data, status, xhr, url) {
    $.each(data, function(key, value) {
      $("#" + key).html(value);
    });
  });

  // bind history handler
  History.Adapter.bind(window,'statechange',function() {
    var State = History.getState();
    ajaxr.handleRequest(State.url);
  });

  // register links with remote and history enabled
  $(document).delegate("a[data-remote][data-history]", "ajax:before", function(event) {
    var url = $.rails.href($(this));
    History.pushState(null, null, url);
    return false;
  });

})(window);
