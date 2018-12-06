"use strict";

define([
'analytics', //this also loads the IDM plugin
'navigation', //TODO: do we need navigation js?
'search', //TODO: add search
'unlalert',
'legacy',
'hover_intent',
'form_validation' //TODO: do we need to init form_validation here?
], function () {
	for (var i = 0, pluginCount = arguments.length; i < pluginCount; i++) {
		var pluginObj = arguments[i];
		if (pluginObj && "initialize" in pluginObj) {
			pluginObj.initialize();
		}
	}
});
