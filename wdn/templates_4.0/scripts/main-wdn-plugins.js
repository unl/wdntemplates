define([
	'analytics',
	'navigation',
	'search',
	'socialmediashare',
	'unlalert',
	'images'
], function() {
	for (var i = 0, pluginCount = arguments.length; i < pluginCount; i++) {
		var pluginObj = arguments[i];
		if (pluginObj && "initialize" in pluginObj) {
			pluginObj.initialize();
		}
	}
});
