/**
 * This file contains the WDN template javascript code.
 */
var WDN = function() {
	return {
		/**
		 * This stores what javascript files have been loaded already
		 */
		loadedJS : [],
		
		/**
		 * Call this function to load an external javascript file.
		 * Optionally, pass a callback which will be called once the file
		 * has been loaded.
		 */
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
		
		/**
		 * Set a flag indicating that a javascript file has been loaded
		 */
		jsLoaded : function(url) {
			WDN.log('WDN.jsloaded('+url+')');
			WDN.loadedJS[url] = true;
		},
		
		/**
		 * Load an external css file.
		 */
		loadCSS : function(url, callback) {
			var e = document.createElement("link");
			e.href = url;
			e.rel = "stylesheet";
			e.type="text/css";
			document.getElementsByTagName("head")[0].appendChild(e);
		},
		
		/**
		 * This function is called on page load to initialize template related
		 * data.
		 */
		initializeTemplate : function() {
			WDN.loadCSS('wdn/templates_3.0/css/script.css');
			WDN.loadJS('wdn/templates_3.0/scripts/jquery.js', WDN.jQueryUsage);
		},
		
		/**
		 * All things needed by jQuery can be put in here, and they'll get
		 * executed when jquery is loaded
		 */
		jQueryUsage : function() {
			jQuery.noConflict();
			jQuery(document).ready(function() {
				WDN.loadJS('wdn/templates_3.0/scripts/navigation.js');
				WDN.loadJS('wdn/templates_3.0/scripts/search.js');
			});
		},
		
		/**
		 * This function logs data for debugging purposes.
		 * 
		 * To see, open firebug's console.
		 */
		log: function(data) {
			try {
				console.log(data);
			} catch(e) {}
		}
	};
}();

WDN.initializeTemplate();
