/**
 * This plugin is intended for use on pages containing zenbox
 * 
 */
WDN.zenbox = function() {
	return {
		initialize : function() {
			WDN.log ('zenbox show hide initialized');
			WDN.loadJQuery(function() {
				WDN.jQuery('.zenbox.showHide').each(function() {
					WDN.jQuery(this).children('h3:first-child').nextAll().wrapAll('<div class="toggledContent">');
					WDN.jQuery(this).children('h3').after('<a href="#" class="showHide">show/hide this</a>');
				});
				WDN.jQuery('.zenbox a.showHide').click(function() {
					WDN.jQuery(this).siblings('.toggledContent').slideToggle(function() {
						WDN.jQuery(this).siblings('a.showHide').toggleClass('show');
						});
					return false;
				});
				WDN.jQuery('.zenbox.showHide.autoHide a.showHide').click();
			});
		}
	};
}();
