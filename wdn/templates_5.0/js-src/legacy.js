define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	"use strict";

	var setup = function() {
		if ($('ul.wdn_tabs').length) {
			WDN.initializePlugin('tabs');
		}
	};
	$(setup);

	return setup;
});
