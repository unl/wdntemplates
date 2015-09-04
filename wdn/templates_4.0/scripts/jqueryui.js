define(['wdn', 'require', 'jquery'], function(WDN, require, $) {
	var pluginPath = 'plugins/ui/';
	
	return {
		initialize: function(callback) {
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/' + pluginPath + 'css/jquery-ui-wdn.css', true, true));
			require(['./' + pluginPath + 'jquery-ui'], function() {
				$(callback);
			});
		}
	};
});
