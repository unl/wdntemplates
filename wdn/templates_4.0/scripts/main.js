require.config({
    'baseUrl': window.WDN.getTemplateFilePath('scripts', true),
    'shim': {
    	'jquery': {
    		exports: 'jQuery',
    		init: function() {
    			window.WDN.jQuery = this.jQuery.noConflict(true);
    			return window.WDN.jQuery;
    		}
    	},
        'wdn_ajax': {
        	deps: ['jquery'],
        	exports: 'WDN.jQuery.ajaxSettings.proxyKey'
        }
    }
});

//Modernizr, WDN are loaded prior to requireJS
define('modernizr', [], function () { return window.Modernizr; });

define(['wdn', 'require', 'legacy',
        // these are the WDN plugins that are required
        'analytics',
        'analytics_scroll_depth',
        'navigation',
        'search',
        'unlalert',
        'apps',
        'images'], function(WDN, require) {
	WDN.initializePlugin('analytics');
	WDN.initializePlugin('analytics_scroll_depth');
	WDN.initializePlugin('navigation');
	WDN.initializePlugin('search');
	WDN.initializePlugin('socialmediashare');
	WDN.initializePlugin('unlalert');
	WDN.initializePlugin('apps');
	WDN.initializePlugin('images');

    var unlchat_url = '//ucommchat.unl.edu/assets/js';

    //#UNLCHAT_URL

    WDN.loadJQuery(function() {
        require([unlchat_url + '?for=client&version=' + WDN.getHTMLVersion()], function(){});
    });
});
