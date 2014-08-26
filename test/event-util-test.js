'use strict';

define(['src/event-util'], function(EventUtil) {
  describe('EventUtil', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('.simulate() should fire the event.', function() {
      document.body.innerHTML = '<div><div><div id="me"></div></div></div>';

      var node = document.querySelector('#me');

      EventUtil.simulate(node, 'click');

      expect(path).to.be.String;
    });
  });
});
