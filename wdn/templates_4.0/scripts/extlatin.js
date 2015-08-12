define(['jquery', 'wdn', 'require'], function($, WDN, require) {

    var initd = false;

    return {
        initialize: function() {
            // protect against multiple initializations
            if (initd) {
                return;
            }
            initd = true;
    
            // Load Mercury ScreenSmart Extended Latin fonts from Cloud.typography
            var $extlatin = $("<link>", {
                "rel" : "stylesheet",
                "type" : "text/css",
                "href" : "//cloud.typography.com/7717652/719648/css/fonts.css"
            });
        
            $('head').append($extlatin);
        
            // Load WDN small caps styles
            WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/extlatin.css'));
        }
    };
});
