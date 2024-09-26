define([
	'css!js-css/font-serif'
], function(WDN, require) {
    var initd = false;

    return {
      initialize: function() {
        // protect against multiple initializations
        if (initd) {
          return;
        }
        initd = true;

      }
    };
});
