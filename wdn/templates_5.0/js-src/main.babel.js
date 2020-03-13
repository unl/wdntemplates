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

    // WDN Notice Banner Display
    var bannerEnabled = true;
    if (bannerEnabled) {
	    var xhr = new XMLHttpRequest();
	    var bannerContentURL = 'http://its-unl-cms-prd-s3.s3.amazonaws.com/test2.html';
		xhr.open('GET', bannerContentURL, false);
		xhr.send(null);
		if (xhr.status === 200) {
			var xhrContent = xhr.responseText;
			if (xhrContent) {
				var banner = document.createElement('div');
				banner.setAttribute('role', 'navigation');
				banner.innerHTML = xhrContent;
				document.body.prepend(banner);
				window.scrollTo(0, 0);
			}
		}
	}

    // Process deferred inline scripts
    window.dispatchEvent(new Event('inlineJSReady'));
});
