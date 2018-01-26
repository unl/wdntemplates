'use strict';

define(['jquery', 'wdn'], function ($, WDN) {
	$.noConflict(true);

	var jQueryWarning = false;
	Object.defineProperty(WDN, 'jQuery', {
		configurable: false,
		get: function get() {
			if (!jQueryWarning) {
				jQueryWarning = true;

				if (console && console.warn) {
					console.warn('Using jQuery via the WDN.jQuery property is deprecated. You should use require to access jQuery.');
				}
			}

			return $;
		}
	});

	return $;
});
