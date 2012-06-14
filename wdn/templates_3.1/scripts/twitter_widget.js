/**
 * This plugin can be used to load a twitter widget 
 * see also http://twitter.com/javascripts/widgets/widget.js
 * 
 */
WDN.twitter_widget = function() {
	return {

	    initialize : function(userConfig) {
		WDN.log ('initializing twitter_widget...');
		WDN.log ('passed in userConfig: ');
		WDN.log (userConfig);

		var zenMap = { 'bright'    : { color: '#000000', background: '#e5dca7'},
			       'cool'      : { color: '#000000', background: '#a7cee5'},
			       'energetic' : { color: '#000000', background: '#e5dca7'},
			       'soothing'  : { color: '#000000', background: '#6fbf4d'},
			       'primary'   : { color: '#ffffff', background: '#b70302'},
			       'neutral'   : { color: '#ffffff', background: '#3c3c3c'}
			     };

		var config = {
		    twitterAccount : 'UNLNews',
                    id : 'wdn_twitter_box',
                    rpp : 5,
                    width: 'auto',
                    height: 'auto',
                    zenboxTheme : 'cool',
                    themeColors : { color: '#000000', background: '#a7cee5'},
		};

		if(!userConfig) {
                    WDN.log('using defaults for twitter_widget...');
		} else {
                    config.twitterAccount = userConfig.twitterAccount != null ? userConfig.twitterAccount : config.twitterAccount;
		    config.id = userConfig.id != null ? userConfig.id : config.id;
                    config.rpp = userConfig.rpp != null ? userConfig.rpp : config.rpp;
                    config.width = userConfig.width != null ? userConfig.width : config.width;
                    config.height = userConfig.height != null ? userConfig.height : config.height;
                    config.zenboxTheme = userConfig.zenboxTheme != null ? userConfig.zenboxTheme : config.zenboxTheme;
		}
		config.themeColors = zenMap[config.zenboxTheme] != null ? zenMap[config.zenboxTheme] : zenMap['cool'];

		WDN.log('DEBUG: config = ');
		WDN.log(config);

		if(!WDN.jQuery('#'+config.id).length) {
                    WDN.log('unable to initialize twitter_widget as element with id = '+config.id+' does not exist');
                    return;
		} else {
		    WDN.log('initializing twitter_widget on element with id = '+config.id+'...');
		}

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