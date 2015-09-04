define(['wdn', 'require', 'jquery', 'plugins/ui/jquery-ui'], function(WDN, require, $) {
	var initd = false;
	return {
		initialize: function(callback) {
			if (!initd) {
				WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/ui/css/jquery-ui-wdn.css', true, true));
				initd = true;
			}
			$(callback);
		}
	};
});
