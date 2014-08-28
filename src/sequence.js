'use strict';

define(['underscore', 'action', 'node-util'], function(_, Action, NodeUtil) {
  var INDEX_INACTIVE = -1;

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

    this.currentIndex = INDEX_INACTIVE;

    this.name = this.config.name;

    this.setActions(this.config.actions);
  };

  Sequence.INDEX_INACTIVE = INDEX_INACTIVE;

  Sequence.prototype.getActions = function() {
    return this.actions;
  };

  Sequence.prototype.getContextNode = function() {
    var config = this.config,
        context = config.context;

    return document.querySelector(context);
  };

  Sequence.prototype.getCurrentIndex = function() {
    return this.currentIndex;
  };

  Sequence.prototype.getTriggerNode = function() {
    var config = this.config,
        trigger = config.trigger;

    if (trigger === '#random') {
      return NodeUtil.random();
    }

    return document.querySelector(trigger);
  };

  Sequence.prototype.isActive = function() {
    return (this.getCurrentIndex() > INDEX_INACTIVE) && (this.getCurrentIndex() < this.actions.length);
  };

  Sequence.prototype.isEligible = function(el) {
    var config = this.config;

    // sequences without actions are always ineligible
    if (!this.actions.length) {
      return false;
    }

    if (config.trigger) {
      if (config.trigger === '#any') {
        return true;
      }

      return el === this.getTriggerNode();
    }

    return false;
  };

  Sequence.prototype.next = function() {
    if (!this.isActive()) {
      throw new Error('You must start a sequence before trying yo run it.');
    }

    this.actions[this.getCurrentIndex()].run();

    this.currentIndex++;

    if (this.getCurrentIndex() >= this.actions.length) {
      this.stop();
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

  Sequence.prototype.start = function() {
    this.stop();

    this.currentIndex = 0;
  };

  Sequence.prototype.stop = function() {
    this.currentIndex = INDEX_INACTIVE;
  };

  return Sequence;
});
