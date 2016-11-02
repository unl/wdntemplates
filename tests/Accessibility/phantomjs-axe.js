/*global phantom */
var PATH_TO_AXE = '../../node_modules/axe-core/axe.min.js';

var args = require('system').args;
var fs = require('fs');
var page = require('webpage').create();

if (args.length < 2) {
	console.log('axe-phantomjs.js accepts 1 argument, the URL to test');
	phantom.exit(1);
}

page.open(args[1], function (status) {
	// Check for page load success
	if (status !== 'success') {
		console.log('Unable to access network');
		phantom.exit(1);
		return;
	}

	//Wait a bit before testing (let the page do its thing)
	window.setTimeout(function () {

		page.injectJs(PATH_TO_AXE);
		page.framesName.forEach(function (name) {
			page.switchToFrame(name);
			page.injectJs(PATH_TO_AXE);
		});
		page.switchToMainFrame();
		page.evaluateAsync(function () {
			/*global window, axe */

			var options = {
				"runOnly": {
					"type": "tag",
					"values": ["wcag2a", "wcag2aa"]
				},
				"rules": {
					"video-description": {"enabled": false},
					"video-caption": {"enabled": false} //waiting on fix for background video false positive
				}
			};

			axe.a11yCheck(window.document, options, function (results) {
				window.callPhantom(results);
			});
		});

		page.onCallback = function (msg) {
			console.log(JSON.stringify(msg));
			phantom.exit();
		};
	}, 500);
});
