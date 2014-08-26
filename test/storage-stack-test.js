'use strict';

define(['src/storage-stack'], function(StorageStack) {
  var storage;

  describe('StorageStack', function() {
    beforeEach(function() {
      storage = new StorageStack('test');
    });

    afterEach(function() {
      storage.destroy();
    });

    it('constructor should throw errors if the key argument is not passed in.', function() {
      expect(function() {
        new StorageStack();
      }).to.throw(Error);

      expect(function() {
        new StorageStack('somekey');
      }).not.to.throw(Error);
    });

    it('.items() should be an array.', function() {
      var array = storage.items();

      expect(array).to.be.Array;
    });

    it('.push() should add an element to the array.', function() {
      storage.push(1);

      var array = storage.items();

      assert.equal(array.length, 1);

      assert.equal(array[0], 1);

      storage.push(function() {});
    });
  });
});
