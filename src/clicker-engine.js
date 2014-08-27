'use strict';

define(
  [
    'event-util',
    'node-util',
    'storage-stack',
    'sequence-registry'
  ],
  function(EventUtil, NodeUtil, StorageStack, SequenceRegistry) {
    var ClickerEngine = function(configs) {
      var instance = this;

      instance.currentElement = null;

      instance.storage = new StorageStack('clicks');

      instance.sequences = SequenceRegistry.getSingleton();

      configs = configs || {
        allowNavigation: false,
        exceptions: [
          {
            textMatching: /sign\sout/ig
          },
          {
            tagMatching: /script|link|body|html|head/ig
          }
      ],
        interval: 100,
        pauseOnError: false,
        sequences: [],
        waitForAjaxRequests: true
      };

      instance.configs = configs;

      instance._bindEvents();
    }

    ClickerEngine.prototype._bindEvents = function() {
      var instance = this;

      document.onreadystatechange = function() {
        if (document.readyState == 'complete') {
          instance.start();
        }
        else {
          instance.pause();
        }
      }

      window.addEventListener('error', function(event) {
          var configs = instance.configs,
              details = instance._getErrorDetails(event);

        instance.storage.push(details);

        if (configs.pauseOnError) {
          instance.pause();
        }
      });
    };

    ClickerEngine.prototype._getErrorDetails = function(error) {
      var instance = this,
          el = instance.currentElement,
          path = '';

      if (el) {
        path = NodeUtil.path(el);
      }

      return {
        colno: event.colno,
        elementPath: path,
        filename: event.filename,
        lineno: event.lineno,
        message: event.message,
        url: location.href
      };
    };

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

    ClickerEngine.prototype.getDefaultAction = function() {
      return {
        context: 'body',
        event: 'click',
        selector: '#random',
        waitAjaxRequests: true
      };
    };

    ClickerEngine.prototype.getActiveSequence = function() {
      var instance = this;

      return instance.activeSequence;
    };

    ClickerEngine.prototype.hasActiveSequence = function() {
      var instance = this;

      return !!instance.activeSequence;
    };

    ClickerEngine.prototype.runAction = function() {
      var instance = this,
          action;

      if (instance.hasActiveSequence()) {
        var sequence = instance.getActiveSequence();

        action = sequence.getNextAction();

        if (!action) {
          sequence.stop(instance);
        }
      }

      if (!action) {
        action = instance.getDefaultAction();
      }

      action = instance.processAction(action);

      instance.sequences.each(function(sequence) {
        if (!instance.hasActiveSequence() && sequence.validate(action.element)) {
          sequence.start(instance);

          action = sequence.getNextAction();

          action = instance.processAction(action);
        }
      });

      console.log('running', action);

      EventUtil.simulate(action.element, action.event);
    };

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

    ClickerEngine.prototype.start = function() {
      var instance = this,
          configs = instance.configs;

      instance.pause();

      instance.interval = setInterval(function() {
        instance.runAction();
      }, configs.interval);
    };

    ClickerEngine.prototype.pause = function() {
      var instance = this;

      clearInterval(instance.interval);
    };

    // TODO - also pause when AJAX is in progress
    // XMLHttpRequest.prototype.open = function(a,b) {
    //     console.log(arguments);
    // }

    return ClickerEngine;
  });
