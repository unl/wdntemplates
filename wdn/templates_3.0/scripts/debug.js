// This will load wdn.js synchronously, eval it right away and initialize the template js.
(function(){

var _wdn_scripts_url = "",
	scripts = document.getElementsByTagName("script");
for (var i = 0, l = scripts.length; i < l; i++) {
	var src = '' + scripts[i].src,
		pos = src.indexOf('/debug.js');
	if (pos > -1) {
		_wdn_scripts_url = src.substring(0, pos + 1);
		break;
	}
}

var _setupTemplate = function() {
	WDN.template_path = WDN.toAbs('../../../', _wdn_scripts_url);
	WDN.initializeTemplate(true);
};

var xhr;
if (window.ActiveXObject) {
	xhr = new ActiveXObject("Microsoft.XMLHTTP");
} else if (window.XMLHttpRequest) {
	xhr = new XMLHttpRequest();
}

if (xhr) {
	xhr.open("GET", _wdn_scripts_url + "wdn.js", false);
	xhr.send(null);
	if (/\S/.test(xhr.responseText)) {
		(window.execScript || function(data) {
			window["eval"].call(window, data);
		})(xhr.responseText);
		_setupTemplate();
	}
} else {
	var _prevWDN_READY = window['WDN_READY'];
	window['WDN_READY'] = function() {
		window['WDN_READY'] = _prevWDN_READY;
		_setupTemplate();
	};
	document.write([
	    '<script type="text/javascript" src="',
	    _wdn_scripts_url,
	    'wdn.js"></script>\n',
	    '<script type="text/javascript">WDN_READY();</script>'
    ].join());
}

})();