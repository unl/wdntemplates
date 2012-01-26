/**
 * This file contains the WDN template javascript code.
 */
var _gaq = _gaq || [];
var WDN = (function() {
	var loadingJS = {},
		pluginParams = {};
	return {
		/**
		 * This stores what javascript files have been loaded already
		 */
		loadedJS: {},

		/**
		 * This variable stores the path to the template files.
		 * It can be set to /, http://www.unl.edu/, or nothing.
		 */
		template_path: '',

		/**
		 * Loads an external JavaScript file.
		 *
		 * @param {string} url
		 * @param {function} callback (optional) - will be called once the JS file has been loaded
		 * @param {boolean} checkLoaded (optional) - if false, the JS will be loaded without checking whether it's already been loaded
		 * @param {boolean} callbackIfLoaded (optional) - if false, the callback will not be executed if the JS has already been loaded
		 */
		loadJS: function (url,callback,checkLoaded,callbackIfLoaded) {
			if (url.match(/^\/?wdn\/templates_3\.0/)) {
				// trim off the leading slash
				if (url.charAt(0) == '/') {
					url = url.substring(1);
				}
				url = WDN.template_path+url;
			}

			if ((arguments.length>2 && checkLoaded === false) || !WDN.loadedJS[url]) {
				if (url in loadingJS) {
					if (callback) {
						loadingJS[url].push(callback);
					}
					return;
				}
				loadingJS[url] = [];
				WDN.log("begin loading JS: " + url);
				var e = document.createElement("script");
				e.setAttribute('src', url);
				e.setAttribute('type','text/javascript');
				document.getElementsByTagName('head').item(0).appendChild(e);

				if (callback) {
					loadingJS[url].push(callback);
				}
				var executeCallback = function () {
					WDN.loadedJS[url] = 1;
					if (loadingJS[url]) {
						WDN.log("finished loading JS file: " + url);
						for (var i = 0; i < loadingJS[url].length; i++) {
							loadingJS[url][i]();
						}
						delete loadingJS[url];
					}
				};

				e.onreadystatechange = function () {
					if (e.readyState == "loaded" || e.readyState == "complete") {
						executeCallback();
					}
				};
				e.onload = executeCallback;

			} else {
				WDN.log("JS file already loaded: " + url);
				if ((arguments.length > 3 && callbackIfLoaded === false) || !callback) {
					return;
				}
				callback();
			}
		},

		/**
		 * Load an external css file.
		 */
		loadCSS: function (url) {
			if (url.match(/^\/?wdn\/templates_3\.0/)) {
				// trim off the leading slash
				if (url.charAt(0) == '/') {
					url = url.substring(1);
				}
				url = WDN.template_path+url;
			}
			var e = document.createElement("link");
			e.href = url;
			e.rel = "stylesheet";
			e.type = "text/css";
			document.getElementsByTagName("head")[0].appendChild(e);
		},

		/**
		 * This function is called on page load to initialize template related
		 * data.
		 */
		initializeTemplate: function () {
			//gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
			//WDN.loadJS(gaJsHost + "google-analytics.com/ga.js");
			//WDN.loadCSS('wdn/templates_3.0/css/script.css');
//			WDN.loadJS('wdn/templates_3.0/scripts/xmlhttp.js');
			WDN.loadJQuery(WDN.jQueryUsage);
		},

		/**
		 * Load jQuery included with the templates as WDN.jQuery
		 *
		 * @param callback Called when the document is ready
		 */
		loadJQuery: function (callback) {
			WDN.loadJS('wdn/templates_3.0/scripts/jquery.js', function(){
				if (!WDN.jQuery) {
					WDN.jQuery = jQuery.noConflict(true);
				}
				// Load our required AJAX plugin
				WDN.loadJS('wdn/templates_3.0/scripts/wdn_ajax.js', function() {
					WDN.jQuery(document).ready(function() {
						callback();
					});
				});
			});
		},

		/**
		 * All things needed by jQuery can be put in here, and they'll get
		 * executed when jquery is loaded
		 */
		jQueryUsage: function () {
			WDN.loadJS('wdn/templates_3.0/scripts/global_functions.js');
			WDN.initializePlugin('analytics');
			if (WDN.jQuery('body').hasClass('mobile')) {
				return;
			}
			WDN.initializePlugin('mobile_detect');
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
		},

		/**
		 * This function logs data for debugging purposes.
		 *
		 * To see, open firebug's console.
		 */
		log: function (data) {
			if ("console" in window && "log" in console) {
				console.log(data);
			}
		},

		browserAdjustments: function () {
			if (WDN.jQuery.browser.msie && (WDN.jQuery.browser.version == '6.0') && (!navigator.userAgent.match(/MSIE 8.0/))) {
				var $body = WDN.jQuery('body').prepend('<div id="wdn_upgrade_notice"></div>').removeAttr('class').addClass('document');
				WDN.jQuery('#wdn_upgrade_notice').load(WDN.template_path + 'wdn/templates_3.0/includes/browserupgrade.html');
				WDN.jQuery('head link[rel=stylesheet]').each(function(i) { this.disabled = true; });
				WDN.loadCSS('wdn/templates_3.0/css/content/columns.css');
			}

			if ((navigator.userAgent.match(/applewebkit/i) && !navigator.userAgent.match(/Version\/[34]/)) ||
				(navigator.userAgent.match(/firefox/i) && (navigator.userAgent.match(/firefox\/[12]/i) || navigator.userAgent.match(/firefox\/3.[01234]/i))) ||
				(navigator.userAgent.match(/msie/i))) {
				// old browser needs help zebra striping
				WDN.jQuery('.zentable tbody tr:nth-child(odd)').addClass('rowOdd');
				WDN.jQuery('.zentable tbody tr:nth-child(even)').addClass('rowEven');
			}
		},

		screenAdjustments: function () {
			if (screen.width<=1024) {
				WDN.jQuery('body').css({'background':'#e0e0e0'});
				if (WDN.jQuery.browser.msie) {
					WDN.jQuery('#wdn_wrapper').css({'margin':'0 0 0 5px'});
				}
			}
		},

		contentAdjustments: function () {
			WDN.jQuery('#footer_floater').css("zoom", 1);
			WDN.jQuery('#maincontent p.caption, #footer p.caption').each(function(i) {
				if (WDN.jQuery(this).height()>20) {
					WDN.jQuery(this).css({border:'1px solid #DDD',marginleft:'0'});
				}
				//set the caption to the same width as the image it goes with so that a long caption doesn't spill over
				var imgWidth = WDN.jQuery(this).prev('img').width();
				if (imgWidth) {
					WDN.jQuery(this).width(imgWidth);
				}
			});
			WDN.jQuery('#titlegraphic h1 span').parent('h1').addClass('with-sub');
			//remove the dotted line underneath images that are links
			WDN.jQuery('#maincontent a img, #footer a img').each(function(j){
				WDN.jQuery(this).parent('a').addClass('imagelink');
			});
		},

		initializePlugin: function (plugin, callback) {
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
		
		setPluginParam: function (plugin, name, value) {
			if ( !pluginParams[ plugin ]) {
				pluginParams[ plugin ] = {};
			}
			pluginParams[ plugin ][ name ] = value;
		},
		
		getPluginParam: function (plugin, name) {
			if ( !pluginParams[ plugin ] ) {
				return null;
			}
			
			if (!name) {
				return pluginParams[ plugin ];
			}
			
			return pluginParams[ plugin ][ name ];
		},

		setCookie: function (name, value, seconds, path, domain) {
			var expires = "";
			if (seconds) {
				var date = new Date();
				date.setTime(date.getTime()+(seconds*1000));
				expires = ";expires="+date.toUTCString();
			}
			if (path == null) {
				path = '/';
			} else if (path.charAt(0) !== '/') {
				path = WDN.toAbs(path, window.location.pathname);
			}
			if (domain == null) {
				domain = '.unl.edu';
			}
			document.cookie = name+"="+value+expires+";path="+path+";domain="+domain;
		},

		getCookie: function (name) {
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
		 * @param {string} link The relative link
		 * @param {string} base_url The base to use
		 */
		toAbs: function (link, base_url) {
			if (typeof link == 'undefined')
				return;
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
				if (lparts[i] === '.') {
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
			return WDN.jQuery.parseXML(string);
		},

		request: function (url, data, callback, type, method) {
			var $ = WDN.jQuery;
			if ($.isFunction(data)) {
				method = method || type;
				type = callback;
				callback = data;
				data = undefined;
			}
			
			return $.ajax({
				type: method,
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
		},

		get: function (url, data, callback, type) {
			return WDN.jQuery.get(url, data, callback, type);
		},

		post: function (url, data, callback, type) {
			return WDN.jQuery.post(url, data, callback, type);
		}
	};
})();