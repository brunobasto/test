'use strict';

define(function() {
  var modern = !!document.addEventListener;

  var EventUtil = {
    simulate: function(el, etype) {
      if (el.fireEvent) {
        el.fireEvent('on' + etype);
      }
      else {
        var evObj = document.createEvent('Events');

        evObj.initEvent(etype, true, true);

        el.dispatchEvent(evObj);
      }
    },

    attach: function(el, etype, fn) {
      var addMethod = modern ? 'addEventListener' : 'attachEvent',
          prefix = modern ? '' : 'on';

      el[addMethod](prefix + etype, fn, false);
    }
  };

  return EventUtil;
});
