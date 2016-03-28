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

            // Load Sanelma script font
            var $scriptFont = $("<link>", {
                "rel" : "stylesheet",
                "type" : "text/css",
                "href" : "js-css/script-font.css"
            });

            $('head').append($scriptFont);
        }
    };
});
