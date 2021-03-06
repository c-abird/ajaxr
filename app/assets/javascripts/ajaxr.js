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
  var scroll = 0;

  $.ajaxr = ajaxr = {
    // current absolute url
    nextUrl: $(window.location).attr('href'),

    // last absolute url
    currentUrl: undefined,

    // block flag
    blocked: false,

    // returns the json URL for a href. may be overridden
    jsonUrl: function(url) {
      // TODO check trailing slash
      return url + ".json";
    },

    // block
    block: function() {
      ajaxr.blocked = true;
    },

    // release
    release: function() {
      ajaxr.blocked = false;
    },
    
    // find the first handler matching the urls and calls it
    trigger: function(eventType, data) {
      var i = handlers[eventType].length;
      while(i--) {
        var item = handlers[eventType][i];
        var sourcePattern = item[0],
            targetPattern = item[1],
            handler       = item[2];
        if (ajaxr.currentUrl.match(sourcePattern) && ajaxr.nextUrl.match(targetPattern)) {
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
      var sourcePattern, targetPattern, handler;
      switch(arguments.length) {
      case 2:
        sourcePattern = /.*/;
        targetPattern = /.*/;
        handler       = arguments[1];
        break;
      case 3:
        sourcePattern = /.*/;
        targetPattern = arguments[1];
        handler       = arguments[2];
        break;
      case 4:
        sourcePattern = arguments[1];
        targetPattern = arguments[2];
        handler       = arguments[3];
        break;
      default:
        throw 'wrong number of arguments';
      }
      handlers[eventType].push([sourcePattern, targetPattern, handler]);
    },

    // handles the AJAX request
    handleRequest: function(url) {
      var options = $.extend(ajaxr.optionsForUrl(url), {
        url: ajaxr.jsonUrl(url),
        beforeSend: function(xhr, settings) {
          return ajaxr.trigger('beforeSend', [xhr, settings]);
        },
        success: function(data, status, xhr) {
          ajaxr.trigger('success', [data, status, xhr]);
        },
        complete: function(xhr, status) {
          ajaxr.trigger('complete', [xhr, status]);
        },
        error: function(xhr, status, error) {
          ajaxr.trigger('error', [xhr, status, error]);
        }
      });

      return $.ajax(options);
    }
  };
  
  // register default success handler
  ajaxr.registerEvent('success', /.*/, function(data, status, xhr) {
    $.each(data, function(key, value) {
      $("#" + key).html(value);
    });
  });

  // keep track of scrolling (for browser scoll history suppression)
  $(window).scroll(function() { scroll = $(window).scrollTop(); });

  // bind history handler
  History.Adapter.bind(window,'statechange',function() {
    // restore the scroll position
    if (scroll >= 0) $(window).scrollTop(scroll);
    scroll = 0;

    var State = History.getState();
    $.ajaxr.currentUrl = $.ajaxr.nextUrl;
    $.ajaxr.nextUrl = State.url;
    ajaxr.handleRequest(State.url);
  });

  // register links with remote and history enabled
  $(document).delegate("a[data-remote][data-history]", "ajax:before", function(event) {
    if ($.ajaxr.blocked) return false;

    scroll = -1;
    var url = $.rails.href($(this));

    if ( event.which == 2 || event.metaKey ) { return true; }

    History.pushState(null, null, url);
    event.preventDefault();
    return false;
  });

})(window);
