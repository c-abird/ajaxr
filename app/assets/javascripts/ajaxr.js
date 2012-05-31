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

  // scroll cache to suppress browser scroll history
  var scroll;

  $.ajaxr = ajaxr = {
    // current absolute url
    currentUrl: $(window.location).attr('href'),

    lastUrl: undefined,

    // returns the json URL for a href. may be overridden
    jsonUrl: function(url) {
      // TODO check trailing slash
      return url + ".json";
    },
    
    // find the first handler matching the urls and calls it
    trigger: function(url, eventType, data) {
      var i = handlers[eventType].length;
      while(i--) {
        var item = handlers[eventType][i];
        var srcPattern    = item[0],
            targetPattern = item[1],
            handler       = item[2];
        if (ajaxr.currentUrl.match(srcPattern) && url.match(targetPattern)) {
          data.push(url);
          return handler.apply(this, data);
        }
      }
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
          //$.ajaxr.currentUrl = url;
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

  // keep track of scrolling (for browser scoll history suppression)
  $(window).scroll(function() { scroll = $(window).scrollTop(); });

  // bind history handler
  History.Adapter.bind(window,'statechange',function() {
    // restore the scroll position
    if (scroll > 0) $(window).scrollTo(scroll);
    scroll = -1;

    var State = History.getState();
    ajaxr.handleRequest(State.url);
    $.ajaxr.lastUrl    = $.ajaxr.currentUrl;
    $.ajaxr.currentUrl = State.url;
  });

  // register links with remote and history enabled
  $(document).delegate("a[data-remote][data-history]", "ajax:before", function(event) {
    // reset scroll to suppress scroll history of browser
    scroll = $(window).scrollTop();

    var url = $.rails.href($(this));
    $(window).scrollTo(0);
    History.pushState(null, null, url);

    return false;
  });

})(window);
