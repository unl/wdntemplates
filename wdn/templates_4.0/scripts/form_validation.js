define(['wdn', 'require', 'jquery', 'plugins/validator/jquery.validator'], function(WDN, require, $) {
	var initd = false;
	return {
		initialize: function(callback) {
			if (!initd) {
				WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/formvalidator.css', true, true));
				initd = true;
			}
			$(callback);
		}
	};
});
