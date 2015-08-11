define(['jquery', 'wdn', 'require'], function($, WDN, require) {

    // Load Mercury ScreenSmart Small Caps fonts from Cloud.typography
    var $smcaps = $("<link>", {
        "rel" : "stylesheet",
        "type" : "text/css",
        "href" : "//cloud.typography.com/7717652/679648/css/fonts.css"
    });

    $('head').append($smcaps);

    // Load WDN small caps styles
    WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/smallcaps.css'));
});
