'use strict';

define(['underscore'], function(_) {
  var _send = XMLHttpRequest.prototype.send;

  var counter = 0;

  function AjaxListener(config) {
    this.config = _.defaults(config || {}, {
    });

    XMLHttpRequest.prototype.send = this.send;
  }

  AjaxListener.prototype.abort = function() {
    this.counter = this.counter ? --this.counter : 0;

    this.originalAbort.apply(this.originalAbort, arguments);
  };

  AjaxListener.prototype.send = function() {
    var request = this;

    _send.apply(this, arguments);

    ++counter;

    var interval = setInterval(function() {
      if (request.readyState === 0 || request.readyState === 4) {
        clearInterval(interval);

        --counter;
      }
    }, 0);
  };

  AjaxListener.prototype.isAjaxInProgress = function() {
    return counter > 0;
  };

  AjaxListener.prototype.restore = function() {
    XMLHttpRequest.prototype.send = function() {};
  };

  return AjaxListener;
});
