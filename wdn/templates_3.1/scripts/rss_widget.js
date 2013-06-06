WDN.rss_widget = (function() {
    
    return {
	defaultConfig : {
	    url: 'http://ucommxsrv1.unl.edu/rssfeeds/unlinthenewsrss.xml',
	    elementId : 'wdn-rss-widget',
	    pause: 5000,
	    width: 'auto',
	    height: 'auto',
	    limit: 10,
	    num_show: 3
        },

        configs : [],

	initialize : function(userConfig) {
	    if(!userConfig || arguments.length == 0) {
		WDN.log('rsswidget using default configuration');
		WDN.rss_widget.configs.push(WDN.rss_widget.defaultConfig);
	    } else {
		for(var i=0; i<arguments.length; i++) {
		    var userConfig = arguments[i];
		      //allow them to pass a string (url) or an object
		    if( (typeof userConfig) === 'string' ) {  
			WDN.log('rsswidget using url = ' + userConfig);
			var config = {};
			WDN.jQuery.extend(config, WDN.rss_widget.defaultConfig);
			config.url = userConfig;
			WDN.rss_widget.configs.push(config);
		    } else {
			WDN.log('rsswidget using (single) custom configuration')
			var config = {};
			WDN.jQuery.extend(config, WDN.rss_widget.defaultConfig);
			WDN.jQuery.extend(config, userConfig);
			WDN.rss_widget.configs.push(config);
		    }
		}
	    }
	    WDN.loadCSS(WDN.getTemplateFilePath('css/content/rsswidget.css'));
	    WDN.loadJQuery(function() {
		WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/rsswidget/jquery.zrssfeed.mod.min.js'), WDN.rss_widget.setup);
	    });
	},
	setup : function() {

	    for(var i=0; i<WDN.rss_widget.configs.length; i++) {
		var config = WDN.rss_widget.configs[i];
		WDN.log('initializing rsswidget for ' + config.url + ' to element ' + config.elementId);
		var jqElem = WDN.jQuery('#'+config.elementId);
		if(!jqElem.length) {
		    WDN.log('rsswidget unable to setup as element with id ' + config.elementId + ' does not exist');
		} else {
		    jqElem.rssfeed(config.url,
				   { 
				       titletag: 'div', 
				       limit: config.limit, 
				   },
				   function(e) {
				       WDN.jQuery(e).find('div.rssBody').vTicker({ showItems: config.num_show, pause: config.pause });
				   });
		}
	    }
	}
    };
})();