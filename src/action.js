(function() {
  'use strict';

  define(['underscore', 'event-util'], function(_, EventUtil) {
    function Action(config) {
      _.defaults(config, {
        text: ''
      });

      this.config = config;

      var sequence = config.sequence;

      if (!sequence) {
        throw new Error('Action must belong to a Sequence.');
      }

      this.sequence = sequence;
    }

    Action.prototype.getElement = function() {
      var config = this.config,
          element = document.querySelector(config.selector);

      if (!element) {
        throw new Error('Action could not find the target element for selector "' + config.selector + '"');
      }

      return element;
    };

    Action.prototype.getEvent = function() {
      var config = this.config,
          event = config.event;

      if (!event) {
        throw new Error('Action could not find the target event "' + event + '"');
      }

      return event;
    };

    Action.prototype.getContext = function() {
      var config = this.config;

      return config.context;
    };

    Action.prototype.run = function() {
      var config = this.config,
          element = this.getElement(),
          event = this.getEvent();

      if (event === 'text') {
        EventUtil.simulateTextInput(element, config.text);
      }
      else {
        EventUtil.simulate(element, event);
      }
    };

    return Action;
  });

  // excluded elements cannot run
  /*
  ClickerEngine.prototype.isExcludedElement = function(el) {
    var instance = this,
        exceptions = instance.configs.exceptions;

    for (var i = 0; i < exceptions.length; i++) {
      var exception = exceptions[i];

      if (exception.tagMatching) {
        var matched = exception.tagMatching.test(el.tagName);

        if (matched) {
          return true;
        }
      }

      if (exception.textMatching) {
        var matched = exception.textMatching.test(el.innerHTML);

        if (matched) {
          return true;
        }
      }
    }

    return false;
  };
  */

})();