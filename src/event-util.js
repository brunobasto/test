'use strict';

define(function() {
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
    }
  };

  return EventUtil;
});
