define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var initd = false;
	
    var Plugin = {
		defaultConfig : {
		    url: 'http://ucommxsrv1.unl.edu/rssfeeds/unlinthenewsrss.xml',
		    elementId : 'wdn_rss_widget',
		    pause: 5000,
		    width: 'auto',
		    height: 'auto',
		    limit: 10,
		    num_show: 3
        },

		initialize : function(userConfig) {
			var configs = [], i;
			
		    if (!userConfig || arguments.length == 0) {
				configs.push(Plugin.defaultConfig);
		    } else {
				for (i=0; i<arguments.length; i++) {
				    userConfig = arguments[i];
				      //allow them to pass a string (url) or an object
				    if ( (typeof userConfig) === 'string' ) {  
						var config = $.extend({}, Plugin.defaultConfig);
						config.url = userConfig;
						configs.push(config);
				    } else {
						var config = $.extend({}, Plugin.defaultConfig, userConfig);
						configs.push(config);
				    }
				}
		    }
		    
		    if (!initd) {
		    	WDN.loadCSS(WDN.getTemplateFilePath('css/modules/rsswidget.css'));
		    	WDN.loadJQuery(function() {
		    		require(['plugins/rsswidget/jquery.zrssfeed.min'], function() {
		    			initd = true;
		    			Plugin.setup(configs);
		    		});
		    	});
		    } else {
		    	Plugin.setup(configs);
		    }
		},
		
		setup : function(configs) {
			var i, config, jqElem;
			
		    for (i=0; i < configs.length; i++) {
				config = configs[i];
				jqElem = $('#'+config.elementId);
				
				if (jqElem.length) {
				    jqElem.rssfeed(config.url,{ 
				        titletag: 'div', 
				        limit: config.limit, 
				    },
				    function(e) {
				        $(e).find('div.rssBody').vTicker({ showItems: config.num_show, pause: config.pause });
				    });
				}
		    }
		}
    };
    
    return Plugin;
});
