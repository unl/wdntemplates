define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	"use strict";

	var setup = function() {
		if ($('ul.wdn_tabs').length) {
			WDN.initializePlugin('tabs');
		}
	};
	$(setup);

	var minIEVersion = 10;
	var ie = (function() {
		var v = 3;
		var div = document.createElement( 'div' );
		var all = div.getElementsByTagName( 'i' );
		do {
	  		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
		}
		while (all[0]);

		return v > 4 ? v : document.documentMode;
	}());

	var reXPAgent = /Windows (?:NT 5\.[12]|XP)/;
	var xpCookie = 'unlXPAck';
	var xpCookieLifetime = 14 * 24 * 60 * 60; // 14 days in seconds
	var msgs = {
		"windowsxp":  {
			"enabled": window.navigator.userAgent.match(reXPAgent) && !WDN.getCookie(xpCookie),
			"html": "Windows XP is no longer maintained by Microsoft or supported at UNL since April 8, 2014. You are strongly encouraged to upgrade.",
			"url": "http://its.unl.edu/helpcenter/upgrade-windows-xp"
		},
		"oldie": {
			"enabled": ie && ie < minIEVersion,
			"html": "This page may not be displayed correctly in this browser. You are strongly encouraged to update. <a href=\"hhttp://its.unl.edu/supported-technology-standards-end-life-software\">Read More</a>",
			"url": "http://windows.microsoft.com/en-us/internet-explorer/download-ie"
		}
	};
	var showBar = (function() {
		for (var i in msgs) {
			if (msgs[i].enabled) {
				return true;
			}
		}

		return false;
	}());

	if (showBar) {
		require(['plugins/activebar/activebar2'], function() {
			$(function() {
				var cnt = $('<div/>');
				var content = [];
				var url;
				var tempCnt;
				var afterActivebar = function() {};
				var go = function() {
					cnt.append(content);
					cnt.activebar({
						icon: WDN.getTemplateFilePath('images/activebar-information.png', true),
						button: WDN.getTemplateFilePath('images/activebar-closebtn.png', true),
						url: url
					});
				};

				if (msgs.windowsxp.enabled) {
					content.push($('<div/>').html(msgs.windowsxp.html)[0]);
					url = msgs.windowsxp.url;

					afterActivebar = function() {
						$.fn.activebar.container.find('.close').click(function() {
							WDN.setCookie(xpCookie, 1, xpCookieLifetime);
						});
					};
				}

				if (msgs.oldie.enabled) {
					content.push($('<div/>').html(msgs.oldie.html)[0]);
					url = msgs.oldie.url;
				}

				go();
				afterActivebar();
			});
		});
	}

	return setup;
});
