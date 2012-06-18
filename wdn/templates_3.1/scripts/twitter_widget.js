/**
 * This plugin can be used to load a twitter widget 
 * see also http://twitter.com/javascripts/widgets/widget.js
 * 
 */
WDN.twitter_widget = function() {
    return {

	config : {
            twitterAccount : 'UNLNews',
            rpp : 5,
            width: 'auto',
            height: 'auto',
            themeColors : { color: '#000000', background: '#a7cee5'},
        },

	userConfig : null,

	initialize : function(usrConfig) {
	    WDN.log ('initializing twitter_widget...');
            WDN.twitter_widget.userConfig = usrConfig;
	    //chaining required as the CSS info must be loaded first
            WDN.loadCSS(WDN.getTemplateFilePath('css/content/twitterbox.css'), function() {
		WDN.loadJQuery(WDN.twitter_widget.setup);
	    });
	},

	setup : function () {

	    if(WDN.twitter_widget.userConfig == null) {
                WDN.log('using defaults for twitter_widget...');
	    } else if( (typeof WDN.twitter_widget.userConfig) === 'string') {
		WDN.log('using twitterAccount = ' + WDN.twitter_widget.userConfig + ' and defaults for twitter_widget...');
		WDN.twitter_widget.config.twitterAccount = WDN.twitter_widget.userConfig;
	    } else {
		WDN.log('using provided userConfig settings for twitter_widget...');
                WDN.twitter_widget.config.twitterAccount = WDN.twitter_widget.userConfig.twitterAccount != null ? WDN.twitter_widget.userConfig.twitterAccount : WDN.twitter_widget.config.twitterAccount;
		WDN.twitter_widget.config.rpp = WDN.twitter_widget.userConfig.rpp != null ? WDN.twitter_widget.userConfig.rpp : WDN.twitter_widget.config.rpp;
                WDN.twitter_widget.config.width = WDN.twitter_widget.userConfig.width != null ? WDN.twitter_widget.userConfig.width : WDN.twitter_widget.config.width;
                WDN.twitter_widget.config.height = WDN.twitter_widget.userConfig.height != null ? WDN.twitter_widget.userConfig.height : WDN.twitter_widget.config.height;
	    }

	    if(!WDN.jQuery('#wdn_twitter_box').length) {
                WDN.log('unable to initialize twitter_widget as wdn_twitter_box element does not exist');
                return;
	    }
	    //grab theme from div's style rather than configuration
            WDN.twitter_widget.config.themeColors.color = WDN.jQuery('#wdn_twitter_box').css('color');
            WDN.twitter_widget.config.themeColors.background = WDN.jQuery('#wdn_twitter_box').css('background-color');
	    //but then immediately clear it out so that the twitter widget can handle styling
	    WDN.jQuery('#wdn_twitter_box').css('color', 'rgba(255,255,255,0)');
            WDN.jQuery('#wdn_twitter_box').css('background-color', 'rgba(255,255,255,0)');

	    //format the widget args:
	    var widget_config = {
		version: 2,
                type: 'profile',
                id : 'wdn_twitter_box',
                rpp: WDN.twitter_widget.config.rpp,
                interval: 30000,
                width: WDN.twitter_widget.config.width,
                height: WDN.twitter_widget.config.height,
                theme: {
                    shell: {
                        background: WDN.twitter_widget.config.themeColors.background,
                        color: WDN.twitter_widget.config.themeColors.color
                    },
                    tweets: {
                        background: '#f7f7f7',
                        color: '#000000',
                        links: '#c40302'
                    }
                },
                features: {
                    scrollbar: true,
                    loop: false,
                    live: true,
                    behavior: 'all'
                }
	    };

	    WDN.jQuery.getScript('http://widgets.twimg.com/j/2/widget.js', function () {
		new TWTR.Widget(widget_config).render().setUser(WDN.twitter_widget.config.twitterAccount).start();
	    });
	}
    };
}();