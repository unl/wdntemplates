"use strict";

define([
  'analytics', //this also loads the IDM plugin
  'navigation',
  'search',
  'unlalert',
  'legacy',
  'hover_intent',
  'cta-nav',
  'form_validation'
], function () {
	for (var i = 0, pluginCount = arguments.length; i < pluginCount; i++) {
		var pluginObj = arguments[i];
		if (pluginObj && "initialize" in pluginObj) {
			pluginObj.initialize();
		}
	}
});
