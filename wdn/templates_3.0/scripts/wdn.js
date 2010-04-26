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
				if (url.match(/^wdn\/templates_3\.0/)) {
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
			if (url.match(/^wdn\/templates_3\.0/)) {
				url = WDN.template_path+url;
			}
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
			//gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");  
			//WDN.loadJS(gaJsHost + "google-analytics.com/ga.js");
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
			if (!WDN.jQuery) {
				WDN.jQuery = jQuery.noConflict(true);
			}
			WDN.jQuery(document).ready(function() {
				WDN.initializePlugin('navigation');
				WDN.initializePlugin('search');
				WDN.initializePlugin('feedback');
				WDN.initializePlugin('socialmediashare');
				WDN.contentAdjustments();
				WDN.initializePlugin('tooltip');
				WDN.initializePlugin('toolbar');
				WDN.initializePlugin('tabs');
				WDN.initializePlugin('unlalert');
				WDN.initializePlugin('idm');
				WDN.initializePlugin('analytics');
				WDN.browserAdjustments();
				WDN.screenAdjustments();
			});
		},
		
		/**
		 * This function logs data for debugging purposes.
		 * 
		 * To see, open firebug's console.
		 */
		log: function(data) {
			if ("console" in window && "log" in console) {
				console.log(data);
			}
		},
		
		browserAdjustments : function() {
			if (WDN.jQuery.browser.msie && (WDN.jQuery.browser.version == '6.0') && (!navigator.userAgent.match(/MSIE 8.0/))) {
				WDN.jQuery('body').prepend('<div id="wdn_upgrade_notice"></div>');
				fetchURLInto('http://www.unl.edu/wdn/templates_3.0/includes/browserupgrade.html', 'wdn_upgrade_notice');
				WDN.jQuery('head link[rel=stylesheet]').each(function(i) { this.disabled = true; });
				WDN.jQuery('body').removeAttr('class');
				WDN.jQuery('body').addClass('document');
				WDN.loadCSS('wdn/templates_3.0/css/content/columns.css');
			}
            
            if ((navigator.userAgent.match(/applewebkit/i) && !navigator.userAgent.match(/Version\/[34]/)) ||
                (navigator.userAgent.match(/firefox/i) && (navigator.userAgent.match(/firefox\/[12]/i) || navigator.userAgent.match(/firefox\/3.[01234]/i))) ||
                (navigator.userAgent.match(/msie/i))){
                // old browser needs help zebra striping
                WDN.jQuery('table.zentable tbody tr:nth-child(odd)').addClass('rowOdd');
                WDN.jQuery('table.zentable tbody tr:nth-child(even)').addClass('rowEven');
            } 
		},
		
		screenAdjustments : function() {
			if (screen.width<=1024) {
				WDN.jQuery('body').css({'background':'#e0e0e0','overflow-x':'hidden'});
				WDN.jQuery('#wdn_wrapper').css({'border-left':'0','border-right':'0','border-bottom-width':'7px'});
				if (WDN.jQuery.browser.msie && WDN.jQuery.browser.version === '7.0' ) {
					WDN.jQuery('body').css({'background':'#e0e0e0','overflow-x':'hidden','max-width':'990px'});
				} else if (WDN.jQuery.browser.mozilla) {
					WDN.jQuery('#wdn_wrapper').css({'-moz-border-radius':'0'}); 
				} else if (WDN.jQuery.browser.webkit) {
					WDN.jQuery('#wdn_wrapper').css({'-webkit-border-radius':'0'}); 
				}
			}
		},
		
		contentAdjustments : function () {
			WDN.jQuery('#maincontent p.caption, #footer p.caption').each(function(i){
				if (WDN.jQuery(this).height()>20) {
					WDN.jQuery(this).css({border:'1px solid #ededed',marginleft:'0'});
				}
			});
			//remove the dotted line underneath images that are links
			WDN.jQuery('#maincontent a img, #footer a img').each(function(j){
				WDN.jQuery(this).parent('a').addClass('imagelink');
			});
		},
		
		initializePlugin:function (plugin, callback) {
			if (!callback) {
				callback = function () {
					if ("initialize" in WDN[plugin]) {
						WDN.log("initializing plugin '" + plugin + "'");
						WDN[plugin].initialize();
					} else {
						WDN.log("no initialize method for plugin " + plugin);
					}
				};
			}
			WDN.loadJS('wdn/templates_3.0/scripts/'+plugin+'.js', callback);
		},
		
		setCookie : function(name, value, seconds) {
			var expires = "";
			if (seconds) {
				var date = new Date();
				date.setTime(date.getTime()+(seconds*1000));
				expires = ";expires="+date.toGMTString();
			}
			document.cookie = name+"="+value+expires+";path=/;domain=.unl.edu";
		},
		
		getCookie : function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1,c.length);
				}
				if (c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length,c.length);
				}
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

		  var i, hparts = base_url.split('/');
		  if (hparts.length > 3) {
		    hparts.pop(); // strip trailing thingie, either scriptname or blank 
		  }

		  if (lparts[0] === '') { // like "/here/dude.png"
		    base_url = hparts[0] + '//' + hparts[2];
		    hparts = base_url.split('/'); // re-split host parts from scheme and domain only
		    delete lparts[0];
		  }

		  for(i = 0; i < lparts.length; i++) {
		    if (lparts[i] === '..') {
		      // remove the previous dir level, if exists
		      if (typeof lparts[i - 1] !== 'undefined') {
		        delete lparts[i - 1];
		      } else if (hparts.length > 3) { // at least leave scheme and domain
		        hparts.pop(); // strip one dir off the host for each /../
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

		},
		
		stringToXML: function (string) {
			var doc;
			try {
				if (window.ActiveXObject) {
					doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML(string);
				}
				else {
					var parser = new DOMParser();
					doc = parser.parseFromString(string, 'text/xml');
				}
			}
			catch(e) {
				WDN.log('ERROR parsing XML string for conversion: ' + e);
			}
			return doc;
		},
		
		/*
		 * This function powers the functions WDN.get and WDN.post and provides cross browser
		 * support for XHRs and cross-domain requests.
		 * 
		 * @param url A string containing the URL to be requested
		 * @param data A string or object containing data/parameters to go along with the request
		 * @param callback A function to be called when the request has been completed
		 * @param [opt] type  The expected data type of the response
		 * @param method The method to perform the request with. Supported are GET and POST
		 */
		
		request: function (url, data, callback, type, method) {
			WDN.log("Using WDN.request");
			var $ = WDN.jQuery;
			// set the method if none/an invalid one was given
			if (!method || !/^(get|post)$/i.test(method)) {
				var method = "get";
				WDN.log("WDN.request: No valid method specified. Using GET.");
			}
			// normalize the method name
			method = method.toLowerCase();
			// first, try using jQuery.get or jQuery.post
			try {
				WDN.log("Using jQuery." + method + " for the request...");
				$[method](url,data,callback,type);
				// Opera fails silently, so force it to throw an error and revert to the proxy
				// TODO: this should probably only be done if making a cross domain request.
				if (window.opera && Object.toString(window.opera.version).indexOf("[native code]") > 0) {
					WDN.log("Opera detected. Raising an error to force proxy.");
					throw ("Opera");
				}
				WDN.log("jQuery." + method + " worked.");
			} catch (e) {
				WDN.log("jQuery." + method + " failed.");
				
				// the jQuery method failed, likely because of the same origin policy
				
				// if data is an object, convert it to a key=value string
				if (data && $.isPlainObject(data)) {
					WDN.log("WDN.request: Converting data object to query string.");
					var params = '';
					for (var key in data) {
					    params = params+'&'+key+'='+data[key];
					}
				}
				
				// if using get, append the data as a querystring to the url
				if (params && method == "get") {
					WDN.log("WDN.request: Appending data parameters to querystring.");
					if (!/\?/.test(url)) {
						url += "?";
					}
					url += params.substr(1, params.length);
					params = null;
				}
				
				// Try CORS, or use the proxy
				// reference here, it's strongly frowned upon and not really necessary
				if (window.XDomainRequest) {
					WDN.log("Using XDomainRequest...");
					var xdr = new XDomainRequest();
					xdr.open(method, url);
					xdr.onload = function () {
						WDN.log("XDomainRequest worked.");
						var responseText = this.responseText, dataType = (type || "").toLowerCase();
						// if we are expecting and XML object and get a string, convert it
						if (typeof responseText == "string" && dataType == "xml") {
							WDN.log("WDN.get: Converting response to XML document.");
							responseText = WDN.stringToXML(responseText);
						}
						callback(responseText, "success", this);
					};
					xdr.send(params);
				} else {
					try {
						WDN.log('Using proxy');
						var mycallback = function() {
							var textstatus = 'error';
							var data = 'error';
							if ((this.readyState == 4) && (this.status == '200')) {
								textstatus = 'success';
								data = this.responseText;
							}
							callback(data, textstatus, this);
						};
						var request = new WDN.proxy_xmlhttp();
						request.open(method.toUpperCase(), url, true);
						if (method == "post") {
							request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						}
						request.onreadystatechange = mycallback;
						request.send(params);
					} catch(f) {
						WDN.log("Could no fetch using the proxy.");
						WDN.log(f);
					}
				}
			}
			
		},
		
		get: function (url, data, callback, type) {
			WDN.request(url, data, callback, type, "GET");
		},
		
		post: function (url, data, callback, type) {
			WDN.request(url, data, callback, type, "POST");
		}
	};
}();
