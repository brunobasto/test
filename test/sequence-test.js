'use strict';

define(['action', 'sequence', 'node-util'], function(Action, Sequence, NodeUtil) {
  describe("Sequence", function() {
    var divElement, h1Element;

    beforeEach(function() {
      document.body.innerHTML = '';

      divElement = document.createElement('div');
      document.body.appendChild(divElement);

      h1Element = document.createElement('h1');
      document.body.appendChild(h1Element);
    });

    afterEach(function() {

    });

    it('constructor should throw errors if required configs are missing.', function() {
      expect(function() {
        new Sequence();
      }).to.throw(Error);

      expect(function() {
        new Sequence({
          name: 'my-sequence'
        });
      }).not.to.throw(Error);
    });

    it('.isEligible() should return true if given element matches context or trigger.', function() {
      var sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'div'
      });

      assert.equal(sequence.isEligible(divElement), false, 'sequences without actions are always ineligible');

      sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'div',
        actions: [{}]
      });

      assert.equal(sequence.isEligible(divElement), true, 'sequences with trigger in DOM are eligible');

      sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'span',
        actions: [{}]
      });

      assert.equal(sequence.isEligible(divElement), false, 'sequences with trigger not in DOM are ineligible');

      sequence = new Sequence({
        name: 'my-sequence',
        actions: [{}]
      });

      assert.equal(sequence.isEligible(divElement), false, 'sequences without trigger are ineligible');

      sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'div',
        actions: [{}]
      });

      assert.equal(sequence.isEligible(h1Element), false, 'sequences with trigger in DOM but different than the needle are ineligible');
    });

    it('.setActions() should instantiate actions and set the .sequence attribute.', function() {
      var sequence = new Sequence({
        name: 'my-sequence',
        actions: [
          {
              selector: 'ul li',
              context: '#parent',
              event: 'click'
          }
        ]
      });

      var actions = sequence.getActions();

      _.each(actions, function(action) {
        assert.instanceOf(action, Action);

        assert.equal(action.sequence, sequence);
      });
    });

    it('.start() should start sequence.', function() {
      var sequence = new Sequence({
        name: 'my-sequence',
        actions: [{}]
      });

      sequence.start();
      assert.equal(sequence.isActive(), true, 'after .start() sequence should be active');
    });

    it('.stop() should stop sequence.', function() {
      var sequence = new Sequence({
        name: 'my-sequence',
        actions: [{}]
      });

      sequence.start();
      sequence.stop();
      assert.equal(sequence.isActive(), false, 'after .stop() sequence should be inactive');
    });

    it('.getTriggerNode() should parse special values.', function() {
      var sequence = new Sequence({
        name: 'my-sequence',
        trigger: '#random',
        actions: [{}]
      });

      assert.equal(NodeUtil.isNode(sequence.getTriggerNode()), true, '#random trigger should return a node');

      sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'div',
        actions: [{}]
      });

      assert.equal(NodeUtil.isNode(sequence.getTriggerNode()), true, 'trigger in DOM should return a node');

      sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'xyz',
        actions: [{}]
      });

      assert.equal(sequence.getTriggerNode(), null, 'trigger in not DOM should not return null');
    });

    it('.next() should run actions when called and increase currentIndex untill it reached the end.', function() {
      var sequence = new Sequence({
        name: 'my-sequence',
        actions: [
          {
              selector: 'body',
              context: '#parent',
              event: 'click'
          },
          {
              selector: 'body',
              context: '#parent',
              event: 'click'
          },
          {
              selector: 'body',
              context: '#parent',
              event: 'click'
          }
        ]
      });

      assert.equal(sequence.isActive(), false, 'the sequence is iniatially inactive');

      expect(function() {
        sequence.next();
      }).to.throw(Error);

      sequence.start();

      expect(function() {
        // Run all actions of the sequence.
        sequence.next();
        sequence.next();
        sequence.next();
      }).not.to.throw(Error);

      assert.equal(sequence.isActive(), false, 'after a full cycle the sequence should not be active');
    });
  });
});
