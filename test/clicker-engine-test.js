'use strict';

define(['src/clicker-engine'], function(ClickerEngine) {
  describe("ClickerEngine", function() {
    var clicker;

    beforeEach(function() {
      clicker = new ClickerEngine();
    });

    afterEach(function() {

    });

    it('should fail', function() {
      expect(true).to.be.false;
    });
  });
});
