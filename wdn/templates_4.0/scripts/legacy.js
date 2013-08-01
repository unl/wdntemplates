define(['jquery', 'wdn'], function($, WDN) {
	var setup = function() {
		if ($('ul.wdn_tabs').length) {
			WDN.initializePlugin('tabs');
		}
	};
	$(setup);
	
	return setup;
});
