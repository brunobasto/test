'use strict';

define(['action', 'sequence'], function(Action, Sequence) {
  describe("Action", function() {
    var sequence;

    beforeEach(function() {
      document.body.innerHTML = '';
    });

    afterEach(function() {

    });

    it('constructor should throw errors if required configs are missing.', function() {
      expect(function() {
        new Action();
      }).to.throw(Error);

      expect(function() {
        new Action({
          sequence: null
        });
      }).to.throw(Error);

      expect(function() {
        new Action({
          sequence: new Sequence({
            name: 'test'
          })
        });
      }).not.to.throw(Error);
    });

    it('.getElement() should throw errors if element is not found.', function() {
      var action = new Action({
        sequence: new Sequence({
          name: 'test'
        })
      });

      expect(function() {
        action.getElement();
      }).to.throw(Error);

      action = new Action({
        selector: 'body',
        sequence: new Sequence({
          name: 'test'
        })
      });

      expect(function() {
        action.getElement();
      }).not.to.throw(Error);
    });

    it('.getEvent() should throw errors if event is incorrect.', function() {
      var action = new Action({
        sequence: new Sequence({
          name: 'test'
        })
      });

      expect(function() {
        action.getEvent();
      }).to.throw(Error);

      action = new Action({
        event: 'click',
        sequence: new Sequence({
          name: 'test'
        })
      });

      expect(function() {
        action.getElement();
      }).not.to.throw(Error);
    });

    it('.getContext() should throw errors if context is incorrect.', function() {
      var action = new Action({
        sequence: new Sequence({
          name: 'test'
        })
      });

      expect(function() {
        action.getContext();
      }).to.throw(Error);

      action = new Action({
        context: 'click',
        sequence: new Sequence({
          name: 'test'
        })
      });

      expect(function() {
        action.getContext();
      }).not.to.throw(Error);
    });
  });
});
