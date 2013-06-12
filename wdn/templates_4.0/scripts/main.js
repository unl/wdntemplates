var _gaq = _gaq || [];

require.config({
	"baseUrl": window.WDN.getTemplateFilePath('scripts', true),
    "shim": {
        "wdn_ajax": ["jquery"],
    }
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
