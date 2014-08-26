'use strict';

define(['src/node-util'], function(NodeUtil) {
  describe('NodeUtil', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('.path() should return the CSS3 selector that represents the node passed in as argument.', function() {
      document.body.innerHTML = '<div><div><div id="me"></div></div></div>';

      var node = document.querySelector('#me');

      var path = NodeUtil.path(node);

      expect(path).to.be.String;

      assert.equal(path, 'html > body > div > div > div');
    });

    it('.path() should add :nth-child when the node has siblings.', function() {
      document.body.innerHTML = '<div><div><div></div><div></div><div id="me"></div></div></div>';

      var node = document.querySelector('#me');

      var path = NodeUtil.path(node);

      expect(path).to.be.String;

      assert.notEqual(path, 'html > body > div > div > div');

      assert.equal(path, 'html > body > div > div > div:nth-child(2)');
    });
  });
});
