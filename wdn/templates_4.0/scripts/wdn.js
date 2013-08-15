/**
 * This file contains the WDN template javascript code.
 */

(function(window, undefined) {
	var 
		pluginParams = {},
		loadingCSS = {},
		loadedCSS = {},
		document = window.document,
		_head = document.head || document.getElementsByTagName('head')[0],
		_docEl = document.documentElement,
		/**
		 * This variable stores the path to the template files.
		 * It can be set to /, http://www.unl.edu/, or nothing.
		 */
		template_path = '',
		
		dependent_path = 'wdn/templates_4.0/',
		
		_sanitizeTemplateUrl = function(url) {
			var reTemplateUrl = new RegExp('^/?' + dependent_path.replace('.', '\\.'));
			if (url.match(reTemplateUrl)) {
				if (url.charAt(0) === '/') {
					// trim off the leading slash
					url = url.substring(1);
				}
				
				url = template_path + url;
			}
			
			return url;
		};
		
	
	var req = function() {
		//TODO: Make this work if require is gone
		(window.require).apply(this, arguments);
	};
	
	//#TEMPLATE_PATH
	//#DEPENDENT_PATH
	
	var WDN = {
		
		getTemplateFilePath: function(file, withTemplatePath) {
			file = '' + file;
			var filePath = dependent_path + file;
			
			if (withTemplatePath) {
				filePath = template_path + filePath;
			}
			
			return filePath;
		},

		/**
		 * Loads an external JavaScript file.
		 */
		loadJS: function (url,callback) {
			url = _sanitizeTemplateUrl(url);
			req([url], callback);
		},

		/**
		 * Load an external css file.
		 */
		loadCSS: function (url, callback, checkLoaded, callbackIfLoaded) {
			url = _sanitizeTemplateUrl(url);
			
			var _getLink = function() {
					var e = document.createElement("link");
					e.href = url;
					e.rel = "stylesheet";
					e.type = "text/css";
					return e;
				},
				e = _getLink(),
				dummyObj,
				executeCallback = function() {
					dummyObj = undefined;
					
					loadedCSS[url] = true;
					if (loadingCSS[url]) {
						for (var i = 0; i < loadingCSS[url].length; i++) {
							loadingCSS[url][i]();
						}
						delete loadingCSS[url];
					}
				};
			
			if (!callback) {
				e.onload = function() {
					loadedCSS[url] = true;
				};
				_head.appendChild(e);
				
				return;
			}
			
			// Workaround for webkit and old gecko not firing onload events for <link>
			// http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
			
			if (checkLoaded === false || !(url in loadedCSS)) {
				if (url in loadingCSS) {
					loadingCSS[url].push(callback);
					return;
				}
				
				loadingCSS[url] = [callback];
				
				dummyObj = document.createElement('img');
				dummyObj.onerror = executeCallback;
				dummyObj.src = url;
				_head.appendChild(e);
			} else {
				if (callbackIfLoaded !== false) {
					callback();
				}
			}
		},

		/**
		 * Load jQuery included with the templates as WDN.jQuery
		 *
		 * @param callback Called when the document is ready
		 * @param forceDebug Should the debug jQuery be loaded
		 */
		loadJQuery: function (callback, forceDebug) {
			require(['jquery'], function($) {
				if (typeof WDN.jQuery === "undefined") {
					WDN.jQuery = $.noConflict(true);
				}
				
				require(['wdn_ajax'], function() {
					WDN.jQuery(callback);
				});
			});
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

		getHTMLVersion:function () {
			var version_html = document.body.getAttribute("data-version");
			
			// Set the defaults
			if (version_html == '$HTML_VERSION$') {
				version_html = '4.DEV';
			}
			if (!version_html) {
				version_html = '3.0';
			}
			
			return version_html;
		},

		getDepVersion:function () {
			var version_dep = document.getElementById("wdn_dependents").getAttribute("src");
			
			if (/\?dep=\$DEP_VERSION\$/.test(version_dep)) {
				version_dep = '4.0.DEV';
			} else {
				var version_match = version_dep.match(/\?dep=(\d+(?:\.\d+)*)/);
				if (version_match) {
					version_dep = version_match[1];
				} else {
					version_dep = '3.0';
				}
			}
			
			return version_dep;
		},

		/**
		 *
		 * @param {string} plugin - The plugin name (must get registerd in WDN namespace)
		 * @param {array=} args (optional) - The arguments to pass to plugin initialize funciton
		 * @param {function()=} callback (optional) - A provided callback on plugin load
		 * @param {string=} insert (optional) - Where the provided callback should be called relative to plugin initialize (before|after|replace)
		 */
		initializePlugin: function (plugin, args, callback, insert) {
			// if args is a function, it is the callback
			if (Object.prototype.toString.call(args) === '[object Function]') {
				insert = callback;
				callback = args;
				args = [];
			}
			
			// ensure that args is an array (if available)
			if (args && Object.prototype.toString.call(args) !== '[object Array]') {
				args = [args];
			} else if (!args) {
				args = [];
			}
			
			req([plugin], function(pluginObj) {
				var defaultOnLoad = onLoad = function () {
					if (pluginObj && "initialize" in pluginObj) {
						WDN.log("initializing plugin '" + plugin + "'");
						pluginObj.initialize.apply(this, args);
					} else {
						WDN.log("no initialize method for plugin " + plugin);
					}
				};
				
				if (callback) {
					// validate the insert param
					var _insertVals = 'before after replace'.split(' '),
						_goodInsert = false, i;
					for (i = 0; i < _insertVals.length; i++) {
						if (insert === _insertVals[i]) {
							_goodInsert = true;
							break;
						}
					}
					if (!_goodInsert) {
						insert = 'replace';
					}
					
					// construct the load callback based on insert
					onLoad = function() {
						if (insert === 'replace') {
							callback();
						} else {
							if (insert === 'before') {
								callback();
							}
							
							defaultOnLoad();
							
							if (insert === 'after') {
								callback();
							}
						}
					};
				}
				
				onLoad();
			});			
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
		
		hasDocumentClass: function(className) {
			if (WDN.jQuery) {
				return WDN.jQuery(_docEl).hasClass(className);
			} else {
				return (new RegExp('(^|\\s)' + className + '(\\s|$)')).test(_docEl.className);
			}
		},

		/**
		 * Converts a relative link to an absolute link.
		 *
		 * @param {string} link The relative link
		 * @param {string} base_url The base to use
		 */
		toAbs: function (link, base_url) {
			if (typeof link == 'undefined') {
				return;
			}
			
			base_url = '' + base_url;
			var lparts = link.split('/'), rScheme = /^[a-z][a-z0-9+.-]*:/i;
			
			if (rScheme.test(lparts[0])) {
				// already abs, return
				return link;
			}

			var schemeAndAuthority = '',
				schemeMatch = base_url.match(rScheme),
				hparts = base_url.split('/'),
				part;
			
			if (schemeMatch) {
				schemeAndAuthority = [hparts.shift(), hparts.shift(), hparts.shift()].join('/') + '/';
			} else if (base_url && hparts[0] === '') {
				// root relative
				schemeAndAuthority += '/';
				hparts.shift();
			}
			hparts.pop(); // strip trailing thingie, either scriptname or blank

			if (lparts[0] === '') { // like "/here/dude.png"
				hparts = []; // re-split host parts from scheme and domain only
				lparts.shift();
			}

			while (lparts.length) {
				part = lparts.shift();
				if (part === '..') {
					hparts.pop(); // strip one dir off the host for each /../
				} else if (part !== '.') {
					hparts.push(part);
				}
			}

			return schemeAndAuthority + hparts.join('/');
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
	
	if ( typeof define === "function" && define.amd ) {
		define( "wdn", [], function () { return WDN; } );
	}
	
	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.WDN = WDN;
	}
	
	(function() {
		var i = 0, scripts = document.getElementsByTagName('script'), root;
		for (; i < scripts.length; i++) {
			root = scripts[i].getAttribute('data-wdn_root');
			if (root) {
				template_path = WDN.toAbs('../../../', root);
			}
		}
	})();
})(window);
