define(['wdn', 'require', 'jquery'], function(WDN, require, $) {
	return {
		initialize: function(callback) {
			WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/formvalidator.css', true, true));
			require(['plugins/validator/jquery.validator'], function() {
				$(callback);
			});
		}
	};
});
