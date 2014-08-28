'use strict';

define(['underscore', 'action'], function(_, Action) {
  function Sequence(config) {
    this.config = _.defaults(
      config || {},
      {
        actions: []
      }
    );

    if (!this.config.name) {
      throw new Error('Please especify a name for your Sequence!');
    }

    this.currentIndex = -1;

    this.name = this.config.name;

    this.setActions(this.config.actions);
  };

  Sequence.prototype.getActions = function() {
    return this.actions;
  };

  Sequence.prototype.getContext = function() {
    var config = this.config,
        context = config.context;

    return document.querySelector(context);
  };

  Sequence.prototype.getCurrentIndex = function() {
    return this.currentIndex;
  };

  Sequence.prototype.getTrigger = function() {
    var config = this.config,
        trigger = config.trigger;

    return document.querySelector(trigger);
  };

  Sequence.prototype.isActive = function() {
    return (this.getCurrentIndex() > -1) && (this.getCurrentIndex() < this.actions.length);
  };

  Sequence.prototype.isEligible = function(el) {
    var config = this.config,
        context = this.getContext(),
        trigger = this.getTrigger();

    if (trigger) {
      return el === trigger;
    }

    if (context) {
      return el === context;
    }

    return false;
  };

  Sequence.prototype.next = function() {
    this.currentIndex++;

    this.actions[this.getCurrentIndex()].run();

    if (this.getCurrentIndex() >= this.actions.length - 1) {
      this.currentIndex = -1;
    }
  };

  Sequence.prototype.setActions = function(actions) {
    var instance = this;

    instance.actions = [];

    _.each(actions, function(action) {
        action.sequence = instance;

        instance.actions.push(new Action(action));
    });
  };

  return Sequence;
});
