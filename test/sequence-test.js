'use strict';

define(['action', 'sequence'], function(Action, Sequence) {
  describe("Sequence", function() {
    beforeEach(function() {
      document.body.innerHTML = '';
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
      var divElement = document.createElement('div');
      document.body.appendChild(divElement);

      var sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'div'
      });

      assert.equal(sequence.isEligible(divElement), true);

      sequence = new Sequence({
        name: 'my-sequence',
        trigger: 'span'
      });

      assert.equal(sequence.isEligible(divElement), false);

      sequence = new Sequence({
        name: 'my-sequence',
        context: 'div'
      });

      assert.equal(sequence.isEligible(divElement), true);

      sequence = new Sequence({
        name: 'my-sequence',
        context: 'div',
        trigger: 'span'
      });

      assert.equal(sequence.isEligible(divElement), true);

      sequence = new Sequence({
        name: 'my-sequence'
      });

      assert.equal(sequence.isEligible(divElement), false);
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
      assert.equal(sequence.getCurrentIndex(), -1, '.currentIndex initial value should be -1');

      sequence.next(); // run 0 and currentIndex = 0
      sequence.next(); // run 1 and currentIndex = 1
      sequence.next(); // run 2 and currentIndex = -1

      assert.equal(sequence.isActive(), false, 'after a full cycle the sequence should not be active');
      assert.equal(sequence.getCurrentIndex(), -1, 'after a full cycle .currentIndex should be -1 again');

      sequence.next(); // activate it again

      assert.equal(sequence.isActive(), true, 'sequence should be active');

      var actions = sequence.getActions();

      _.each(actions, function() {
        // console.log(sequence.next());
      });
    });
  });
});
