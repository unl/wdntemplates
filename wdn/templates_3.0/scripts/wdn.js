/**
 * This file contains the WDN template javascript code.
 */
var WDN = function() {
	return {
		/**
		 * This stores what javascript files have been loaded already
		 */
		loadedJS : {},
		
		/**
		 * This variable stores the path to the template files.
		 * It can be set to /, http://www.unl.edu/, or nothing.
		 */
		template_path : '',
		
		/*
		 * Loads an external JavaScript file. 
		 * 
		 * @param String url
		 * @param Function callback (optional) - will be called once the JS file has been loaded
		 * @param Bool checkLoaded (optional) - if false, the JS will be loaded without checking whether it's already been loaded
		 * @param Bool callbackIfLoaded (optional) - if false, the callback will not be executed if the JS has already been loaded
		 */
		
		loadJS : function(url,callback,checkLoaded,callbackIfLoaded) {
			if ((arguments.length>2 && checkLoaded === false) || !WDN.loadedJS[url]){
				WDN.log("begin loading JS: " + url);
				var e = document.createElement("script");
				if (url.match(/wdn\/templates_3\.0/)) {
					url = WDN.template_path+url;
				}
				e.setAttribute('src', url);
				e.setAttribute('type','text/javascript');
				document.getElementsByTagName('head').item(0).appendChild(e);
				
				callback = callback || function() {};
				var executeCallback = function() {
					WDN.loadedJS[url] = true;
					WDN.log("finished loading JS file: " + url);
					callback();
				};
				
				e.onreadystatechange = function() {
					if (e.readyState == "loaded" || e.readyState == "complete"){
						executeCallback();
					}
				};
				e.onload = executeCallback;
				
			} else {
				WDN.log("JS file already loaded: " + url);
				if ((arguments.length > 3 && callbackIfLoaded === false) || !callback){
					return;
				}
				callback();
			}
		},
		
		/**
		 * Load an external css file.
		 */
		loadCSS : function(url) {
			var e = document.createElement("link");
			e.href = WDN.template_path+url;
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
				WDN.initializePlugin('feedback');
				WDN.initializePlugin('socialmediashare');
				WDN.contentAdjustments();
				WDN.initializePlugin('tooltip');
				WDN.initializePlugin('toolbar');
				WDN.browserAdjustments();
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
		
		browserAdjustments : function() {
			if (jQuery.browser.msie && jQuery.browser.version == '6.0') {
				jQuery('body').prepend('<div id="wdn_upgrade_notice"></div>');
				fetchURLInto('http://www.unl.edu/wdn/templates_3.0/includes/browserupgrade.html', 'wdn_upgrade_notice');
				jQuery('head link[rel=stylesheet]').remove();
				jQuery('body').removeAttr('class');
				jQuery('body').addClass('document');
				WDN.loadCSS('wdn/templates_3.0/css/content/columns.css');
			}
		},
		
		contentAdjustments : function () {
			jQuery('#maincontent p.caption, #footer p.caption').each(function(i){
				if (jQuery(this).height()>20) {
					jQuery(this).css({border:'1px solid #ededed',marginleft:'0'});
				}
			});
			//remove the dotted line underneath images that are links
			jQuery('#maincontent a img, #footer a img').each(function(j){
				jQuery(this).parent('a').addClass('imagelink');
			});
		},
		
		initializePlugin:function (plugin, callback) {
			callback = callback || function() {eval('WDN.'+plugin+'.initialize();');};
			WDN.loadJS('wdn/templates_3.0/scripts/'+plugin+'.js', callback);
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
		},
		
		/**
		 * Converts a relative link to an absolute link.
		 * 
		 * @param string link The relative link
		 * @param string base_url The base to use
		 */
		toAbs: function (link, base_url) {

		  var lparts = link.split('/');
		  if (/http:|https:|ftp:/.test(lparts[0])) {
		    // already abs, return
		    return link;
		  }

		  var i, hparts = host.split('/');
		  if (hparts.length > 3) {
		    hparts.pop(); // strip trailing thingie, either scriptname or blank 
		  }

		  if (lparts[0] === '') { // like "/here/dude.png"
		    host = hparts[0] + '//' + hparts[2];
		    hparts = host.split('/'); // re-split host parts from scheme and domain only
		    delete lparts[0];
		  }

		  for(i = 0; i < lparts.length; i++) {
		    if (lparts[i] === '..') {
		      // remove the previous dir level, if exists
		      if (typeof lparts[i - 1] !== 'undefined') {
		        delete lparts[i - 1];
		      } else if (hparts.length > 3) { // at least leave scheme and domain
		        hparts.pop(); // stip one dir off the host for each /../
		      }
		      delete lparts[i];
		    }
		    if(lparts[i] === '.') {
		      delete lparts[i];
		    }
		  }

		  // remove deleted
		  var newlinkparts = [];
		  for (i = 0; i < lparts.length; i++) {
		    if (typeof lparts[i] !== 'undefined') {
		      newlinkparts[newlinkparts.length] = lparts[i];
		    }
		  }

		  return hparts.join('/') + '/' + newlinkparts.join('/');

		}

	};
}();
