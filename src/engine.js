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
  var Engine = function(config) {
    this.config = _.defaults(
      config || {},
      {
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
        stopOnError: false,
        waitForAjaxRequests: true
      }
    );

    this.ajaxListener = new AjaxListener();

    this.currentElement = null;

    this.storage = new StorageStack('clicks');

    this._bindEvents();
  };

  Engine.registry = SequenceRegistry.getSingleton();

  Engine.prototype._bindEvents = function() {
  };

  Engine.prototype.computeNextElement = function() {
    var element = NodeUtil.random();

    this.currentElement = element;

    return element;
  };

  Engine.prototype.getActiveSequence = function() {
    return this.activeSequence;
  };

  Engine.prototype.getEligibleSequences = function(element) {
    var sequences = [];

    if (!this.hasActiveSequence()) {
      Engine.registry.each(function(sequence) {
        if (sequence.isEligible(element)) {
          sequences.push(sequence);
        }
      });
    }

    return sequences;
  };

  Engine.prototype.hasActiveSequence = function() {
    var activeSequence = this.activeSequence;

    return !!activeSequence && activeSequence.isActive();
  };

  Engine.prototype.run = function() {
    var element = this.currentElement,
        eligibles = this.getEligibleSequences(element);

    if (this.ajaxListener.isAjaxInProgress()) {
      console.log('[Engine] Waiting for ajax requests.');

      return;
    }

    var sequence;

    if (this.hasActiveSequence()) {
      sequence = this.getActiveSequence();

      sequence.next();

      if (!sequence.isActive()) {
        this.stopSequence(sequence);
      }
    }
    else if (eligibles.length) {
      sequence = eligibles[_.random(0, eligibles.length - 1)];

      this.startSequence(sequence);

      sequence.next();
    }
    
    if (!sequence) {
      EventUtil.simulate(element, 'click');
    }
  };

  Engine.prototype.start = function() {
    var instance = this;

    this.stop();

    this.interval = setInterval(function() {
      instance.computeNextElement();

      instance.run();
    }, this.config.interval);
  };

  Engine.prototype.startSequence = function(sequence) {
    console.log('started', sequence.name);

    sequence.start();

    this.activeSequence = sequence;
  };

  Engine.prototype.stop = function() {
    clearInterval(this.interval);
  };

  Engine.prototype.stopSequence = function(sequence) {
    console.log('stopped', sequence.name);

    sequence.stop();

    delete this.activeSequence;
  };


  return Engine;
});
