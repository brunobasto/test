'use strict';

define(
[
  'underscore',
  'event-util',
  'node-util',
  'storage-stack',
  'sequence-registry'
],
function(_, EventUtil, NodeUtil, StorageStack, SequenceRegistry) {
  var Engine = function(configs) {
    var defaults = {
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
      waitForAjaxRequests: true
    };

    this.configs = _.extend(defaults, configs);

    this.currentElement = null;

    this.registry = SequenceRegistry.getSingleton();

    this.storage = new StorageStack('clicks');

    this._bindEvents();
  };

  Engine.prototype._bindEvents = function() {
    var instance = this;

    document.onreadystatechange = function() {
      if (document.readyState == 'complete') {
        instance.start();
      }
      else {
        instance.pause();
      }
    }
  };

  Engine.prototype.startSequence = function(sequence) {
    var instance = this;

    console.log('started', sequence.name);

    sequence.next();

    instance.activeSequence = sequence;
  };

  Engine.prototype.stopSequence = function(sequence) {
    var instance = this;

    console.log('stopped', sequence.name);

    delete instance.activeSequence;
  };

  Engine.prototype.getActiveSequence = function() {
    var instance = this;

    return instance.activeSequence;
  };

  Engine.prototype.hasActiveSequence = function() {
    var instance = this,
        activeSequence = instance.activeSequence;

    return !!activeSequence && activeSequence.isActive();
  };

  Engine.prototype.getEligibleSequences = function(element) {
    var instance = this,
        sequences = [];

    instance.registry.each(function(sequence) {
      if (!instance.hasActiveSequence() && sequence.isEligible(element)) {
        sequences.push(sequence);
      }
    });

    return sequences;
  };

  Engine.prototype.run = function() {
    var instance = this,
        element = instance.currentElement,
        eligibles = instance.getEligibleSequences(element);

    if (instance.hasActiveSequence()) {
      var sequence = instance.getActiveSequence();

      sequence.next();

      if (!sequence.isActive()) {
        instance.stopSequence(sequence);
      }
    }
    else if (eligibles.length) {
      var sequence = eligibles[_.random(0, eligibles.length - 1)];

      instance.startSequence(sequence);
    }
    else {
      EventUtil.simulate(element, 'click');
    }
  };

  Engine.prototype.computeNextElement = function() {
    var instance = this,
        element = NodeUtil.random();

    instance.currentElement = element;

    return element;
  };

  Engine.prototype.start = function() {
    var instance = this,
        configs = instance.configs;

    instance.pause();

    instance.interval = setInterval(function() {
      instance.computeNextElement();

      instance.run();
    }, configs.interval);
  };

  Engine.prototype.pause = function() {
    var instance = this;

    clearInterval(instance.interval);
  };

// TODO - also pause when AJAX is in progress
// XMLHttpRequest.prototype.open = function(a,b) {
//     console.log(arguments);
// }

  return Engine;
});
