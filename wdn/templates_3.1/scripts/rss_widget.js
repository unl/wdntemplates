WDN.rss_widget = (function() {
	
	return {
            defaultConfig : {
		url: 'http://ucommxsrv1.unl.edu/rssfeeds/unlinthenewsrss.xml',
		pause: 5000,
		width: 'auto',
		height: 'auto',
		limit: 10,
		num_show: 3
            },

            userConfig : null,

	    initialize : function(usrConfig) {
		WDN.log('initializing rss_widget');
		WDN.rss_widget.userConfig = usrConfig;
		WDN.loadCSS(WDN.getTemplateFilePath('css/content/rsswidget.css'));
		WDN.loadJQuery(function() {
		    WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/rsswidget/jquery.zrssfeed.mod.min.js'), WDN.rss_widget.setup);
		});
	    },
	    setup : function() {
		WDN.log('setting up...');

		if(WDN.rss_widget.userConfig == null) {
                    WDN.log('using defaults for rss_widget...');
		} else if( (typeof WDN.rss_widget.userConfig) === 'string') {
                    WDN.log('using url = ' + WDN.rss_widget.userConfig + ' and defaults for rss_widget...');
                    WDN.rss_widget.defaultConfig.url = WDN.rss_widget.userConfig;
		} else {
                    WDN.log('using provided userConfig settings for rss_widget...');
                    WDN.jQuery.extend(WDN.rss_widget.defaultConfig, WDN.rss_widget.userConfig);
		}

		if(!WDN.jQuery('#wdn_rss_widget').length) {
                    WDN.log('unable to initialize rss_widget as wdn_rss_widget element does not exist');
                    return;
		}


		WDN.jQuery('#wdn_rss_widget').rssfeed(WDN.rss_widget.defaultConfig.url,
						      { titletag: 'div', 
							limit: WDN.rss_widget.defaultConfig.limit, },
		     function(e) {
			 WDN.jQuery(e).find('div.rssBody').vTicker({ showItems: WDN.rss_widget.defaultConfig.num_show,
								     pause: WDN.rss_widget.defaultConfig.pause });
		     });
		}
	};
})();