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
	'plugins/skipto/skipto.min.js',
	'require'
], function(WDN, require) {

});