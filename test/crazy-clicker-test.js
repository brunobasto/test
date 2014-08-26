'use strict';

define(['src/crazy-clicker'], function(CrazyClicker) {
  describe("CrazyClicker", function() {
    var clicker;

    beforeEach(function() {
      clicker = new CrazyClicker();
    });

    afterEach(function() {

    });

    it('should fail', function() {
      expect(true).to.be.false;
    });
  });
});
