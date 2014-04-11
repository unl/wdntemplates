/* global define: false */
define(['wdn', 'idm', 'jquery'], function(WDN, idm, $) {
	"use strict";
	var _gaq = window._gaq,
		_gat = window._gat,
		ga = function() {
			window.ga.apply(this, arguments)
		},

		wdnProp = 'UA-3203435-1',
		unlDomain = '.unl.edu',

		Plugin,
		thisURL = String(window.location),
		initd = false,

		gaWdnName = 'wdn',
		gaWdn = gaWdnName + '.';

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

	// ga.js method for getting default tracker (with set account)
	var getDefaultGATracker = function() {
		var tracker = _gat._getTrackerByName();
		if (tracker._getAccount() !== 'UA-XXXXX-X') {
			return tracker;
		}

		return undefined;
	};

	// analytics.js method for getting default tracker
	var getDefaultAnalyticsTracker = function() {
		return ga.getByName('t0');
	};

	Plugin = {
		initialize : function() {
			WDN.log("WDN site analytics loaded for "+ thisURL) ;

			var version_dep = WDN.getDepVersion(),
				gaDim = 'dimension',
				domReady = function() {
					var version_html = WDN.getHTMLVersion(),
						affiliation = idm.getPrimaryAffiliation();

					if (affiliation) {
						WDN.log("Tracking primary affiliation: " + affiliation);
						ga(gaWdn+'set', gaDim + 1, affiliation);
					}

					ga(gaWdn+'set', gaDim + 2, version_html);

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

			ga('create', wdnProp, {
				name: gaWdnName,
				cookieDomain: unlDomain,
				allowLinker: true
			});
			ga(gaWdn+'require', 'linkid', 'linkid.js');
			ga(gaWdn+'set', gaDim + 3, version_dep);

			if (!initd) {
				idm.initialize(function() {
					$(domReady);
				});
			}

			initd = true;
		},

		callTrackPageview: function(thePage, trackInWDNAccount){
			var action = 'pageview', method = 'send', legacyMethod = '_trackPageview';

			if (!thePage) {
				ga(gaWdn+method, action);
				return;
			}

			if (trackInWDNAccount !== false) {
				trackInWDNAccount = true;
			}

			// First, track in the wdn analytics
			if (trackInWDNAccount) {
				ga(gaWdn+method, action, thePage);
			}

			// Second, track in local site analytics
			try {
				_gaq.push(function() {
					var tracker = getDefaultGATracker();
					if (tracker) {
						tracker[legacyMethod](thePage);
					}
				});

				ga(function() {
					var tracker = getDefaultAnalyticsTracker();
					if (tracker) {
						tracker[method](action, thePage);
					}
				});
			} catch(e) {
				WDN.log("Pageview tracking for local site didn't work.");
			}
		},

		callTrackEvent: function(category, action, label, value, noninteraction) {
			var action = 'event', method = 'send', legacyMethod = '_trackEvent', evtOpt;

			if (noninteraction !== true) {
				noninteraction = false;
			}

			evtOpt = {
				eventCategory: category,
				eventAction: action,
				eventLabel: label,
				eventValue: value,
				nonInteraction: noninteraction
			};

			ga(gaWdn+method, action, evtOpt);

			try {
				_gaq.push(function() {
					var tracker = getDefaultGATracker(), legacyValue = value;
					if (tracker) {
						if (typeof value !== "undefined") {
							legacyValue = Math.floor(value);
						}

						tracker[legacyMethod](category, action, label, legacyValue, noninteraction);
					}
				});

				ga(function() {
					var tracker = getDefaultAnalyticsTracker();
					if (tracker) {
						tracker[method](action, evtOpt);
					}
				});
			} catch(e) {
				WDN.log("Event tracking for local site didn't work.");
			}
		}
	};

	return Plugin;
});
