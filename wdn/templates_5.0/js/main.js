// WDN must be loaded synchronously for BC and config support
requirejs.config({
	baseUrl: WDN.getTemplateFilePath('scripts', true),
	map: {
		"*": {
			css: 'require-css/css'
		}
	}
});
