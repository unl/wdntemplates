/**
 * This file contains the WDN template javascript code.
 */
var _gaq = _gaq || [];
var WDN = (function() {
	var loadingJS = {};
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
				//debug statement removed
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
						//debug statement removed
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
				//debug statement removed
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
			WDN.loadCSS('wdn/templates_3.0/css/script.css');
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
						//debug statement removed
						WDN[plugin].initialize();
					} else {
						//debug statement removed
					}
				};
			}
			WDN.loadJS('wdn/templates_3.0/scripts/'+plugin+'.js', callback);
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
})();WDN.template_path = "/";
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
var _gaq = _gaq || [];
analytics = function() { 
	return {
		initialize : function() {
			_gaq.push(
				['_setAccount', 'UA-3203435-1'],
				['_setDomainName', '.unl.edu'],
				['_setAllowLinker', true],
				['_setAllowHash', false]
			);
			_gaq.push(
				['m._setAccount', 'UA-3203435-4'],
				['m._setDomainName', '.unl.edu'],
				['m._setAllowLinker', true],
				['m._setAllowHash', false]
			);
			
			analytics.loadGA();
		},
		
		loadGA : function(){
			_gaq.push(['_trackPageview'],['m._trackPageview']);
			_gaq.push(['_trackPageLoadTime'], ['m._trackPageLoadTime']);
			
			(function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		}
	};
}();
analytics.initialize();WDN.loadedJS["/wdn/templates_3.0/scripts/mobile_analytics.js"]=1;
mobile_support = function() {
	return {
		initialize : function() {
			window.addEventListener('orientationchange', mobile_support.setOrientation, false);
			document.addEventListener('DOMContentLoaded', 
				function(){
					var body = document.getElementsByTagName('body')[0],
					head = document.getElementsByTagName('head')[0],
					meta = document.createElement('meta');
					
					body.className = body.className.replace(/fixed|mobile/, '');
					body.className = 'mobile ' + body.className;
					
					meta.name = 'viewport';
					head.appendChild(meta);
					
					// For our smarter browsers (the ones that are reading this), let's enhance the nav
					mobile_support.enhanceNavigation.initialize();
					mobile_support.fixOrientation(document);
					mobile_support.fixSearch();
					//scroll to the top of content for devices which have the address bar available at top.
					if (window.pageYOffset < 1) {
						window.scrollTo(0, 1);
					}
				},
				false
			);
		},
		
		fixSearch : function(){
			document.getElementById('wdn_search_form').setAttribute('action','http://www1.unl.edu/search/');
			var fs = document.getElementById('wdn_search_form').getElementsByTagName('fieldset')[0];
			mi = document.createElement('input');
			mi.setAttribute('name', 'format');
			mi.setAttribute('value', 'mobile');
			mi.setAttribute('type', 'hidden');
			fs.appendChild(mi);
		},
		
		fixOrientation : function(doc) { //iOS has a bug for scaling when rotating devices. This is a hack to fix the bug. See: https://gist.github.com/901295
			var addEvent = 'addEventListener',
		    type = 'gesturestart',
		    qsa = 'querySelectorAll',
		    scales = [1, 1],
		    meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

			function fix() {
				meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
				doc.removeEventListener(type, fix, true);
			}
	
			if ((meta = meta[meta.length - 1]) && addEvent in doc) {
				fix();
				scales = [.25, 1.6];
				doc[addEvent](type, fix, true);
			}
		},
		
		enhanceNavigation: function(){
			return {
				initialize : function(){
					navigation = document.getElementById("navigation");
					primaryNav = navigation.getElementsByTagName('ul')[0];
					if(primaryNav == undefined){
						navigation.className = 'disabled';
						return;
					}
					secondaryNavs = primaryNav.getElementsByTagName('ul');
					//Bind the click/tap to the navigation bar to present user with navigation and ability to close navigation.
					navigation.onclick = function() {
						mobile_support.enhanceNavigation.showPrimary(navigation.getElementsByTagName('ul')[0]);
					};
					primaryNavs = navigation.getElementsByTagName('ul')[0].children;
					var i = 0;
					for(i=0;i<=primaryNavs.length;i++){
						if(primaryNavs[i] != undefined){
							primaryNavs[i].onclick = function(){
								event.stopPropagation();
								mobile_support.enhanceNavigation.showSecondary(this);
							};
							if((primaryNavs[i].getElementsByTagName('ul')).length > 0){
								primaryNavs[i].className = 'hasSecondary';
							}
						}
					};
				},
				
				showPrimary : function(primaryNav){
					primaryNav = primaryNav;
					primaryNav.style.left = 0;
					mobile_support.enhanceNavigation.setupNavNav();
				},
				
				showSecondary : function(secondaryNav){
					secondarySiblings = secondaryNav.parentNode.children;
					var i = 0;
					for(i=0;i<=secondarySiblings.length;i++){
						if(secondarySiblings[i] != undefined && secondarySiblings[i].getElementsByTagName('ul')[0] != undefined) {
							secondarySiblings[i].getElementsByTagName('ul')[0].style.left = '100%';
						}
					}
					secondaryNav.getElementsByTagName('ul')[0].style.left = 0;
					navigation.className = 'secondary';
				},
				
				setupNavNav : function() {
					navigation.className = 'primary';
					navigation.onclick = function(){
						mobile_support.enhanceNavigation.traverseNavigation(navigation);
					};
				},
				
				traverseNavigation : function() {
					if (navigation.className == 'primary') { //we're showing the primary nav, so close it
						primaryNav.style.left = '110%';
						navigation.className = '';
						navigation.onclick = function(){
						    mobile_support.enhanceNavigation.showPrimary(navigation.getElementsByTagName('ul')[0]);
						};
					} else { // we're showing the secondary nav, close it and trigger primary
						var i = 0;
						for(i=0;i<=secondaryNavs.length;i++){
							if(secondaryNavs[i] != undefined){
								secondaryNavs[i].style.left = '100%';
							}
						};
						navigation.className = 'primary';
					}
				}
			};
		}()
	};
}();
mobile_support.initialize();WDN.loadedJS["/wdn/templates_3.0/scripts/mobile_support.js"]=1;
