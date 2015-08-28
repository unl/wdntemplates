define(['wdn', 'require'], function(WDN, require) {
	var pluginPath = 'plugins/ui/';
	
	return {
		initialize: function(callback) {
			var min = '', body = document.getElementsByTagName('body');
			if (!body.length || !body[0].className.match(/(^|\s)debug(\s|$)/)) {
				min = '.min';
			}
			
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/' + pluginPath + 'css/jquery-ui' + min + '.css', true, true));
			WDN.loadJQuery(function() {
				require(['./' + pluginPath + 'jquery-ui' + min], callback);
			});
		}
	};
});
