/**
 * This file contains the WDN template javascript code.
 */
var WDN = function() {
	return {
		loadedJS : [],
		loadJS : function(url, callback) {
			if (WDN.loadedJS[url] == true) {
				WDN.log('already loaded '+url);
				if (callback != null) {
					callback();
				}
			} else {
				WDN.log('attempting to load '+url);
				var e = document.createElement("script");
				e.setAttribute('src', url);
				e.setAttribute('type','text/javascript');
				var head = document.getElementsByTagName('head').item(0);
				head.insertBefore(e, head.firstChild);
				WDN.loadedJS[url] = false;
				if (callback != null) {
					mycallback = function() {WDN.jsLoaded(url);callback();};
				} else {
					mycallback = function() {WDN.jsLoaded(url);};
				}
				e.onload = mycallback;
			}
		},
		jsLoaded : function(url) {
			WDN.log('WDN.jsloaded('+url+')');
			WDN.loadedJS[url] = true;
		},
		loadCSS : function(url, callback) {
			var e = document.createElement("link");
			e.href = url;
			e.rel = "stylesheet";
			e.type="text/css";
			document.getElementsByTagName("head")[0].appendChild(e);
		},
		initializeTemplate : function() {
			WDN.loadJS('wdn/templates_3.0/scripts/jquery.js', WDN.jQueryUsage);
		},
		jQueryUsage : function() {
			jQuery.noConflict();
			jQuery(document).ready(function() {
				WDN.loadJS('wdn/templates_3.0/scripts/navigation.js');
			});
		},
		log: function(data) {
			try {
				console.log(data);
			} catch(e) {}
		}
	};
}();

WDN.initializeTemplate();
