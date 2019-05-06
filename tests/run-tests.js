/**
 * A simple test script
 *
 * Right now it does the following:
 * 1. Starts an http server on port 8080, with the repo root as the document root
 * 2. convert the debug.shtml file into debug.compiled.html (replace apache style includes) because the http server can't do this.
 * 3. use headless chrome to inject axe-core and run accessibility tests
 * 4. send the compiled html to the w3c validator
 * 4. if there are no errors, exit with a status of 0
 * 5. if there are errors, exit with tha status of 1 and show the errors
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const { spawn, execSync } = require('child_process');
const http = require('http');

//start http server
console.log('Starting HTTP server');
let httpServer = spawn(__dirname + '/../node_modules/http-server/bin/http-server', [__dirname + '/../']);

httpServer.stdout.on('data', (data) => {
	if (data.includes('Available on')) {
		//http server has started, so run the tests
		console.log('http server is started. Running tests...');
		runTests();
	}
});

httpServer.stderr.on('data', (data) => {
	console.log(`http server stderr: ${data}`);
});

httpServer.on('close', (code) => {
	console.log(`http server exited with code ${code}`);
});

let filterWC3Errors = function(wc3_results) {
  let results = [];
  wc3_results.forEach(function(error) {
    if (error.message === 'Attribute “loading” not allowed on element “img” at this point.') {
      return; // Skip this error
    }
    results.push(error);
  });
  return results;
}

let runTests = function() {
	//Parse the debug.shtml file and replace apache style includes
	let contents = fs.readFileSync('debug.shtml', 'utf8');

	let newContents = contents.replace(/(<!--#include virtual="(.*)" -->)/g, function (match, p1, p2) {
		return fs.readFileSync(__dirname + '/../' + p2, 'utf8');
	});

	fs.writeFileSync('debug.compiled.html', newContents, { encoding : 'utf8'});

	let all_results = {
		'axe': [],
		'w3c': []
	};

	//Run tests
	(async () => {
		//start with browser tests (axe)
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto('http://localhost:8080/debug.compiled.html');
		await page.addScriptTag({
			path: __dirname + '/../node_modules/axe-core/axe.min.js'
		});
		let results = await page.evaluate(() => {return axe.run()});

		//Close open programs
		await browser.close();
		await httpServer.kill();

		all_results.axe = results.violations;

		//now do w3c tests (html validation)
		let result = execSync('curl -s -H "Content-Type: text/html; charset=utf-8" ' +
			'    --data-binary @debug.compiled.html ' +
			'    https://validator.w3.org/nu/?out=json');

		result = JSON.parse(result);
		all_results.w3c = filterWC3Errors(result.messages.filter(message => message.type === 'error'));

		//Handle the results
		if (all_results.axe.length > 0 || all_results.w3c.length > 0) {
			console.log('found errors!');
			//pretty print the violations
			console.log(JSON.stringify(all_results, null, 2));
			process.exit(1);
		} else {
			//success
			console.log('All tests passed');
			process.exit(0);
		}
	})();
};
