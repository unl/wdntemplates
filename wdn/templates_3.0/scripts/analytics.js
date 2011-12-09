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
				['wdn._setAccount', 'UA-3203435-1'],
				['wdn._setDomainName', '.unl.edu'],
				['wdn._setAllowLinker', true],
				['wdn._setAllowHash', false]
			);
			
			WDN.loadJS('wdn/templates_3.0/scripts/idm.js', function(){
				WDN.idm.initialize(function() {
					WDN.analytics.loadGA();
				});
			});
			
			WDN.log("WDN site analytics loaded for "+ WDN.analytics.thisURL);
				filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v|mov|mp4)$/i; //these are the file extensions to track for downloaded content
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
					var socialMedia = WDN.jQuery(this).parent().attr('id');
					socialMedia = socialMedia.replace(/wdn_/gi, '');
					console.log(socialMedia);
					//WDN.analytics.callTrackEvent('Page Sharing', socialMedia, WDN.analytics.thisURL);
					_gaq.push(['wdn._trackSocial', socialMedia, 'share']);
					try {
						if (WDN.analytics.isDefaultTrackerReady()) {
							_gaq.push(['_trackSocial', socialMedia, 'share']);
						} else {
							throw "Default Tracker Account Not Set";
						}
					} catch(e) {
						WDN.log("Social Media tracking for local site didn't work.");
					}
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
			_gaq.push(['wdn._trackPageview']);
			
			(function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				if (WDN.jQuery('body').hasClass('debug')) {
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/u/ga_debug.js';
				} else {
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				}
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
			//WDN.analytics.setupHTML5tracking.intialize();
		},
		
		trackNavigationPreferredState : function(preferredState) {
			try {
				WDN.analytics.callTrackEvent('Navigation Preference', preferredState, WDN.analytics.thisURL);
			} catch(e){}
		},
		callTrackPageview: function(thePage){
			WDN.log('we can now track the page');
			if (!thePage) {
				_gaq.push(['wdn._trackPageview']);
				return;
			}
			_gaq.push(['wdn._trackPageview', thePage]); //First, track in the wdn analytics
			WDN.log("Pageview tracking for wdn worked!");
			try {
				if (WDN.analytics.isDefaultTrackerReady()) {
					_gaq.push(['_trackPageview', thePage]); // Second, track in local site analytics 
					WDN.log("Pageview tracking for local site worked!");
				} else {
					throw "Default Tracker Account Not Set";
				}
			} catch(e) {
				WDN.log("Pageview tracking for local site didn't work."); 
			}
		},
		callTrackEvent: function(category, action, label, value) {
			if (value === undefined) {
				value = 0;
			}
			value = Math.floor(value);
			//var wdnSuccess = wdnTracker._trackEvent(category, action, label, value);
			_gaq.push(['wdn._trackEvent', category, action, label, value]);
			try {
				if (WDN.analytics.isDefaultTrackerReady()) {
					var pageSuccess = _gaq.push(['_trackEvent', category, action, label, value]);
					WDN.log("Page Event tracking success? "+pageSuccess);
				} else {
					throw "Default Tracker Account Not Set";
				}
			} catch(e) {
				WDN.log("Event tracking for local site didn't work.");
			}
		},
		isDefaultTrackerReady: function() {
			if (typeof _gat != "undefined") {
				return _gat._getTrackerByName()._getAccount() != 'UA-XXXXX-X';
			}
			//assume the account is set async (we could check the _gaq queue, but that seems like overkill)
			return true;
		}/*,
		
		setupHTML5tracking: function() {
			
			return {
				intialize : function() {
					WDN.loadJS(
						'wdn/templates_3.0/scripts/plugins/modernizr/modernizr_1.5.js', 
						function(){
							WDN.analytics.setupHTML5tracking.checkCookie(mondernizrVersion);
						}
					);	
				},
				
				checkCookie : function(mdVersion){
					var userAgent = navigator.userAgent.toLowerCase();//grab the broswer User Agent
					uAgent = userAgent.replace(/;/g, ''); //strip out the ';' so as not to bork the cookie
					var __html5 = WDN.getCookie('__html5'); //Previous UNL HTML5 test
					
					if (!__html5) { //We haven't run this test before, so let's do it.
						WDN.log('We have not run this test yet, let us track this client!');
						WDN.analytics.setupHTML5tracking.setCookie(uAgent, mdVersion);
						return;
					}
					WDN.log(uAgent +'|+|'+mdVersion);
					WDN.log(__html5);
					//Let's check to see if either the browser or modernizr has changed since the last tracking
					if ((uAgent +'|+|'+mdVersion) != (__html5)){
						WDN.log('We don\'t have a match, let us track this client!');
						WDN.analytics.setupHTML5tracking.setCookie(uAgent, mdVersion);
					} else { //we have a match and nothing has changed, so do nothing more.
						WDN.log('Already have this client tracked');
						return;
					}
				},
				
				setCookie : function(uAgent, mdVersion) {
					var name = '__html5';
					var value = uAgent +'|+|'+mdVersion; //combine gaVisitorID and Modernizr version
					WDN.setCookie(name, value, 31556926); //set a cookie for one year
					WDN.analytics.setupHTML5tracking.testBrowser();
				},
				
				testBrowser : function(){
					for (var prop in Modernizr) {
						if (typeof Modernizr[prop] === 'function') continue;
						if (prop == 'inputtypes' || prop == 'input') {
							for (var field in Modernizr[prop]) {
								if (Modernizr[prop][field]){
									//WDN.log(prop + ' ('+field+') ' + Modernizr[prop][field]);
									WDN.analytics.callTrackEvent('HTML5/CSS3 Support', prop + '-('+field+')', '');
								}
							}
						} else {
							if(Modernizr[prop]){
								//WDN.log(prop + ': ' + Modernizr[prop]);
								WDN.analytics.callTrackEvent('HTML5/CSS3 Support', prop, '');
							}
						}
					}
				}
			};
		}()*/
	};
}();
