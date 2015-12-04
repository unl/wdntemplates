define([
	'jquery',
	'plugins/rsswidget/jquery.vticker',
	'plugins/rsswidget/jquery.zrssfeed',
	'css!js-css/rsswidget'
], function($) {
	var initd = false;

    var Plugin = {
		defaultConfig : {
		    url: 'http://newsroom.unl.edu/inthenews/?format=xml',
		    elementId : 'wdn_rss_widget',
		    pause: 5000,
		    width: 'auto',
		    height: 'auto',
		    limit: 10,
		    num_show: 3
        },

		initialize : function(userConfig) {
			var configs = [], i;

		    if (!userConfig || !arguments.length) {
				configs.push(Plugin.defaultConfig);
		    } else {
				var config;
				for (i = 0; i < arguments.length; i++) {
				    userConfig = arguments[i];
				      //allow them to pass a string (url) or an object
				    if ( (typeof userConfig) === 'string' ) {
						config = $.extend({}, Plugin.defaultConfig);
						config.url = userConfig;
						configs.push(config);
				    } else {
						config = $.extend({}, Plugin.defaultConfig, userConfig);
						configs.push(config);
				    }
				}
		    }

		    $(function() {
		    	Plugin.setup(configs);
		    });
		},

		setup : function(configs) {
			$.each(configs, function(i, config) {
				var jqElem = $('#'+config.elementId);

				if (!jqElem.length) {
					return;
				}

				jqElem.rssfeed(config.url,{
			        titletag: 'div',
			        limit: config.limit,
			    }, function(e) {
			        $(e).find('div.rssBody').vTicker({ showItems: config.num_show, pause: config.pause });
			    });
			});
		}
    };

    return Plugin;
});
