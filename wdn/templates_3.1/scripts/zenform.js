/**
 * This plugin is intended for use on pages containing zenforms
 * 
 */
WDN.zenform = function() {
	return {
		
		initialize : function() {
			WDN.log('zenform initialized');
			WDN.loadCSS(WDN.getTemplateFilePath('css/content/zenform.css'));
		}
	};
}();