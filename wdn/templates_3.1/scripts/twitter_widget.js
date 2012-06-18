/**
 * This plugin can be used to load a twitter widget 
 * see also http://twitter.com/javascripts/widgets/widget.js
 * 
 */
WDN.twitter_widget = function() {
    return {

	initialize : function(userConfig) {
	    WDN.log ('initializing twitter_widget...');

	    var config = {
		twitterAccount : 'UNLNews',
                id : 'wdn_twitter_box',
                rpp : 5,
                width: 'auto',
                height: 'auto',
                themeColors : { color: '#000000', background: '#a7cee5'},
	    };

	    if(!userConfig) {
                WDN.log('using defaults for twitter_widget...');
	    } else if( (typeof userConfig) === 'string') {
		WDN.log('using twitterAccount = ' + userConfig + ' and defaults for twitter_widget...');
		config.twitterAccount = userConfig;
	    } else {
		WDN.log('using provided userConfig settings for twitter_widget...');
                config.twitterAccount = userConfig.twitterAccount != null ? userConfig.twitterAccount : config.twitterAccount;
		config.id = userConfig.id != null ? userConfig.id : config.id;
                config.rpp = userConfig.rpp != null ? userConfig.rpp : config.rpp;
                config.width = userConfig.width != null ? userConfig.width : config.width;
                config.height = userConfig.height != null ? userConfig.height : config.height;
	    }

	    if(!WDN.jQuery('#'+config.id).length) {
                WDN.log('unable to initialize twitter_widget as element with id = '+config.id+' does not exist');
                return;
	    } else {
		WDN.log('initializing twitter_widget on element with id = '+config.id+'...');
	    }
	    WDN.loadCSS(WDN.getTemplateFilePath('css/content/twitterbox.css'));
	    //grab theme from div's style rather than configuration
            config.themeColors.color = WDN.jQuery('#'+config.id).css('color');
            config.themeColors.background = WDN.jQuery('#'+config.id).css('background-color');
	    //but then immediately clear it out so that the twitter widget can handle styling
	    WDN.jQuery('#'+config.id).css('color', 'rgba(255,255,255,0)');
	    WDN.jQuery('#'+config.id).css('background-color', 'rgba(255,255,255,0)');

	    WDN.jQuery.getScript('http://widgets.twimg.com/j/2/widget.js', function () {
		new TWTR.Widget({
		    version: 2,
		    type: 'profile',
		    id : config.id,
		    rpp: 10,
		    interval: 30000,
		    width: config.width,
		    height: config.height,
		    theme: {
			shell: {
			    background: config.themeColors.background,
			    color: config.themeColors.color
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
		}).render().setUser(config.twitterAccount).start();});
	}
    };
}();