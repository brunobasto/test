'use strict';

define(['underscore'], function(_) {
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

    simulateTextInput: function(el, text) {
      var keyboardEvent, textEvent;

      _.each(text, function(character) {
        keyboardEvent = document.createEvent('KeyboardEvent');

        Object.defineProperty(keyboardEvent, 'keyCode', {
          get: function() {
            return this.keyCodeVal;
          }
        });

        Object.defineProperty(keyboardEvent, 'which', {
          get: function() {
            return this.keyCodeVal;
          }
        });

        keyboardEvent.initKeyboardEvent('keydown', true, true, window, 0, 0, 0, 0, 0, character.charCodeAt(0));

        el.dispatchEvent(keyboardEvent);

        textEvent = document.createEvent('TextEvent');

        textEvent.initTextEvent('textInput', true, true, window, character, 9, 'en-US');

        el.dispatchEvent(textEvent);
      });
    },

    attach: function(el, etype, fn) {
      var addMethod = modern ? 'addEventListener' : 'attachEvent',
          prefix = modern ? '' : 'on';

      el[addMethod](prefix + etype, fn, false);
    }
  };

  return EventUtil;
});
