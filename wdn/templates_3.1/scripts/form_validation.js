WDN.form_validation = (function() {
	return {
		initialize: function(callback) {
			WDN.loadCSS(WDN.getTemplateFilePath('css/content/formvalidator.css'));
			WDN.loadJQuery(function() {
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/validator/jquery.validator.min.js'), callback);
			});
		}
	};
})();
