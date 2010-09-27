// This will load wdn.js synchronously, eval it right away and initialize the template js.
var _wdn_scripts_url = "";
var scripts = document.getElementsByTagName("script");
for (var i = 0, l = scripts.length; i < l; i++) {
	var src = '' + scripts[i].src;
	if (/debug.js/.test(src)) {
		_wdn_scripts_url = src.slice(0,src.length - 8);
	}
}

var _wdn_js;
if (window.ActiveXObject) {
	_wdn_js = new ActiveXObject("Microsoft.XMLHTTP");
} else if (window.XMLHttpRequest) {
	_wdn_js = new XMLHttpRequest();
} else {
	// do it the other way
	// the caveat to this method is that we can't be sure when WDN will be loaded
	// and it often results in a "WDN is not defined" type error.
	var e = document.createElement("script");
	e.setAttribute('src', 'wdn/templates_3.0/scripts/wdn.js');
	e.setAttribute('type','text/javascript');
	document.getElementsByTagName('head').item(0).appendChild(e);

	var callbackCalled = false;
	var executeCallback = function() {
		if (!callbackCalled) {
			WDN.initializeTemplate();
		}
	    calbackCalled = true;
	};

	e.onreadystatechange = function() {
	    if (e.readyState == "loaded" || e.readyState == "complete"){
	        executeCallback();
	    }
	};
	e.onload = executeCallback;
}

if (_wdn_js) {
	// this ensures that WDN and jQuery get loaded right away
	// this happens in all.js anyway because WDN and jQuery are both loaded
	// within that file
	_wdn_js.open("GET", _wdn_scripts_url + "wdn.js", false);
	_wdn_js.send(null);
	eval(_wdn_js.responseText);
	WDN.template_path = _wdn_scripts_url.replace("wdn/templates_3.0/scripts/","");
	eval('WDN.initializeTemplate();');
}