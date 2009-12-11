/**
 * This plugin is intended for use on pages containing wdn_notice
 * 
 */
WDN.notice = function() {
	return {
		initialize : function() {
			WDN.log ('notice initialized');
			WDN.loadCSS('wdn/templates_3.0/css/content/notice.css');
			WDN.jQuery('div.close a').click(function() {
				WDN.jQuery(this).parent('.close').parent('.wdn_notice').slideUp("slow");
				return false;
			});
		}
	};
}();