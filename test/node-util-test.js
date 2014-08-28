'use strict';

define(['node-util'], function(NodeUtil) {
  describe('NodeUtil', function() {
    beforeEach(function() {
      document.body.innerHTML = '';
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

      assert.equal(path, 'html > body > div > div:nth-child(2)');
    });

    it('.random() should return a node in the DOM.', function() {
      var node = NodeUtil.random();

      assert.notEqual(null, node);
    });

    it('.isNode() should return true when test is a node and false otherwise', function() {
      assert.equal(false, NodeUtil.isNode(document.createTextNode('Hello')));

      assert.equal(true, NodeUtil.isNode(document.createElement('div')));
    });
  });
});
