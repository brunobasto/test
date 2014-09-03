(function() {
  'use strict';

  define(['underscore'], function(_) {
    var modern = !!document.addEventListener;

    var EventUtil = {
      attach: function(el, etype, fn) {
        var addMethod = modern ? 'addEventListener' : 'attachEvent',
            prefix = modern ? '' : 'on';

        el[addMethod](prefix + etype, fn, false);
      },

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
        var instance = this, keyDownEvent, keyPressEvent, keyUpEvent, textEvent;

        // focus before interacting with it
        el.focus();

        _.each(text, function(character) {
          // keyDown
          keyDownEvent = document.createEvent('KeyboardEvent');

          instance._defineKeyEventProperties(keyDownEvent);

          keyDownEvent.initKeyboardEvent('keydown', true, true, document.defaultView, 0, 0, 0, 0, 0, character.charCodeAt(0));

          el.dispatchEvent(keyDownEvent);

          // keyPress
          keyPressEvent = document.createEvent('KeyboardEvent');

          instance._defineKeyEventProperties(keyPressEvent);

          keyPressEvent.initKeyboardEvent('keypress', true, true, document.defaultView, 0, 0, 0, 0, 0, character.charCodeAt(0));

          el.dispatchEvent(keyPressEvent);

          // keyUp
          keyUpEvent = document.createEvent('KeyboardEvent');

          instance._defineKeyEventProperties(keyUpEvent);

          keyUpEvent.initKeyboardEvent('keyup', true, true, document.defaultView, 0, 0, 0, 0, 0, character.charCodeAt(0));

          el.dispatchEvent(keyUpEvent);

          // textInput
          textEvent = document.createEvent('TextEvent');

          textEvent.initTextEvent('textInput', true, true, document.defaultView, character, 9, 'en-US');

          el.dispatchEvent(textEvent);
        });
      },

      _defineKeyEventProperties: function(keyEvent) {
        try {
          Object.defineProperty(keyEvent, 'keyCode', {
            get: function() {
              return this.keyCodeVal;
            }
          });

          Object.defineProperty(keyEvent, 'which', {
            get: function() {
              return this.keyCodeVal;
            }
          });
        }
        catch (e) {
        }
      }
    };

    return EventUtil;
  });
})();