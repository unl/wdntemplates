"use strict";

define([
	'analytics', //this also loads the IDM plugin
	'navigation',
	'search',
	'unlalert',
	'legacy',
	'hover_intent',
	'cta-nav'
//'images', //TODO: do we need 'images'?
//'form_validation', //TODO: do we need to init form_validation here?
//'wdn-ui' //TODO: do we need js?
], function () {
	for (var i = 0, pluginCount = arguments.length; i < pluginCount; i++) {
		var pluginObj = arguments[i];
		if (pluginObj && "initialize" in pluginObj) {
			pluginObj.initialize();
		}
	}
});
