var _gaq = _gaq || [];

require.config({
	//"baseUrl": '/wdn/templates_4.0/scripts',
    "shim": {
        "wdn_ajax": ["jquery"],
    }
});

//Modernizr is loaded prior to requireJS
define('modernizr', [], function () { return window.Modernizr; });

define(['wdn', 'require'], function(WDN, require) {
	WDN.initializePlugin('navigation');
	WDN.initializePlugin('analytics');
//	WDN.loadJQuery(function() {
//	});
//	require(['//ucommchat.unl.edu/js/chat.php?version=' + WDN.getHTMLVersion()], function(){});
});
