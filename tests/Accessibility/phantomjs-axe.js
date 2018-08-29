/*global phantom */
var args = require('system').args;
var fs = require('fs');
var page = require('webpage').create();

var PATH_TO_AXE = './axe.min.js';

if (args.length < 4) {
	console.log('phantomjs-axe accepts 1 argument, the URL to test');
    console.log('phantomjs-axe.js URL sizeX sizeY');
	phantom.exit(1);
}

page.viewportSize = { width: args[2], height: args[3] };

var url = args[1];

page.open(url, function (status) {
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

			axe.run(window.document, options, function (err, results) {
				window.callPhantom(results.violations);
			});
		});

		page.onCallback = function (msg) {
            if (msg.length > 0) {
                var filename = url.substring(url.lastIndexOf('/')+1);
                page.render(filename+'.png');
            }
			
			console.log(JSON.stringify(msg));
			
			phantom.exit();
		};
	}, 500);
});
