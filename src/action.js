'use strict';

define(['underscore', 'event-util'], function(_, EventUtil) {
  function Action(config) {
    _.defaults(config, {
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
    EventUtil.simulate(this.getElement(), this.getEvent());
  };

  return Action;
});

// this logic should be here
/*
ClickerEngine.prototype.processAction = function(action) {
  var instance = this,
      context = document,
      element,
      parsed = {},
      selector = action.selector;

  if (action.context) {
    context = document.querySelector(action.context) || document;
  }

  if (selector === '#random') {
    var elements = context.querySelectorAll('*');

    element = elements[Math.floor(Math.random() * elements.length)];
  }
  else {
    element = context.querySelector(selector);
  }

  if (element && instance.isExcludedElement(element)) {
    element = null;
  }

  parsed.element = element || document.body;
  parsed.event = action.event || 'click';

  return parsed;
};

// excluded elements cannot run

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
