var _gaq = _gaq || [];

require.config({
	//"baseUrl": '/wdn/templates_4.0/scripts',
    "shim": {
        "wdn_ajax": ["jquery"],
    }
});

//Modernizr is loaded prior to requireJS
define('modernizr', [], function () { return window.Modernizr; });

define(['wdn'], function(WDN) {
	WDN.loadJQuery(function() {
		WDN.initializePlugin('navigation');
	});
});
