// WDN must be loaded synchronously for BC and config support
requirejs.config({
	baseUrl: WDN.getTemplateFilePath('js', true),
	map: {
		"*": {
			css: 'require-css/css'
		}
	}
});

requirejs([
	// these map to used callback parameters
	'wdn',
	'require',
	// these are bundles for framework loading and plugin initialization
	'main-wdn-plugins'
], function(WDN, require) {
    var unlchat_url = 'https://ucommchat.unl.edu/assets/js';
    //#UNLCHAT_URL
    WDN.loadJQuery(function() {
        // load chat with cache bust once a day
        var todayParts = new Date().toLocaleDateString().split('/');
        require([unlchat_url + '?for=client&version=' + WDN.getHTMLVersion() + '&cb=' + todayParts[2] + todayParts[0] + todayParts[1]], function(){});
    });

    // Process deferred inline scripts
    window.dispatchEvent(new Event('inlineJSReady'));
});
