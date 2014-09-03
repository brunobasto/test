(function() {
  'use strict';

  define(function() {
    // TODO - Detect when storage is getting full to dump it to the server
    // max storage is near 5MB

    var StorageStack = function(key) {
      if (!key) {
        throw new Error('StorageStack expects a key to use as localStorage key');
      }

      this.key = key;
    };

    StorageStack.prototype.destroy = function() {
      localStorage.removeItem(this.key);
    };

    StorageStack.prototype.items = function() {
      var stack = localStorage.getItem(this.key);

      if (stack && typeof stack === 'string') {
        try {
          stack = JSON.parse(stack);
        }
        catch (e) {
          stack = [];
        }
      }
      else {
        stack = [];
      }

      return stack;
    };

    StorageStack.prototype.push = function(val) {
      var stack = this.items();

      stack.push(val);

      localStorage.setItem(this.key, JSON.stringify(stack));
    };

    return StorageStack;
  });
})();