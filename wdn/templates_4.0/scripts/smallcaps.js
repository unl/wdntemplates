define(['jquery', 'wdn', 'require'], function($, WDN, require) {

    var initd = false;

    return {
        initialize: function() {
            // protect against multiple initializations
            if (initd) {
                return;
            }
            initd = true;
    
            // Load Mercury ScreenSmart Small Caps fonts from Cloud.typography
            var $smcaps = $("<link>", {
                "rel" : "stylesheet",
                "type" : "text/css",
                "href" : "//cloud.typography.com/7717652/679648/css/fonts.css"
            });
        
            $('head').append($smcaps);
        
            // Load WDN small caps styles
            WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/smallcaps.css'));
        }
    };
});
