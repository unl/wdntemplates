(function( global, factory ) {
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ? factory(global, true) : function( w ) {
			if ( !w.document ) {
				throw new Error("WDN requires a window with a document");
			}
			return factory( w );
		};
	} else {
		factory( global );
	}
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	var
		pluginParams = {},
		loadingCSS = {},
		loadedCSS = {},
		document = window.document,
		isDebug = false,
		_head,
		_docEl,
		/**
		 * This variable stores the path to the template files.
		 * It can be set to /, https://www.unl.edu/, or nothing.
		 */
		template_path = '',

		dependent_path = 'wdn/templates_5.3/',

		build_path = '/compressed',

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

	//#TEMPLATE_PATH
	//#DEPENDENT_PATH

	var WDN = {

		getTemplateFilePath: function(file, withTemplatePath, withVersion) {
			file = '' + file;

			// add built script directory for production
			if (!isDebug) {
				file = file.replace(/^js(\/|$)/, 'js' + build_path + '$1');
			}

			var filePath = dependent_path + file;

			if (withTemplatePath) {
				filePath = template_path + filePath;
			}

			if (withVersion) {
				var qsPosition = filePath.indexOf('?');
				if (qsPosition < 0) {
					filePath += '?';
				} else if (qsPosition !== filePath.length - 1) {
					filePath += '&';
				}

				filePath += 'dep=' + WDN.getDepVersion();
			}

			return filePath;
		},

		/**
		 * Loads an external JavaScript file.
		 */
		loadJS: function (url,callback) {
			url = _sanitizeTemplateUrl(url);
			require([url], callback);
		},

		/**
		 * Load an external css file.
		 */
		loadCSS: function (url, callback, checkLoaded, callbackIfLoaded) {
			url = _sanitizeTemplateUrl(url);

			var link = (function() {
					var link = document.createElement("link");
					link.href = url;
					link.rel = "stylesheet";
					link.type = "text/css";
					return link;
				})(),
				executeCallback = function() {
					loadedCSS[url] = true;
					if (loadingCSS[url]) {
						for (var i = loadingCSS[url].length - 1; i >= 0; i--) {
							loadingCSS[url][i]();
						}
						delete loadingCSS[url];
					}
				};

			if (checkLoaded === false || !(url in loadedCSS)) {
				if (callback) {
					if (url in loadingCSS) {
						loadingCSS[url].push(callback);
						return;
					}

					loadingCSS[url] = [callback];
				} else if (!(url in loadingCSS)) {
					loadingCSS[url] = [];
				}

				if (callback && !window.Modernizr.linkloadevents) {
					// Workaround for webkit and old gecko not firing onload events for <link>
					// http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
					var dummyObj = document.createElement('img');
					dummyObj.onerror = executeCallback;
					dummyObj.src = url;
				} else {
					link.onload = executeCallback;
				}

				_head.appendChild(link);
			} else if (callback && callbackIfLoaded !== false) {
				callback();
			}
		},

		isDebug: function() {
			return isDebug;
		},

		/**
		 * Load jQuery included with the templates
		 *
		 * @param callback Called when the document is ready
		 */
		loadJQuery: function (callback) {
			require(['wdn_jquery'], function($) {
				$(callback);
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
				version_html = '5.DEV';
			}
			if (!version_html) {
				version_html = '3.0';
			}

			return version_html;
		},

		getDepVersion:function () {
			var version_dep = document.getElementById("wdn_dependents").getAttribute("src");

			if (/\?dep=\$DEP_VERSION\$/.test(version_dep)) {
				version_dep = '5.3.DEV';
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

			require([plugin], function(pluginObj) {
				var defaultOnLoad, onLoad;
				defaultOnLoad = onLoad = function () {
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

		setCookie: function (name, value, seconds, path, domain, samesite, secure) {
			var expires = "";
			if (seconds) {
				var date = new Date();
				date.setTime(date.getTime() + seconds * 1000);
				expires = ";expires=" + date.toUTCString();
			}
			if (!path) {
				path = '/';
			} else if (path.charAt(0) !== '/') {
				path = WDN.toAbs(path, window.location.pathname);
			}
			if (!domain) {
				domain = '.unl.edu';
			}
			if (!samesite) {
				samesite = 'lax';
			}

			var cookieString = name + "=" + value + expires + ";path=" + path + ";domain=" + domain + ";samesite=" + samesite;

			// Add secure if set or not set with samesite=none
			if (secure || !secure && samesite.toLowerCase() === 'none') {
				cookieString = cookieString + ';secure';
			}

			document.cookie = cookieString;
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
			var documentClass = ' ' + (_docEl.getAttribute && _docEl.getAttribute('class') || '') + ' ';
			documentClass = documentClass.replace(/[\t\r\n\f]/g, ' ');
			return documentClass.indexOf(' ' + className + ' ') > -1;
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
			var $ = require('jquery');
			return $.parseXML(string);
		},

		request: function (url, data, callback, type, method) {
			var $ = require('wdn_jquery');

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
			var $ = require('wdn_jquery');
			return $.get(url, data, callback, type);
		},

		post: function (url, data, callback, type) {
			var $ = require('wdn_jquery');
			return $.post(url, data, callback, type);
		}
	};

	var jQueryWarning = false;
	Object.defineProperty(WDN, 'jQuery', {
		configurable: true,
		get: function() {
			if (!jQueryWarning) {
				jQueryWarning = true;

				if (console && console.warn) {
					console.warn('Using jQuery via the WDN.jQuery property is deprecated. You should use require to access jQuery.');
				}
			}

			return window.jQuery;
		}
	});

	// invoke function for handling debug loader and document initialization
	(function() {
		if (!document) {
			return;
		}

		_head = document.head || document.getElementsByTagName('head')[0];
		_docEl = document.documentElement;

		var i = 0, scripts = document.getElementsByTagName('script'), root;
		for (; i < scripts.length; i++) {
			root = scripts[i].getAttribute('data-wdn_root');
			if (root) {
				isDebug = true;
				template_path = WDN.toAbs('../../../', root);
				break;
			}
		}
	})();

	// provide a named module to the AMD loader
	if (typeof define === "function" && define.amd) {
		define('wdn', [], function () {
			return WDN;
		});
	}

	// export to the window
	if (typeof noGlobal === "undefined") {
		window.WDN = WDN;
	}

	// export for other module environments
	return WDN;
}));
