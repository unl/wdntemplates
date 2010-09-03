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
				['_setAccount', 'UA-9809462-1'],
				['_setDomainName', '.unl.edu'],
				['_setAllowLinker', true],
				['_setAllowHash', false]
			);
			WDN.log('all set up');
			
			WDN.loadJS('/wdn/templates_3.0/scripts/idm.js', function(){
				WDN.idm.initialize(function() {
					WDN.analytics.loadGA();
				});
			});
			
			WDN.log("WDN site analytics loaded for "+ WDN.analytics.thisURL);
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
			WDN.log(_gaq);
			
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
			WDN.log('we can now track the page');
			if (!thePage) {
				_gaq.push(['_trackPageview']);
				WDN.log(_gaq);
				return;
			}
			wdnTracker._trackPageview(thePage); //First, track in the wdn analytics
			_gaq.push(['_trackPageview', thePage]);
			WDN.log("Pageview tracking for wdn worked!");
			try {
				pageTracker._trackPageview(thePage); // Second, track in local site analytics 
				WDN.log("Pageview tracking for local site worked!");
			} catch(e) {
				WDN.log("Pageview tracking for local site didn't work."); 
			}
		},
		callTrackEvent: function(category, action, label, value) {
			if (value === undefined) {
				value = 0;
			}
			//var wdnSuccess = wdnTracker._trackEvent(category, action, label, value);
			var wdnSuccess = _gaq.push(['_trackEvent', category, action, label, value]);
			WDN.log("WDN Event tracking success? "+wdnSuccess);
			try { 
				var pageSuccess = pageTracker._trackEvent(category, action, label, value);
				WDN.log("Page Event tracking success? "+pageSuccess);
			} catch(e) {
				WDN.log("Event tracking for local site didn't work.");
			}
		}
	};
}();
