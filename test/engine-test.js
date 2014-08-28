'use strict';

define(['engine'], function(Engine) {
  describe("Engine", function() {
    var clicker;

    beforeEach(function() {
      clicker = new Engine();
    });

    afterEach(function() {

    });

    it('should fail', function() {
      expect(true).to.be.false;
    });
  });
});
