'use strict';

define(function() {
  var NodeUtil = {
    isNode: function(el) {
      return el.nodeName !== '#text';
    },

    path: function(node) {
      var index = 0;

      var previousSibling = node.previousSibling;

      while (previousSibling !== null) {
        if (NodeUtil.isNode(previousSibling)) {
          index++;
        }

        previousSibling = previousSibling.previousSibling;
      }

      var tagName = node.tagName.toLowerCase();

      if (index > 0) {
        tagName += ':nth-child(' + index + ')';
      }

      var path = [tagName];

      while (node.parentElement) {
        node = node.parentElement;

        path.push(node.tagName.toLowerCase());
      }

      path.reverse();

      return path.join(' > ');
    }
  };

  return NodeUtil;
});
