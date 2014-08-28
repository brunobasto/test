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
        index++;

        previousSibling = previousSibling.previousSibling;
      }

      var path = [];

      do {
        path.push(node.tagName.toLowerCase());

        node = node.parentElement;
      } while (node);

      path.reverse();

      var tag = path.pop(),
          result = path.join(' > ');

      if (index > 0) {
        result += ':nth-child(' + index + ')';
      }
      else {
        result += ' > ' + tag;
      }

      return result;
    },

    random: function() {
      var elements = document.querySelectorAll('*');

      return elements[Math.floor(Math.random() * elements.length)];
    }
  };

  return NodeUtil;
});
