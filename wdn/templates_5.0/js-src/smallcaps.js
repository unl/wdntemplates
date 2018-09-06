define([
	'jquery',
	'css!js-css/smallcaps'
], function($, WDN, require) {
    var initd = false;

    return {
        initialize: function() {
            // protect against multiple initializations
            if (initd) {
                return;
            }
            initd = true;

            // Load Mercury ScreenSmart Small Caps fonts from Cloud.typography
            var $smallCaps = $('<link>', {
                'rel' : 'stylesheet',
                'href' : 'https://cloud.typography.com/7717652/679648/css/fonts.css'
            });

            $('head').append($smallCaps);
        }
    };
});
