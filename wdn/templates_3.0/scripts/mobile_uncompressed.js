/**
 * This file contains the WDN template javascript code.
 */
var _gaq = _gaq || [];
var WDN = function() {
	var loadingJS = {};
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
		 * @param {string} url
		 * @param {function} callback (optional) - will be called once the JS file has been loaded
		 * @param {boolean} checkLoaded (optional) - if false, the JS will be loaded without checking whether it's already been loaded
		 * @param {boolean} callbackIfLoaded (optional) - if false, the callback will not be executed if the JS has already been loaded
		 */
		
		loadJS : function(url,callback,checkLoaded,callbackIfLoaded) {
			if (url.match(/^\/?wdn\/templates_3\.0/)) {
				// trim off the leading slash
				if (url.charAt(0) == '/') {
					url = url.substring(1);
				}
				url = WDN.template_path+url;
			}
			
			if ((arguments.length>2 && checkLoaded === false) || !WDN.loadedJS[url]){
				if (url in loadingJS) {
					if (callback) {
						loadingJS[url].push(callback);
					}
					return;
				}
				loadingJS[url] = [];
				//debug statement removed
				var e = document.createElement("script");
				e.setAttribute('src', url);
				e.setAttribute('type','text/javascript');
				document.getElementsByTagName('head').item(0).appendChild(e);
				
				if (callback) {
					loadingJS[url].push(callback);
				}
				var executeCallback = function() {
					WDN.loadedJS[url] = 1;
					//debug statement removed
					for (var i = 0; i < loadingJS[url].length; i++) {
						loadingJS[url][i]();
					}
					delete loadingJS[url];
				};
				
				e.onreadystatechange = function() {
					if (e.readyState == "loaded" || e.readyState == "complete"){
						executeCallback();
					}
				};
				e.onload = executeCallback;
				
			} else {
				//debug statement removed
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
			//WDN.loadJS('wdn/templates_3.0/scripts/jquery.js', WDN.jQueryUsage);
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
				WDN.initializePlugin('analytics');
				if (WDN.jQuery('body').hasClass('mobile')) {
					return;
				}
				WDN.initializePlugin('navigation');
				WDN.initializePlugin('search');
				WDN.initializePlugin('feedback');
				WDN.initializePlugin('socialmediashare');
				WDN.contentAdjustments();
				WDN.initializePlugin('tooltip');
				WDN.initializePlugin('toolbar');
				WDN.initializePlugin('tabs');
				WDN.initializePlugin('unlalert');
				//WDN.initializePlugin('idm');
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
				WDN.jQuery('body').css({'background':'#e0e0e0'});
				WDN.jQuery('#wdn_wrapper').css({'border-left-width':'0','border-right-width':'0'});
				if (WDN.jQuery.browser.msie) {
					WDN.jQuery('#wdn_wrapper').css({'margin':'0 0 0 5px'});
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
				//set the caption to the same width as the image it goes with so that a long caption doesn't spill over
				WDN.jQuery(this).width(WDN.jQuery(this).prev('img').width()); 
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
						//debug statement removed
						WDN[plugin].initialize();
					} else {
						//debug statement removed
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
				//debug statement removed
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
			//debug statement removed
			var $ = WDN.jQuery;
			// set the method if none/an invalid one was given
			if (!method || !/^(get|post)$/i.test(method)) {
				var method = "get";
				//debug statement removed
			}
			// normalize the method name
			method = method.toLowerCase();
			// first, try using jQuery.get or jQuery.post
			try {
				//debug statement removed
				$[method](url,data,callback,type);
				// Opera fails silently, so force it to throw an error and revert to the proxy
				// TODO: this should probably only be done if making a cross domain request.
				if (window.opera && Object.toString(window.opera.version).indexOf("[native code]") > 0) {
					//debug statement removed
					throw ("Opera");
				}
				//debug statement removed
			} catch (e) {
				//debug statement removed
				
				// the jQuery method failed, likely because of the same origin policy
				
				// if data is an object, convert it to a key=value string
				if (data && $.isPlainObject(data)) {
					//debug statement removed
					var params = '';
					for (var key in data) {
					    params = params+'&'+key+'='+data[key];
					}
				}
				
				// if using get, append the data as a querystring to the url
				if (params && method == "get") {
					//debug statement removed
					if (!/\?/.test(url)) {
						url += "?";
					}
					url += params.substr(1, params.length);
					params = null;
				}
				
				// Try CORS, or use the proxy
				// reference here, it's strongly frowned upon and not really necessary
				if (window.XDomainRequest) {
					//debug statement removed
					var xdr = new XDomainRequest();
					xdr.open(method, url);
					xdr.onload = function () {
						//debug statement removed
						var responseText = this.responseText, dataType = (type || "").toLowerCase();
						// if we are expecting and XML object and get a string, convert it
						if (typeof responseText == "string" && dataType == "xml") {
							//debug statement removed
							responseText = WDN.stringToXML(responseText);
						}
						callback(responseText, "success", this);
					};
					xdr.send(params);
				} else {
					try {
						//debug statement removed
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
						//debug statement removed
						//debug statement removed
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

WDN.template_path = "/";
WDN.loadedJS["/wdn/templates_3.0/scripts/wdn.js"]=1;
// What should be tracked in Google Analytics
// 
// 1. File downloads: .pdf, .doc., etc... put in the /downloads directory DONE
// 2. Social media share uses: track the clicks. Use event tracking DONE
// 3. External links: track links to outside the domain? put in /external directory DONE
// 4. Video usage tracking by default. Should be incorporated with the skin/video JS file
// 5. Navigation preferences. Which view is being used? Use event tracking DONE
// 6. Usage of the wdn_tools. Use event tracking DONE
// 7. Tab content. Use event tracking? Set up a way for departments to take advantage of this tracking?
// 
// WDN.analytics.callTrackEvent(category, action, optional_label, optional_value)
// WDN.analytics.callTrackPageview('/downloads/'+href);
//
// Department variable 'pageTracker' is available to use in this file.

WDN.analytics = function() { 
	return {
		thisURL : String(window.location), //the current page the user is on.
		rated : false, // whether the user has rated the current page.
		initialize : function() {

			_gaq.push(
				['_setAccount', 'UA-3203435-1'],
				['_setDomainName', '.unl.edu'],
				['_setAllowLinker', true],
				['_setAllowHash', false]
			);
			//debug statement removed
			
			WDN.loadJS('wdn/templates_3.0/scripts/idm.js', function(){
				WDN.idm.initialize(function() {
					WDN.analytics.loadGA();
				});
			});
			
			//debug statement removed
				filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v)$/i; //these are the file extensions to track for downloaded content
				WDN.jQuery('#navigation a[href], #maincontent a[href]').each(function(){  
					var gahref = WDN.jQuery(this).attr('href');
					if ((gahref.match(/^https?\:/i)) && (!gahref.match(document.domain))){  //deal with the outbound links
						//WDN.jQuery(this).addClass('external'); //Implications for doing this?
						WDN.jQuery(this).click(function() {
							WDN.analytics.callTrackEvent('Outgoing Link', gahref, WDN.analytics.thisURL);
						});
					}  
					else if (gahref.match(/^mailto\:/i)){  //deal with mailto: links
						WDN.jQuery(this).click(function() {  
							var mailLink = gahref.replace(/^mailto\:/i, '');  
							WDN.analytics.callTrackEvent('Email', mailLink, WDN.analytics.thisURL);
						});  
					}  
					else if (gahref.match(filetypes)){  //deal with file downloads
						WDN.jQuery(this).click(function() { 
							var extension = (/[.]/.exec(gahref)) ? /[^.]+$/.exec(gahref) : undefined;
							WDN.analytics.callTrackEvent('File Download', gahref, WDN.analytics.thisURL); 
							WDN.analytics.callTrackPageview(gahref);
						});  
					}  
				}); 
				WDN.jQuery('ul.socialmedia a').click(function(){ 
					var socialMedia = WDN.jQuery(this).attr('id');
					WDN.analytics.callTrackEvent('Page Sharing', socialMedia, WDN.analytics.thisURL);
				});
				WDN.jQuery('#wdn_tool_links a').click(function(){ 
					var wdnToolLinks = WDN.jQuery(this).text();
					WDN.analytics.callTrackEvent('WDN Tool Links', wdnToolLinks, WDN.analytics.thisURL);
				});
				WDN.jQuery('div.rating div.star a').click(function(){ 
					if (!WDN.analytics.rated)
					{
						WDN.analytics.rated = true;
						var value = WDN.jQuery(this).text();
						WDN.analytics.callTrackEvent('Page Rating', 'Rated a '+value, WDN.analytics.thisURL, value);
					}
				});
		},
		
		loadGA : function(){
			_gaq.push(['_trackPageview']);
			//debug statement removed
			
			(function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		},
		
		trackNavigationPreferredState : function(preferredState) {
			try {
				WDN.analytics.callTrackEvent('Navigation Preference', preferredState, WDN.analytics.thisURL);
			} catch(e){}
		},
		callTrackPageview: function(thePage){
			//debug statement removed
			if (!thePage) {
				_gaq.push(['_trackPageview']);
				//debug statement removed
				return;
			}
			_gaq.push(['_trackPageview', thePage]); //First, track in the wdn analytics
			//debug statement removed
			try {
				pageTracker._trackPageview(thePage); // Second, track in local site analytics 
				//debug statement removed
			} catch(e) {
				//debug statement removed 
			}
		},
		callTrackEvent: function(category, action, label, value) {
			if (value === undefined) {
				value = 0;
			}
			//var wdnSuccess = wdnTracker._trackEvent(category, action, label, value);
			_gaq.push(['_trackEvent', category, action, label, value]);
			try { 
				var pageSuccess = pageTracker._trackEvent(category, action, label, value);
				//debug statement removed
			} catch(e) {
				//debug statement removed
			}
		}
	};
}();

WDN.loadedJS["/wdn/templates_3.0/scripts/analytics.js"]=1;
WDN.loadedJS["/wdn/templates_3.0/scripts/xmlhttp.js"]=1;
WDN.loadedJS["/wdn/templates_3.0/scripts/global_functions.js"]=1;

WDN.initializeTemplate();