define([
	'jquery',
	'css!js-css/script-font'
], function($, WDN, require) {
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
