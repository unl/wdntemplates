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
			WDN.loadJS('wdn/templates_3.0/scripts/xmlhttp.js');
			WDN.loadJS('wdn/templates_3.0/scripts/global_functions.js');
			WDN.loadJS('wdn/templates_3.0/scripts/jquery.js', WDN.jQueryUsage);			
		},
		
		/**
		 * All things needed by jQuery can be put in here, and they'll get
		 * executed when jquery is loaded
		 */
		jQueryUsage : function() {
			jQuery.noConflict();
			jQuery(document).ready(function() {
				WDN.initializePlugin('navigation');
				WDN.initializePlugin('search');
				WDN.initializePlugin('toolbar');
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
		},
		
		initializePlugin:function (plugin)
		{
			WDN.loadJS('wdn/templates_3.0/scripts/'+plugin+'.js', function() {eval('WDN.'+plugin+'.initialize();');});
		},
		
		setCookie : function(name, value, seconds) {
			if (seconds) {
				var date = new Date();
				date.setTime(date.getTime()+(seconds*1000));
				var expires = ";expires="+date.toGMTString();
			} else {
				var expires = "";
			}
			document.cookie = name+"="+value+expires+";path=/;domain=.unl.edu";
		},
		
		getCookie : function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}
	};
}();

WDN.initializeTemplate();
