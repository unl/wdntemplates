/**
 * This file contains the WDN template javascript code.
 */
var _gaq = _gaq || [];
var WDN = (function() {
	var loadingJS = {},
		pluginParams = {},
		loadingCSS = {},
		loadedCSS = {},
		_head = document.head || document.getElementsByTagName('head')[0],
		_docEl = document.documentElement,
		_currentWidthScript,
		_initd = false,
		_sanitizeTemplateUrl = function(url) {
			var reTemplateUrl = new RegExp('^/?' + WDN.dependent_path.replace('.', '\\.'));
			if (url.match(reTemplateUrl)) {
				if (url.charAt(0) === '/') {
					// trim off the leading slash
					url = url.substring(1);
				}
				
				url = WDN.template_path + url;
			}
			
			return url;
		};

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
		 * This variable stores the path to the template dependents
		 */
		dependent_path: 'wdn/templates_3.1/',
		
		getTemplateFilePath: function(file, withTemplatePath) {
			file = '' + file;
			var filePath = WDN.dependent_path + file;
			
			if (withTemplatePath) {
				filePath = WDN.template_path + filePath;
			}
			
			return filePath;
		},

		/**
		 * Loads an external JavaScript file.
		 *
		 * @param {string} url
		 * @param {function()=} callback (optional) - will be called once the JS file has been loaded
		 * @param {boolean=} checkLoaded (optional) - if false, the JS will be loaded without checking whether it's already been loaded
		 * @param {boolean=} callbackIfLoaded (optional) - if false, the callback will not be executed if the JS has already been loaded
		 */
		loadJS: function (url,callback,checkLoaded,callbackIfLoaded) {
			url = _sanitizeTemplateUrl(url);

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
				e.src = url;
				e.type = 'text/javascript';
				_head.appendChild(e);

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

		getClientWidth: function() {
			return document.clientWidth || _docEl.clientWidth ||
				document.body.parentNode.clientWidth || document.body.clientWidth;
		},

		/**
		 * This function is called on page load to initialize template related
		 * data.
		 */
		initializeTemplate: function (debug) {
			if (_initd) {
				return;
			}
			_initd = true;
			
			var clientWidth, initFunctions;
			
			WDN.loadCSS(WDN.getTemplateFilePath('css/script.css'));
			
			initFunctions = {
				"320": function() {
					WDN.initializePlugin('mobile_analytics');
					WDN.initializePlugin('mobile_support');
					WDN.initializePlugin('unlalert');
				},
				"768": function() {
					WDN.loadJQuery(function() {
						WDN.loadJS(WDN.getTemplateFilePath('scripts/global_functions.js'));
						WDN.initializePlugin('analytics');
						WDN.initializePlugin('navigation');
						WDN.initializePlugin('search');
						WDN.initializePlugin('feedback');
						WDN.initializePlugin('socialmediashare');
						WDN.contentAdjustments();
						WDN.initializePlugin('tooltip');
						WDN.initializePlugin('toolbar');
						WDN.initializePlugin('tabs');
						WDN.browserAdjustments();
					}, debug);
					WDN.initializePlugin('unlalert');
				}
			};
			
			WDN.loadJS(WDN.getTemplateFilePath('scripts/modernizr-wdn.js'), function() {
				var resizeTimeout, onResize, widthScript,
					getMediaQueryWidth = function() {
						switch (true) {
							case Modernizr.mq('only screen and (min-width: 768px)'):
								return '768';
							default:
								return '320';
						}
					};
				
				if (WDN.hasDocumentClass('mediaqueries')) {
					_currentWidthScript = getMediaQueryWidth();
				} else {
					// default to the desktop presen
					_currentWidthScript = '768';
				}
				
				if (debug) {
					initFunctions[_currentWidthScript]();
				} else {
					widthScript = WDN.getTemplateFilePath('scripts/compressed/' + _currentWidthScript + '.js');
					
					if (WDN.hasDocumentClass('wdn-async')) {
						WDN.loadJS(widthScript, initFunctions[_currentWidthScript]);
					} else {
						var xhr;
						if (window.ActiveXObject) {
							xhr = new ActiveXObject("Microsoft.XMLHTTP");
						} else if (window.XMLHttpRequest) {
							xhr = new XMLHttpRequest();
						}
						
						if (xhr) {
							xhr.open("GET", WDN.template_path + widthScript, false);
							xhr.send(null);
							if (/\S/.test(xhr.responseText)) {
								(window.execScript || function(data) {
									window["eval"].call(window, data);
								})(xhr.responseText);
								initFunctions[_currentWidthScript]();
							}
						} else {
							WDN.INIT = function() {
								initFunctions[_currentWidthScript]();
								delete WDN.INIT;
							};
							document.write('<script type="text/javascript" src="' + WDN.template_path + widthScript + '"></script>');
							document.write('<script type="text/javascript">WDN.INIT();</script>');
						}
					}
				}
				
				if (WDN.hasDocumentClass('mediaqueries')) {
					onResize = function() {
						if (resizeTimeout) {
							clearTimeout(resizeTimeout);
						}
						
						resizeTimeout = setTimeout(function() {
							var newWidthScript = getMediaQueryWidth();
							if (_currentWidthScript != newWidthScript) {
								WDN.log('Min-width breakpoint changed from ' + _currentWidthScript + ' to ' + newWidthScript);
								//TODO: Do some resize stuff
								
								// Register new plugins and call WDN functions as needed
								switch (newWidthScript) {
									case '768':
										
										break;
									case '320':
										
										break;
								}
								
								//_currentWidthScript = newWidthScript;
							}
						}, 500);
					};
					
					if (window.addEventListener) {
						window.addEventListener('resize', onResize, false);
					} else if (window.attachEvent) {
						window.attachEvent('onresize', onResize);
					}
				}
			});
		},

		/**
		 * Load jQuery included with the templates as WDN.jQuery
		 *
		 * @param callback Called when the document is ready
		 * @param forceDebug Should the debug jQuery be loaded
		 */
		loadJQuery: function (callback, forceDebug) {
			var jQueryPath = 'scripts/jquery.', body = document.getElementsByTagName('body');
			if (!(forceDebug || (body.length && body[0].className.match(/\bdebug\b/)))) {
				jQueryPath += 'min.';
			}
			jQueryPath += 'js';
			
			WDN.loadJS(WDN.getTemplateFilePath(jQueryPath), function() {
				if (!WDN.jQuery) {
					WDN.jQuery = jQuery.noConflict(true);
				}
				// Load our required AJAX plugin
				WDN.loadJS(WDN.getTemplateFilePath('scripts/wdn_ajax.js'), function() {
					WDN.jQuery(document).ready(function() {
						callback();
					});
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

		browserAdjustments: function () {
			if (WDN.hasDocumentClass('ie6')) {
				var $body = WDN.jQuery('body').prepend('<div id="wdn_upgrade_notice"></div>').removeAttr('class').addClass('document');
				WDN.jQuery('#wdn_upgrade_notice').load(WDN.getTemplateFilePath('includes/browserupgrade.html', true));
				WDN.jQuery('head link[rel=stylesheet]').each(function(i) { this.disabled = true; });
				WDN.loadCSS(WDN.getTemplateFilePath('css/content/columns.css'));
				return;
			}
			
			var css3Tests = 'firstchild lastchild nthchild nthoftype nthlastchild'.split(' ');
			for (var i = 0; i < css3Tests.length; i++) {
				if (WDN.hasDocumentClass('no-css-' + css3Tests[i])) {
					WDN.loadCSS(WDN.getTemplateFilePath('css/content/css3_selector_failover.css'));
					
					// base css3 workarounds
					WDN.jQuery('.zentable tbody tr:nth-child(odd)').addClass('rowOdd');
					WDN.jQuery('.zentable tbody tr:nth-child(even)').addClass('rowEven');
					
					break;
				}
			}
			
			// base after/before fixes
			if (WDN.hasDocumentClass('no-generatedcontent')) {
				WDN.initializePlugin('generated_content');
			}
		},

		contentAdjustments: function () {
			WDN.jQuery('#titlegraphic h1 span').parent('h1').addClass('with-sub');
			//remove the dotted line underneath images that are links
			WDN.jQuery('#maincontent a img, #footer a img').each(function(j){
				WDN.jQuery(this).parent('a').addClass('imagelink');
			});
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
			
			var defaultOnLoad = onLoad = function () {
				if ("initialize" in WDN[plugin]) {
					WDN.log("initializing plugin '" + plugin + "'");
					WDN[plugin].initialize.apply(this, args);
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
			
			WDN.loadJS(WDN.getTemplateFilePath('scripts/' + plugin + '.js'), onLoad);
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
				return _docEl.className.match(new RegExp('(^|\\s)' + className + '(\\s|$)'));
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
})();