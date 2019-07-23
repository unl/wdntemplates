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
        require([unlchat_url + '?for=client&version=' + WDN.getHTMLVersion()], function(){});
    });

		var arr = document.querySelectorAll("script[type='text/dcf']");
		for (var x = 0; x < arr.length; x++) {
			var cln = arr[x].cloneNode(true);
			cln.type = "text/javascript";
			arr[x].parentNode.insertBefore(cln, arr[x]);
			arr[x].parentNode.removeChild(arr[x]);
		}
});
