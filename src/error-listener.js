(function() {
  'use strict';

  define(function(augment, Base) {
      var ErrorListener = augment(Base, function(uber) {
        this.constructor = function() {
          this.defaults = {
            handler: function() {}
          };

          uber.constructor.apply(this, arguments);

          var instance = this;

          window.addEventListener('error', function(event) {
            var configs = instance.configs,
                details = instance.details(event);

            configs.handler.apply(instance, [details]);
          });
        };

        this.details = function() {
          return {
            colno: event.colno,
            filename: event.filename,
            lineno: event.lineno,
            message: event.message,
            url: location.href
          };
        };
      });

      return ErrorListener;
    }
  );
})();