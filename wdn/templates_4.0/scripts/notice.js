/**
 * This plugin is intended for use on pages containing wdn_notice
 * 
 * Auto-closing notices are supported. Add a class of duration to the div,
 * with an optional time (in seconds) before closing will occur.
 * Examples
 *  class="wdn_notice duration"   // closes after 1 second
 *  class="wdn_notice duration_1" // closes after 1 second
 *  class="wdn_notice duration_5" // closes after 5 seconds
 */
WDN.notice = function() {
	return {
		initialize : function() {
			WDN.log ('notice initialized');
			WDN.loadCSS(WDN.getTemplateFilePath('css/content/notice.css'));
			WDN.jQuery('div.close a').click(function() {
				WDN.jQuery(this).parent('.close').parent('.wdn_notice').slideUp("slow");
				return false;
			});
			WDN.jQuery('.wdn_notice[class*=duration]').each(function(){
					var el = this;
					var duration = 1000;
					var dur_class = WDN.jQuery(this).attr('class').split('duration_');
					if (dur_class.length > 1) {
						duration = dur_class[1]*1000;
					}
					setTimeout(function(){WDN.jQuery(el).slideUp("slow");}, duration);
				});
		}
	};
}();