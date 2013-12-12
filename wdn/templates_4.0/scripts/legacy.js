define(['jquery', 'wdn', 'require', 'modernizr'], function($, WDN, require, Modernizr) {
	var setup = function() {
		if ($('ul.wdn_tabs').length) {
			WDN.initializePlugin('tabs');
		}
	};
	$(setup);

	// shim CSS that needs calc function
	if (!Modernizr.csscalc) {
		var update = function() {
			if (Modernizr.mediaqueries && Modernizr.mq('(max-width: 699px)')) {
				var element = $('#wdn_site_title'),
				newValue = element.parent().width() * 1 - 45;
				element.css('width', newValue + 'px');
			}
		};

		$(window).resize(update);
		update();
	}

	var showBar = false,
	msg = '', url,
	$html = $('html'),
	reXPAgent = /Windows (?:NT 5.1|XP)/,
	setCookie = false,
	xpCookie = 'unlXPAck',
	xpCookieLifetime = 30 * 24 * 60 * 60; // 30 days in seconds

	if (window.navigator.userAgent.match(reXPAgent) && !WDN.getCookie(xpCookie)) {
		showBar = true;
		setCookie = true;
		msg += 'According to Microsoft, your operating system (Windows XP) is reaching its "end of life". You are strongly encouraged to upgrade.';
		url = 'http://www.unl.edu/helpcenter/xp';
	}

	// old IE
	if ($html.hasClass('ie6') || $html.hasClass('ie7')) {
		if (showBar) {
			msg += '<br />';
		} else {
			showBar = true;
			url = 'http://windows.microsoft.com/en-us/internet-explorer/download-ie';
		}
		msg += 'This page may not be displayed correctly in this browser. You are strongly encouraged to update. <a href="http://its.unl.edu/standards">Read More</a>';
	}

	if (showBar) {
		WDN.loadJQuery(function() {
			require(['plugins/activebar/activebar2'], function() {
				var cnt = $('<div>').html(msg);
				cnt.activebar({
					icon: WDN.getTemplateFilePath('images/activebar-information.png', true),
					button: WDN.getTemplateFilePath('images/activebar-closebtn.png', true),
					url: url
				});

				if (setCookie) {
					cnt.parent().siblings('.close').click(function() {
						WDN.setCookie(xpCookie, 1, xpCookieLifetime);
					});
				}
			});
		});
	}

	return setup;
});
