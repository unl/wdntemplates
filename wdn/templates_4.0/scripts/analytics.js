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
define(['wdn', 'idm'], function(WDN, idm) {
	var Plugin,
		thisURL = String(window.location),
		initd = false;
	
	var bindEvent = function(el, eventName, eventHandler) {
        if (el.addEventListener){
            el.addEventListener(eventName, eventHandler, false); 
        } else if (el.attachEvent){
            el.attachEvent('on'+eventName, eventHandler);
        }
    };
    
	var bindLinks = function() {
		WDN.log('Begin binding links for analytics');
        //get the links in the navigation and maincontent
        var nav = document.getElementById('navigation'), 
        	navLinks = nav.getElementsByTagName("a"), 
        	main = document.getElementById('maincontent'), 
        	mainLinks = main.getElementsByTagName("a"), 
        	evaluateLinks, i, 
        	filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v|mov|mp4)$/i;
        
        evaluateLinks = function(link) {
            var gahref = link.getAttribute("href");
            if (!gahref) {
                return;
            }

            if ((gahref.match(/^https?\:/i)) && (!gahref.match(document.domain))){
                bindEvent(link, 'click', function() {
                    Plugin.callTrackEvent('Outgoing Link', gahref, thisURL);
                    Plugin.callTrackPageview(gahref, false);
                });
            } else if (gahref.match(/^mailto\:/i)){
                var mailLink = gahref.replace(/^mailto\:/i, '');  
                bindEvent(link, 'click', function() {
                	Plugin.callTrackEvent('Email', mailLink, thisURL);
                });
            } else if (gahref.match(filetypes)){
                var extension = (/[.]/.exec(gahref)) ? /[^.]+$/.exec(gahref) : undefined;
                bindEvent(link, 'click', function() {
                	Plugin.callTrackEvent('File Download', gahref, thisURL);
                	Plugin.callTrackPageview(gahref);
                });
            }
        };

        //loop through all the links and pass them to type evaluation
        for (i=0; i<navLinks.length; i++) {
            evaluateLinks(navLinks[i]);
        }
        
        for (i=0; i<mainLinks.length; i++) {
            evaluateLinks(mainLinks[i]);
        }
	};
	
	Plugin = {
		initialize : function() {
			WDN.log("WDN site analytics loaded for "+ thisURL) ;

            var version_html = WDN.getHTMLVersion(),
                version_dep  = WDN.getDepVersion(),
                ga_linkattribution_pluginURL = '//www.google-analytics.com/plugins/ga/inpage_linkid.js',
                i = 0;

			_gaq.push(
				['wdn._setAccount', 'UA-3203435-1'],
				['wdn._setDomainName', '.unl.edu'],
				['wdn._setCustomVar', 2, 'Template HTML Version', version_html, 3],
				['wdn._setCustomVar', 3, 'Template Dependents Version', version_dep, 3],
				['wdn._setAllowLinker', true],
				['wdn._require', 'inpage_linkid', ga_linkattribution_pluginURL]
			);

			if (!initd) {
				WDN.initializePlugin('idm', [function() {
					_gaq.push(['wdn._trackPageview']);
					
					(function(){
						var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
						if (document.body.className.match(/(^|\s)debug(\s|$)/)) {
							ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/u/ga_debug.js';
						} else {
							ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
						}
						var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
					})();
				}]);

				var toolLinks = document.getElementById('wdn_tool_links').getElementsByTagName('a');
				for (; i<toolLinks.length; i++) {
	                bindEvent(toolLinks[i], 'click', function() {
	                	var wdnToolLinks = this.textContent || this.innerText || '';
						Plugin.callTrackEvent('WDN Tool Links', wdnToolLinks, thisURL);
	                });
	            }
			}
			
			bindLinks();
			initd = true;
		},
		
		callTrackPageview: function(thePage, trackInWDNAccount){
            if (typeof trackInWDNAccount === "undefined") {
                trackInWDNAccount = true;
            }
			if (!thePage) {
				_gaq.push(['wdn._trackPageview']);
				return;
			}
			
			if (trackInWDNAccount) {
    			_gaq.push(['wdn._trackPageview', thePage]); //First, track in the wdn analytics
    			WDN.log("Pageview tracking for wdn worked!");
			}
			try {
				if (Plugin.isDefaultTrackerReady()) {
					_gaq.push(['_trackPageview', thePage]); // Second, track in local site analytics 
					WDN.log("Pageview tracking for local site worked!");
				} else {
					throw "Default Tracker Account Not Set";
				}
			} catch(e) {
				WDN.log("Pageview tracking for local site didn't work."); 
			}
		},
		
		callTrackEvent: function(category, action, label, value, noninteraction) {
			if (value === undefined) {
				value = 0;
			}
			if (noninteraction === undefined) {
			    noninteraction = false;
			}
			value = Math.floor(value);
			_gaq.push(['wdn._trackEvent', category, action, label, value, noninteraction]);
			try {
				if (WDN.analytics.isDefaultTrackerReady()) {
					var pageSuccess = _gaq.push(['_trackEvent', category, action, label, value, noninteraction]);
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
		}
	};
	
	return Plugin;
});
