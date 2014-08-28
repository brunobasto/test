'use strict';

define(['engine', 'sequence', 'event-util'], function(Engine, Sequence, EventUtil) {
  describe("Engine", function() {
    var engine, testInterval = 500;

    var clearRegistry = function() {
      Engine.registry.each(function(sequence) {
        sequence.next.restore();

        Engine.registry.unregister(sequence.name);
      });
    };

    var fillRegistry = function() {
      Engine.registry.register(
        {
          name: 'a-sequence',
          context: 'html > body',
          trigger: '#any',
          actions: [{
            selector: 'body',
            event: 'click'
          }]
        }
      );

      Engine.registry.register(
        {
          name: 'b-sequence',
          context: 'html > body',
          trigger: '#any',
          actions: [{
            selector: 'body',
            event: 'click'
          }]
        }
      );

      Engine.registry.each(function(sequence) {
        sinon.spy(sequence, 'next');
      });
    };

    beforeEach(function() {
      fillRegistry();

      sinon.spy(Engine.prototype, '_bindEvents')

      engine = new Engine({
        interval: testInterval
      });
    });

    afterEach(function() {
      Engine.prototype._bindEvents.restore();

      clearRegistry();

      engine.stop();
    });

    it('constructor should instantiate registry, storage and call _bindEvents', function() {
      assert.equal(engine.currentElement, null, '.currentElement initial value should be null');

      assert.notEqual(engine.storage, undefined);

      assert(engine._bindEvents.calledOnce, '_bindEvents should only be called once');
    });

    it('.computeNextElement() should set the .currentElement attribute value.', function() {
      engine.computeNextElement();

      assert.notEqual(engine.currentElement, undefined);

      assert.notEqual(engine.currentElement, null);
    });

    it('.getActiveSequence() should be different than null if there is an active sequence and null otherwise.', function() {
      assert.equal(engine.getActiveSequence(), null);

      var sequence = new Sequence({
        name: 'Test Engine.getActiveSequence()'
      });

      engine.startSequence(sequence);

      assert.notEqual(engine.getActiveSequence(), null);

      engine.stopSequence(sequence);
    });

    it('.getEligibleSequences() should return an array of sequences that are eligible for running.', function() {
      var element = engine.computeNextElement();

      var sequence = Engine.registry.get('a-sequence');

      engine.startSequence(sequence);

      assert.equal(engine.getEligibleSequences(element).length, 0, 'when a sequence is active no other sequence is eligible');

      engine.stopSequence(sequence);

      // since we have two eligible sequences, it should return at least one
      expect(engine.getEligibleSequences(element).length).to.be.at.least(1);
    });

    it('.run() should look for eligible sequences and run it or run default action', function() {
      var element = engine.computeNextElement();

      engine.run();

      var hasRun = false

      Engine.registry.each(function(sequence) {
        if (sequence.next.calledOnce) {
          hasRun = true;
        }
      });

      assert.equal(hasRun, true, 'one of the eligible sequences should have been called');

      var sequence = Engine.registry.get('a-sequence');

      engine.startSequence(sequence);

      engine.run();

      engine.stopSequence(sequence);

      assert(sequence.next.called, 'active sequence.next should be called at least once');

      clearRegistry();

      sinon.spy(EventUtil, 'simulate');

      engine.run();

      assert(EventUtil.simulate.calledOnce, 'when there is no active or eligible sequences, run default action');

      EventUtil.simulate.restore();
    });

    it('.start() should create thread and run accordingly to config.interval', function(done) {
      sinon.spy(engine, 'computeNextElement');
      sinon.spy(engine, 'run');

      engine.start();

      setTimeout(function() {
        assert(engine.computeNextElement.calledOnce, '.start() should call .computeNextElement()');
        assert(engine.run.calledOnce, '.start() should call .run()');

        engine.computeNextElement.restore();
        engine.run.restore();

        done();
      }, testInterval);
    });
  });
});
