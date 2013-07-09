var _gaq = _gaq || [];

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

define(['wdn', 'require'], function(WDN, require) {
	WDN.initializePlugin('analytics');
	WDN.initializePlugin('navigation');
	WDN.initializePlugin('search');
	WDN.initializePlugin('unlalert');
	require(['legacy'], function(){});
	
    require(['//ucommchat.unl.edu/assets/js?for=client&version=' + WDN.getHTMLVersion()], function(){});
});
