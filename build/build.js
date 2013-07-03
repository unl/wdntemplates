({
	baseUrl: '../wdn/templates_4.0/scripts/',
    paths: {
	'requireLib': 'require'
    },
    shim: {
        'wdn_ajax': {
        	deps: ['jquery'],
        	exports: 'WDN.jQuery.ajaxSettings.proxyKey'
        }
    },
    optimize: 'uglify2',
    logLevel: 2,
    
    name: 'wdn',
    include: [
        'wdn_ajax',
    	'requireLib',
    	'modernizr-wdn',
    	'main',
    	'analytics',
    	'navigation',
    	'search',
    	'unlalert',
    	'legacy'
    ],
    insertRequire: ['main'],
    wdnTemplatePath: '/',
    out: '../wdn/templates_4.0/scripts/compressed/all.js',
    onBuildWrite: function (moduleName, path, contents) {
		if (moduleName === 'wdn') {
			if (this.wdnTemplatePath) {
				contents = contents.replace(/\/\/#TEMPLATE_PATH/, 'template_path="' + this.wdnTemplatePath + '";');
			}
			
			contents += 'window.WDN.jQuery = window.jQuery.noConflict(true);\n';
		}
		
		return contents.replace(/WDN\.log\([^)]*\);?/g, '');
    }
})
