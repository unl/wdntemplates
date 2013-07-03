define(['jquery', 'wdn'], function($, WDN) {
	$(function() {
		if ($('ul.wdn_tabs').length) {
			WDN.initializePlugin('tabs');
		}
	});
});
