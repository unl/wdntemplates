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
			WDN.loadCSS(WDN.getTemplateFilePath('css/modules/notices.css'));
			$('.wdn_notice .close').click(function() {
				$(this).closest('.wdn_notice').fadeOut("slow");
				return false;
			});
			$('.wdn_notice[class*=duration]').each(function() {
				var el = this;
				var duration = 1000;
				var dur_class = $(this).attr('class').split('duration-');
				if (dur_class.length > 1) {
					duration = dur_class[1]*1000;
				}
				setTimeout(function(){$(el).fadeOut("slow");}, duration);
			});
			$('.wdn_notice[class*=overlay-header]').each(function() {
				$('#header').append(this);
			});
			$('.wdn_notice[class*=overlay-maincontent]').each(function() {
				$('#maincontent').prepend(this);
			});
		}
	};

	return Plugin;
});

