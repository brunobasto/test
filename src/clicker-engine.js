'use strict';

define(['src/event-util', 'src/node-util', 'src/storage-stack'], function(EventUtil, NodeUtil, StorageStack) {
  var configs = {
    allowNavigation: true,
    exceptions: [
      {
        textMatching: /sign\sout/ig
        },
      {
        tagMatching: /script|link|body|html|head/ig
        }
    ],
    pauseOnError: false,
    sequences: [],
    waitForAjaxRequests: true
  };

  var ClickerEngine = function() {
    var instance = this;

    instance.currentElement = null;

    var storage = new StorageStack('clicks');

    window.addEventListener('error', function(event) {
      var el = clicker.currentElement,
        path = '';

      if (el) {
        path = NodeUtil.getPath(el);
      }

      var details = {
        colno: event.colno,
        elementPath: path,
        filename: event.filename,
        lineno: event.lineno,
        message: event.message,
        url: location.href
      };

      storage.push(details);

      if (configs.pauseOnError) {
        clicker.pause();
      }
    });

    // pause when page is loading
    document.onreadystatechange = function() {
      if (document.readyState == 'complete') {
        clicker.play();
      }
      else {
        clicker.pause();
      }
    }
  }

  ClickerEngine.prototype._isException = function(el) {
    var exceptions = configs.exceptions;

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

  ClickerEngine.prototype.play = function() {
    var instance = this;

    instance.interval = setInterval(function() {
      var elements = document.querySelectorAll('*');

      var el = elements[Math.floor(Math.random() * elements.length)];

      if (NodeUtil.isNode(el) && !instance._isException(el)) {
        instance.currentElement = el;

        if (!configs.allowNavigation) {
          el.addEventListener('click', function(event) {
            event.preventDefault();
          });
        }

        EventUtil.simulate(el, 'click');
      }
      else {
        console.log('skipped', el);
      }
    }, 100);

    console.log('playing');
  };

  ClickerEngine.prototype.pause = function() {
    var instance = this;

    clearInterval(instance.interval);

    console.log('paused');
  };

  // TODO - also pause when AJAX is in progress
  // XMLHttpRequest.prototype.open = function(a,b) {
  //     console.log(arguments);
  // }

  return ClickerEngine;
});
