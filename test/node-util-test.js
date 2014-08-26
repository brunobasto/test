'use strict';

define(['src/node-util'], function(NodeUtil) {
  describe('NodeUtil', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('Test .path()', function() {
      document.body.innerHTML = '<div><div><div id="me"></div></div></div>';

      var node = document.querySelector('#me');

      var path = NodeUtil.path(node);

      expect(path).to.be.String;

      assert.equal(path, 'html > body > div > div > div');
    });

    it('Test .path() with siblings ', function() {
      document.body.innerHTML = '<div><div><div></div><div></div><div id="me"></div></div></div>';

      var node = document.querySelector('#me');

      var path = NodeUtil.path(node);

      expect(path).to.be.String;

      assert.notEqual(path, 'html > body > div > div > div');

      assert.equal(path, 'html > body > div > div > div[2]');
    });
  });
});
