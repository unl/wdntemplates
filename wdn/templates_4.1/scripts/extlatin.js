define([
	'jquery',
	'css!js-css/extlatin'
], function($, WDN, require) {
    var initd = false;

    return {
        initialize: function() {
            // protect against multiple initializations
            if (initd) {
                return;
            }
            initd = true;

            // Load Mercury ScreenSmart Extended Latin fonts from Cloud.typography
            var $extLatin = $('<link>', {
                'rel' : 'stylesheet',
                'href' : 'https://cloud.typography.com/7717652/719648/css/fonts.css'
            });

            $('head').append($extLatin);
        }
    };
});
