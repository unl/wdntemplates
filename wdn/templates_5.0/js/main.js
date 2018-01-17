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
	//The following plugins initialize on their own and do not need to be passed to the callback
	'plugins/skipto/skipto.min.js'
], function(WDN, require) {

});