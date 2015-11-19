/*jslint evil: true */
(function(){

var syncLoad = {
	"modernizr-wdn.js" : "",
	"ga.js" : "",
	"require.js" : "",
	"wdn.js" : "",
};

var _wdn_scripts_url = '',
	scripts = document.getElementsByTagName('script'),
	debugScript,
	i = 0, l = scripts.length;

for (; i < l; i++) {
	var src = '' + scripts[i].src,
		pos = src.indexOf('/debug.js');
	if (pos > -1) {
		debugScript = scripts[i];
		_wdn_scripts_url = src.substring(0, pos + 1);
		break;
	}
}

syncLoad['require.js'] = { "data-main" : _wdn_scripts_url + 'main.js' };
syncLoad['wdn.js'] = { "data-wdn_root" : _wdn_scripts_url };

for (i in syncLoad) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = _wdn_scripts_url + i;

	for (var j in syncLoad[i]) {
		script.setAttribute(j, syncLoad[i][j]);
	}

	// document.write to ensure execution order of syncronous scripts (EVIL!)
	document.write(script.outerHTML);
}

})();
