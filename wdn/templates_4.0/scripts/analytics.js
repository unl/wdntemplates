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

		defaultExt = '7z|aac|arc|arj|asf|asx|avi|bin|csv|docx?|exe|flv|gif|gz(?:ip)?|hqx|jar|jpe?g|js|m4v|mp(?:2|3|4|e?g)|mov(?:ie)?|msi|msp|pdf|phps|png|pptx?|qtm?|ra[mr]?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd|xlsx?|xml|z|zip',
		reOrigin = new RegExp('^https?://' + window.location.host + '(?=/)', 'i'),

		Plugin,
		initd = false,

		gaWdnName = 'wdn',
		gaWdn = gaWdnName + '.';

	var getParam = function(name) {
		return WDN.getPluginParam('analytics', name);
	};

	var bindLinks = function() {
		WDN.log('Begin binding links for analytics');

		var filetypes = getParam('extensions') || defaultExt,
			trackDownload = getParam('trackDownload'),
			reDownload = new RegExp('\\.(' + filetypes + ')(?:[\?#].*)?$', 'i'),
			trackMailto = getParam('trackMailto'),
			trackOutbound = getParam('trackOutbound');

		if (trackDownload !== false) {
			trackDownload = true;
		}

		if (trackMailto !== false) {
			trackMailto = true;
		}

		if (trackOutbound !== false) {
			trackOutbound = true;
		}

		$(document).on('click', 'a,area', function() {
			var ext;

			if (reOrigin.test(this.href)) {
				// this is an internal URL
				ext = reDownload.exec(this.href);
				if (ext) {
					if (trackDownload) {
						Plugin.calltrackEvent('Downloads', ext[1].toUpperCase(), this.href.replace(reOrigin, ''));
					}
				}
			} else {
				if (this.href.match(/^mailto:/i)) {
					if (trackMailto) {
						Plugin.callTrackEvent('Mails', 'Click', this.href.substring(7));
					}
				} else if (this.href.match(/^\w+:\/\//i)) {
					if (trackOutbound) {
						Plugin.callTrackEvent('Outbound links', 'Click', this.href);
					}
				}
			}
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
			WDN.log("WDN site analytics loaded") ;

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

					bindLinks();
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
		},

		callTrackTiming: function(category, variable, value, label, sampleRate) {
			var action = 'timing', method = 'send', legacyMethod = '_trackTiming';

			ga(gaWdn+method, action, category, variable, value, label);

			try {
				_gaq.push(function() {
					var tracker = getDefaultGATracker();
					if (tracker) {
						tracker[legacyMethod](category, variable, value, label, sampleRate);
					}
				});

				ga(function() {
					var tracker = getDefaultAnalyticsTracker();
					if (tracker) {
						tracker[method](action, category, variable, value, label);
					}
				});

			} catch (e) {
				WDN.log("Timing tracking for local site didn't work.");
			}
		}
	};

	return Plugin;
});
