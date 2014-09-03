(function() {
  'use strict';

  define(['sequence'], function(Sequence) {
    function SequenceRegistry() {
      this.registry = {};
    }

    SequenceRegistry.registry = null;

    SequenceRegistry.instance = null;

    SequenceRegistry.getSingleton = function() {
      if (SequenceRegistry.instance) {
        return SequenceRegistry.instance;
      }
      return (SequenceRegistry.instance = new SequenceRegistry());
    };

    SequenceRegistry.prototype.each = function(fn) {
      for (var sequence in this.registry) {
        fn.apply(this, [this.registry[sequence], sequence]);
      }
    };

    SequenceRegistry.prototype.get = function(sequence) {
      return this.registry[sequence];
    };

    SequenceRegistry.prototype.isRegistered = function(sequence) {
      return this.get(sequence) !== undefined;
    };

    SequenceRegistry.prototype.register = function(sequence) {
      this.registry[sequence.name] = new Sequence(sequence);
    };

    SequenceRegistry.prototype.unregister = function(sequence) {
      delete this.registry[sequence];
    };

    return SequenceRegistry;
  });
})();