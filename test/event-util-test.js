'use strict';

define(['src/event-util'], function(EventUtil) {
  describe('EventUtil', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('.simulate() should fire the click event.', function() {
      var node = document.createElement('div');

      var handler = sinon.spy();

      node.addEventListener('click', handler);

      EventUtil.simulate(node, 'click');

      assert(handler.called);
    });
  });
});
