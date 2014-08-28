'use strict';

define(['event-util'], function(EventUtil) {
  describe('EventUtil', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('.simulate() should fire the click event.', function() {
      var node = document.createElement('div');

      var handler = sinon.spy();

      EventUtil.attach(node, 'click', handler);

      EventUtil.simulate(node, 'click');

      assert(handler.calledOnce, 'Handler should be called once.');
    });

    it('.attach() should add a listener to the desired event.', function() {
      var node = document.createElement('div');

      var handler = sinon.spy();

      EventUtil.attach(node, 'click', handler);

      EventUtil.simulate(node, 'click');

      assert(handler.calledOnce, 'Handler should be called once.');
    });
  });
});
