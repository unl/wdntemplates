define(['jquery', 'wdn', 'wdn_ajax'], function($, WDN) {
	if (typeof WDN.jQuery === "undefined") {
		WDN.jQuery = $.noConflict(true);
	}
	return WDN.jQuery;
});
