// $.fn.css - Override the default .css method with one that triggers an event when it's called.
(function() {
  var orig = $.fn.css;                    // backup the built-in jQuery .css() method
  $.fn.css = function() {                 // override the build-in .css() method
    $(this).trigger({                     // trigger custom event on the target element
      type:"css_change", args:arguments   // pass the .css method's args to the handler
    }); 
    return orig.apply(this, arguments);   // perform the built-in .css() method like normal.
  }
})();