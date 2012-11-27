# WDN Specific Changes for MediaElement Plugin

## Changes made to mediaelement-and-player.js

* wrap the entire thing in an anonymous function to use `WDN.jQuery`

    var mejs = mejs || {};
    (function(mejs, jQuery) {
    //code
    })(mejs, WDN.jQuery);

## Changes to CSS

* add some css for IE8 to `css/mediaelementplayer.css` and `css/mediaelementplayer.min.css`

    .ie8 .me-plugin {
         width: 100%;
    }

## Changes to Google Analytics Plugin

* use `WDN.analytics` event tracking for Google Analytics Plugin

    media.addEventListener('play', function() {
        WDN.analytics.callTrackEvent( 
    		player.options.googleAnalyticsCategory, 
    		player.options.googleAnalyticsEventPlay, 
    		(media.title === '') ? media.src : media.title
        );
    }, false);
    
* Change `googleAnalyticsCategory` value: 

    googleAnalyticsCategory: 'Media'