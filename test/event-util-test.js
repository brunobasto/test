'use strict';

define(['event-util'], function(EventUtil) {
  describe('EventUtil', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('.attach() should add a listener to the desired event.', function() {
      var node = document.createElement('div');

      var handler = sinon.spy();

      EventUtil.attach(node, 'click', handler);

      EventUtil.simulate(node, 'click');

      assert(handler.calledOnce, 'Handler should be called once.');
    });

    it('.simulate() should fire the desired event.', function() {
      var node = document.createElement('div');

      var handler = sinon.spy();

      EventUtil.attach(node, 'click', handler);

      EventUtil.simulate(node, 'click');

      assert(handler.calledOnce, 'Handler should be called once.');
    });

    it('.simulateTextInput() should simulate user input.', function() {
      document.body.innerHTML = '<input id="textInput" type="text" />';

      var input = document.querySelector('#textInput');

      // focus
      var focusHandler = sinon.spy();

      EventUtil.attach(input, 'focus', focusHandler);

      // keyDown
      var keyDownHandler = sinon.spy();

      EventUtil.attach(input, 'keydown', keyDownHandler);

      // keyPress
      var keyPressHandler = sinon.spy();

      EventUtil.attach(input, 'keypress', keyPressHandler);

      // keyUp
      var keyUpHandler = sinon.spy();

      EventUtil.attach(input, 'keyup', keyUpHandler);

      // textInput
      var textInputHandler = sinon.spy();

      EventUtil.attach(input, 'textInput', textInputHandler);

      // fire events
      var text = 'sometext';

      EventUtil.simulateTextInput(input, text);

      assert.equal(focusHandler.callCount, 2, 'focusHandler should be called exactly once');

      assert.equal(keyDownHandler.callCount, text.length, 'keyDownHandler should be called exactly ' + text.length + ' times');
      assert.equal(keyPressHandler.callCount, text.length, 'keyPressHandler should be called exactly ' + text.length + ' times');
      assert.equal(keyUpHandler.callCount, text.length, 'keyUpHandler should be called exactly ' + text.length + ' times');
      assert.equal(textInputHandler.callCount, text.length, 'textInputHandler should be called exactly ' + text.length + ' times');

      assert.equal(input.value, text, 'input value should be equal to ' + text);
    });
  });
});
