/**
 * This plugin is intended for use on pages containing zenforms
 * 
 */
WDN.zenform = function() {
	return {
		
		initialize : function() {
			WDN.log('zenform initialized');
			WDN.loadCSS('/wdn/templates_3.0/css/content/zenform.css');
			if(WDN.jQuery.browser.msie) { WDN.zenform.fixIE() }
		},
		
		fixIE : function() {
			WDN.jQuery('form.zenform legend').each(function() {
				WDN.jQuery(this).wrapInner('<span class="fixIE" />');
			});
		}
	};
}();