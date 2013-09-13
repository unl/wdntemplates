/* global define: false */
define(['wdn', 'idm', 'jquery'], function(WDN, idm, $) {
	"use strict";
	var _gaq = window._gaq,
		_gat = window._gat,
		wdnProp = 'UA-3203435-1',
		unlDomain = '.unl.edu',
		Plugin,
		thisURL = String(window.location),
		initd = false,
		gaWdn = 'wdn.',
		gaSetVar = '_setCustomVar',
		gaPageview = '_trackPageview',
		gaEvent = '_trackEvent',
		wdnSetVar = gaWdn + gaSetVar,
		wdnEvent = gaWdn + gaEvent,
		wdnPageview = gaWdn + gaPageview;
	
	var bindLinks = function() {
		WDN.log('Begin binding links for analytics');
		//get the links in the navigation and maincontent
		var navLinks = $('a', '#navigation'), 
			mainLinks = $('a', '#maincontent'), 
			evaluateLinks, 
			filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v|mov|mp4)$/i;
		
		evaluateLinks = function() {
			var link = $(this);
			var gahref = link.attr("href");
			if (!gahref) {
				return;
			}

			if ((gahref.match(/^https?\:/i)) && (!gahref.match(document.domain))){
				link.click(function() {
					Plugin.callTrackEvent('Outgoing Link', gahref, thisURL);
					Plugin.callTrackPageview(gahref, false);
				});
			} else if (gahref.match(/^mailto\:/i)){
				var mailLink = gahref.replace(/^mailto\:/i, '');  
				link.click(function() {
					Plugin.callTrackEvent('Email', mailLink, thisURL);
				});
			} else if (gahref.match(filetypes)){
				var extension = (/[.]/.exec(gahref)) ? /[^.]+$/.exec(gahref) : undefined;
				link.click(function() {
					Plugin.callTrackEvent('File Download', gahref, thisURL, extension);
					Plugin.callTrackPageview(gahref);
				});
			}
		};

		//loop through all the links and pass them to type evaluation
		navLinks.each(evaluateLinks);
		mainLinks.each(evaluateLinks);
	};
	
	var bindApps = function() {
		var $appToggle = $('#wdn_resource_apps');
		$appToggle.one('click', function() {
			Plugin.callTrackEvent('WDN Apps', 'Opened', thisURL);
		});
	};
	
	Plugin = {
		initialize : function() {
			WDN.log("WDN site analytics loaded for "+ thisURL) ;

			var version_dep  = WDN.getDepVersion(),
				gaUrl = '//www.google-analytics.com/',
				ga_linkattribution_pluginURL = gaUrl + 'plugins/ga/inpage_linkid.js',
				domReady = function() {
					var version_html = WDN.getHTMLVersion(),
						affiliation = idm.getPrimaryAffiliation();
					
					
					if (affiliation) {
						_gaq.push([wdnSetVar, 1, 'Primary Affiliation', affiliation, 1]);
						WDN.log("Tracking primary affiliation: " + affiliation);
					}
					_gaq.push([wdnSetVar, 2, 'Template HTML Version', version_html, 3]);
					Plugin.callTrackPageview();
					
					(function(){
						var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
						if ($('body').hasClass('debug')) {
							ga.src = gaUrl + 'u/ga_debug.js';
						} else {
							ga.src = gaUrl + 'ga.js';
						}
						var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
					})();
					
					$(bindLinks);
					$(bindApps);
				};

			_gaq.push(
				[gaWdn+'_setAccount', wdnProp],
				[gaWdn+'_setDomainName', unlDomain],
				[wdnSetVar, 3, 'Template Dependents Version', version_dep, 3],
				[gaWdn+'_setAllowLinker', true],
				[gaWdn+'_require', 'inpage_linkid', ga_linkattribution_pluginURL]
			);

			if (!initd) {
				idm.initialize(function() {
					$(domReady);
				});
			}
			
			initd = true;
		},
		
		callTrackPageview: function(thePage, trackInWDNAccount){
			if (!thePage) {
				_gaq.push([wdnPageview]);
				return;
			}
			
			if (typeof trackInWDNAccount === "undefined") {
				trackInWDNAccount = true;
			}
			
			if (trackInWDNAccount) {
				_gaq.push([wdnPageview, thePage]); //First, track in the wdn analytics
				WDN.log("Pageview tracking for wdn worked!");
			}
			try {
				if (Plugin.isDefaultTrackerReady()) {
					_gaq.push([gaPageview, thePage]); // Second, track in local site analytics 
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
			_gaq.push([wdnEvent, category, action, label, value, noninteraction]);
			try {
				if (Plugin.isDefaultTrackerReady()) {
					var pageSuccess = _gaq.push([gaEvent, category, action, label, value, noninteraction]);
					WDN.log("Page Event tracking success? "+pageSuccess);
				} else {
					throw "Default Tracker Account Not Set";
				}
			} catch(e) {
				WDN.log("Event tracking for local site didn't work.");
			}
		},
		
		isDefaultTrackerReady: function() {
			if (typeof _gat !== "undefined") {
				return _gat._getTrackerByName()._getAccount() !== 'UA-XXXXX-X';
			}
			//assume the account is set async (we could check the _gaq queue, but that seems like overkill)
			return true;
		}
	};
	
	return Plugin;
});
