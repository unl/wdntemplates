// This will load wdn.js synchronously, eval it right away and initialize the template js.
(function(){

var _wdn_scripts_url = "",
	scripts = document.getElementsByTagName("script"),
	load = ['modernizr-wdn.js'],
	i, l = scripts.length;

for (i = 0; i < l; i++) {
	var src = '' + scripts[i].src,
		pos = src.indexOf('/debug.js');
	if (pos > -1) {
		_wdn_scripts_url = src.substring(0, pos + 1);
		break;
	}
}

load.push('require.js" data-main="' + _wdn_scripts_url + 'main.js');

for (i = 0; i < load.length; i++) {
	document.write([
	    '<script type="text/javascript" src="',
	    _wdn_scripts_url,
	    load[i],
	    '"></script>'
	].join(''));
}

})();