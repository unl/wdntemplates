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


define(['jquery', 'wdn'], function($, WDN) {
	var Plugin = {
		initialize : function() {
			WDN.log ('notice initialized');
			WDN.loadCSS(WDN.getTemplateFilePath('css/content/notice.css'));
			$('div.close a').click(function() {
				$(this).parent('.close').parent('.wdn_notice').slideUp("slow");
				return false;
			});
			$('.wdn_notice[class*=duration]').each(function(){
				var el = this;
				var duration = 1000;
				var dur_class = $(this).attr('class').split('duration_');
				if (dur_class.length > 1) {
					duration = dur_class[1]*1000;
				}
				setTimeout(function(){$(el).slideUp("slow");}, duration);
			});
		}
	};

	return Plugin;
});