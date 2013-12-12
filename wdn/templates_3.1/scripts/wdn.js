/**
 * This file contains the WDN template javascript code.
 */
var _gaq = _gaq || [];
var WDN = (function() {
	var loadingJS = {},
		pluginParams = {},
		loadingCSS = {},
		loadedCSS = {},
		loadedPlugins = {},
		isReady = false,
		readyList,
		_head = document.head || document.getElementsByTagName('head')[0],
		_docEl = document.documentElement,
		_oldWidthScript,
		_oldWidthBreakpoint,
		_currentWidthScript,
		_currentWidthBreakpoint,
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

		getCurrentWidthScript: function() {
			return _currentWidthScript;
		},
		
		setCurrentWidths: function(callback) {
		    _oldWidthScript = _currentWidthScript;
		    _oldWidthBreakpoint = _currentWidthBreakpoint;
		    var getMediaQueryWidth = function() {
				// test for false positive
				if (Modernizr.mq('only screen and (min-width: 512000px)')) {
					var offsetWidth = _docEl.offsetWidth;
					switch (true) {
						case offsetWidth >= 768:
							return '768';
						default:
							return '320';
					}
				}
			
				switch (true) {
					case Modernizr.mq('only screen and (min-width: 1040px)'):
					    return '1040';
					case Modernizr.mq('only screen and (min-width: 960px)'):
					    return '960';
					case Modernizr.mq('only screen and (min-width: 768px)'):
						return '768';
					case Modernizr.mq('only screen and (min-width: 600px)'):
					    return '600';
					case Modernizr.mq('only screen and (min-width: 480px)'):
					    return '480';
					default:
						return '320';
				}
			}
			if (WDN.hasDocumentClass('mediaqueries')) {
			    if (getMediaQueryWidth() >= 768) {
			        _currentWidthScript = '768';
			    } else {
			        _currentWidthScript = '320';   
			    }
			    _currentWidthBreakpoint = getMediaQueryWidth();
			} else {
				// default to the desktop presentation
				_currentWidthScript = '768';
				_currentWidthBreakpoint = '960';
			}
			if(callback) {
			    callback();
			}
		},
		
		getCurrentWidthBreakpoint: function() {
		    return _currentWidthBreakpoint;
		},
		
		ready: function(fn) {
			if (WDN.jQuery) {
				WDN.jQuery(fn);
			} else {
				var ready = function() {
					isReady = true;
					for (var i = 0; i < readyList.length; i++) {
						readyList[i]();
					}
					readyList = [];
				};
				
				// bind ready
				if (!readyList) {
					readyList = [];
					var domReady = function() {
						document.removeEventListener('DOMContentLoaded', domReady, false);
						ready();
					};
					
					if (document.readyState === "complete") {
						setTimeout(ready, 1);
					} else {
						document.addEventListener( "DOMContentLoaded", domReady, false );
						window.addEventListener( "load", ready, false );
					}
				}
				
				readyList.push(fn);
				
				if (isReady) {
					ready();
				}
			}
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
					WDN.ready(function() {
						WDN.initializePlugin('analytics');
						WDN.initializePlugin('navigation');
						WDN.initializePlugin('search');
						WDN.browserAdjustments();
						WDN.initializePlugin('unlalert');
						WDN.initializePlugin('images');
					});
				},
				"768": function() {
					WDN.loadJQuery(function() {
						WDN.loadJS(WDN.getTemplateFilePath('scripts/global_functions.js'));
						WDN.initializePlugin('analytics');
						WDN.initializePlugin('analytics_scroll_depth');
						WDN.initializePlugin('navigation');
						WDN.initializePlugin('search');
						WDN.initializePlugin('feedback');
						WDN.initializePlugin('socialmediashare');
						WDN.contentAdjustments();
						//WDN.initializePlugin('tooltip');
						WDN.initializePlugin('toolbar');
						WDN.initializePlugin('tabs');
						WDN.browserAdjustments();
                        WDN.initializePlugin('chat');
					}, debug);
					WDN.initializePlugin('unlalert');
					WDN.initializePlugin('images');
				}
			};
			
			WDN.loadJS(WDN.getTemplateFilePath('scripts/modernizr-wdn.js'), function() {
				var resizeTimeout, onResizeReady, onResize, widthScript;
				
				WDN.setCurrentWidths(function(){
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
				});
				
				if (WDN.hasDocumentClass('mediaqueries')) {
					onResizeReady = function() {
					    WDN.setCurrentWidths(function(){
					        // Update current widths and retain old to compare
    						var oldWidthScript = _oldWidthScript,
		                        oldWidthBreakpoint = _oldWidthBreakpoint;
    							newWidthScript = WDN.getCurrentWidthScript();
    							newWidthBreakpoint = WDN.getCurrentWidthBreakpoint();
    						if (oldWidthScript != newWidthScript) {
    							_currentWidthScript = newWidthScript;
    							WDN.log('Min-width breakpoint for scripts changed from ' + oldWidthScript + ' to ' + newWidthScript);
    							WDN.log('Min-width breakpoint changed from ' + oldWidthBreakpoint + ' to ' + newWidthBreakpoint);
    							// Register new plugins and call WDN functions as needed
    							switch (newWidthScript) {
    								case '768':
    									WDN.loadJQuery(function() {
    										for (var i in loadedPlugins) {
    											if (i in WDN && 'onResize' in WDN[i]) {
    												WDN[i].onResize(oldWidthScript, newWidthScript, oldWidthBreakpoint, newWidthBreakpoint);
    											}
    										}
    										WDN.initializePlugin('feedback');
    										WDN.initializePlugin('socialmediashare');
    										WDN.contentAdjustments();
    										WDN.initializePlugin('tooltip');
    										WDN.initializePlugin('toolbar');
    										WDN.initializePlugin('tabs');
    									}, debug);
    									break;
    								case '320':
    									// nothing new
    									for (var i in loadedPlugins) {
    										if (i in WDN && 'onResize' in WDN[i]) {
    											WDN[i].onResize(oldWidthScript, newWidthScript, oldWidthBreakpoint, newWidthBreakpoint);
    										}
    									}
    									break;
    							}
    						} else {
    							for (var i in loadedPlugins) {
    								if (i in WDN && 'onResize' in WDN[i]) {
    									WDN[i].onResize(oldWidthScript, newWidthScript, oldWidthBreakpoint, newWidthBreakpoint);
    								}
    							}
    						}
						});
					};
					onResize = function() {
						if (resizeTimeout) {
							clearTimeout(resizeTimeout);
						}
						resizeTimeout = setTimeout(onResizeReady, 500);
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
					WDN.jQuery(function() {
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

		getHTMLVersion:function () {
			var version_html = document.body.getAttribute("data-version");
			
			// Set the defaults
			if (version_html == '$HTML_VERSION$') {
				version_html = '3.DEV';
			}
			if (!version_html) {
				version_html = '3.0';
			}
			
			return version_html;
		},

		getDepVersion:function () {
			var version_dep = document.getElementById("wdn_dependents").getAttribute("src");
			
			if (/\?dep=\$DEP_VERSION\$/.test(version_dep)) {
				version_dep = '3.1.DEV';
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

		browserAdjustments: function () {
			var body = document.getElementsByTagName('body')[0],
			msgs = [],
			reXPAgent = /Windows (?:NT 5.1|XP)/,
			killCss = false,
			setCookie = false,
			xpCookie = 'unlXPAck',
			xpCookieLifetime = 30 * 24 * 60 * 60; // 30 days in seconds
			
			if (window.navigator.userAgent.match(reXPAgent) && !WDN.getCookie(xpCookie)) {
				setCookie = true;
				msgs.push(WDN.getTemplateFilePath('includes/osupgrade.html', true));
			}
			
			if (WDN.hasDocumentClass('ie6')) {
				killCss = true;
				msgs.push(WDN.getTemplateFilePath('includes/browserupgrade.html', true));
			}
			
			if (msgs.length) {
				WDN.loadJQuery(function() {
					var notice = WDN.jQuery('<div/>', {id:"wdn_upgrade_notice"}), msg;
					notice.css({
						'position': 'absolute',
						'width': '100%',
						'z-index': '999',
						'top': 0,
						'left': 0
					});
					WDN.jQuery.each(msgs, function(i, url) {
						var msg = WDN.jQuery('<div/>').load(url, function() {
							if (setCookie) {
								msg.find('.close').click(function() {
									WDN.jQuery(this).parent().hide();
									WDN.setCookie(xpCookie, 1, xpCookieLifetime);
									return false;
								});
							}
						}).appendTo(notice);
					});
					
					WDN.jQuery(body).prepend(notice);
					if (killCss) {
						WDN.jQuery(body).removeAttr('class').addClass('document');
						WDN.jQuery('head link[rel=stylesheet]').each(function(i) { this.disabled = true; });
					}
				});
				
				if (killCss) {
					return;
				}
			}
			
			var css3Tests = 'firstchild lastchild nthchild nthoftype nthlastchild'.split(' ');
			for (var i = 0; i < css3Tests.length; i++) {
				if (WDN.hasDocumentClass('no-css-' + css3Tests[i])) {
					WDN.loadCSS(WDN.getTemplateFilePath('css/content/css3_selector_failover.css'));
					
					// base css3 workarounds
					if (WDN.jQuery) {
						WDN.jQuery('.zentable tbody tr:nth-child(odd)').addClass('rowOdd');
						WDN.jQuery('.zentable tbody tr:nth-child(even)').addClass('rowEven');
					}
					
					break;
				}
			}
			
			// base after/before fixes
			if (WDN.hasDocumentClass('no-generatedcontent')) {
				WDN.initializePlugin('generated_content');
			}
			
			if (_currentWidthScript == '320') {
				body.className = 'mobile ' + body.className.replace(/fixed|mobile/, '');
				
				//scroll to the top of content for devices which have the address bar available at top.
				if (window.pageYOffset < 1) {
					window.scrollTo(0, 1);
				}
				
				// iOS has a bug for scaling when rotating devices. This is a hack to fix the bug. 
				// https://gist.github.com/901295
				var addEvent = 'addEventListener',
			    type = 'gesturestart',
			    qsa = 'querySelectorAll',
			    scales = [1, 1],
			    meta = qsa in document ? document[qsa]('meta[name=viewport]') : [],
		    	fix = function() {
					meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
					document.removeEventListener(type, fix, true);
				};
		
				if ((meta = meta[meta.length - 1]) && addEvent in document) {
					fix();
					scales = [.25, 1.6];
					document[addEvent](type, fix, true);
				}
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
				loadedPlugins[plugin] = true;
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
						loadedPlugins[plugin] = true;
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
})();
