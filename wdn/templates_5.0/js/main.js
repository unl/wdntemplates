// WDN must be loaded synchronously for BC and config support
requirejs.config({
	baseUrl: WDN.getTemplateFilePath('scripts', true),
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
	//TODO: add UNLchat
});

