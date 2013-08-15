define(['wdn', 'require'], function(WDN, require) {
	return {
		initialize: function(callback) {
			WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/formvalidator.css'));
			WDN.loadJQuery(function() {
				require(['plugins/validator/jquery.validator.min'], callback);
			});
		}
	};
});
