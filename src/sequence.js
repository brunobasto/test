'use strict';

define(function() {
  function Sequence(config) {
    this.lastContext;

    this.currentIndex = 0;

    this.config = config;
  };

  Sequence.prototype.validate = function(el) {
    var config = this.config;

    if (config.trigger && this.validateTrigger(el)) {
      return true;
    }

    if (!config.trigger && this.validateContext(el)) {
      return true;
    }

    return false;
  };

  Sequence.prototype.getNextAction = function() {
    var config = this.config,
        actions = config.actions;

    var action = actions[this.currentIndex];

    this.currentIndex++;

    return action;
  };

  Sequence.prototype.start = function(engine) {
    console.log('started sequence [', this.config.name, ']');

    engine.activeSequence = this;
  };

  Sequence.prototype.stop = function(engine) {
    var config = this.config;

    this.currentIndex = 0;

    delete engine.activeSequence;

    console.log('stopped sequence [', this.config.name, ']');

    if (config.pauseOnEnd) {
      engine.pause();
    }
  };

  Sequence.prototype.validateContext = function(el) {
    var config = this.config,
        context = config.context;

    return document.querySelector(context) === el;
  };

  Sequence.prototype.validateTrigger = function(el) {
    var config = this.config,
        trigger = config.trigger;

    return document.querySelector(trigger) === el;
  };

  return Sequence;
});
