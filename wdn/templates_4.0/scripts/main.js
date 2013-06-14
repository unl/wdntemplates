var _gaq = _gaq || [];

require.config({
// 	'enforceDefine': true,
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
    },
});

//Modernizr, WDN are loaded prior to requireJS
define('modernizr', [], function () { return window.Modernizr; });
define('wdn', [], function() { return window.WDN; });

define(['wdn', 'require'], function(WDN, require) {
	WDN.initializePlugin('navigation');
	WDN.initializePlugin('analytics');
//	WDN.loadJQuery(function() {
//	});
//	require(['//ucommchat.unl.edu/js/chat.php?version=' + WDN.getHTMLVersion()], function(){});
});
