define([
	'jquery',
	'css!js-css/display-font'
], function($, WDN, require) {
    var initd = false;

    return {
        initialize: function() {
            // protect against multiple initializations
            if (initd) {
                return;
            }
            initd = true;

            // Load Mercury Display fonts from Cloud.typography
            var $displayFont = $("<link>", {
                "rel" : "stylesheet",
                "href" : "//cloud.typography.com/7717652/7503352/css/fonts.css"
            });

            $('head').append($displayFont);
        }
    };
});
