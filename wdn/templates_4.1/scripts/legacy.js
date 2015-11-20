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

	var $html = $('html'),
	campusSvc = '//www.unl.edu/static/oncampus.js',
	campusSvcCallback = 'wdnCampusCallback',
	reXPAgent = /Windows (?:NT 5\.[12]|XP)/,
	xpCookie = 'unlXPAck',
	xpCookieLifetime = 14 * 24 * 60 * 60, // 14 days in seconds
	msgs = {
		'windowsxp': window.navigator.userAgent.match(reXPAgent) && !WDN.getCookie(xpCookie),
		'oldie': $html.hasClass('ie6') || $html.hasClass('ie7') || $html.hasClass('ie8')
	},
	showBar = function() {
		for (var i in msgs) {
			if (msgs[i]) {
				return true;
			}
		}

		return false;
	}();

	if (showBar) {
		require(['plugins/activebar/activebar2'], function() {
			$(function() {
				var cnt = $('<div/>'), content = [],
				url, tempCnt, xpGo, afterActivebar = function() {},
				go = function() {
					cnt.append(content);
					cnt.activebar({
						icon: WDN.getTemplateFilePath('images/activebar-information.png', true),
						button: WDN.getTemplateFilePath('images/activebar-closebtn.png', true),
						url: url
					});
				};

				if (msgs.windowsxp) {
					tempCnt = $('<div/>');
					content.push(tempCnt[0]);
					xpGo = function() {
						tempCnt.html('Windows XP will no longer be maintained by Microsoft or supported at UNL after April 8, 2014. You are strongly encouraged to upgrade.');
						url = 'http://www.unl.edu/helpcenter/xp';

						if ($.fn.activebar.container) {
							$.fn.activebar.container.off('click').on('click', function() {
								window.location.href = url;
							});
						} else {
							go();
						}

						$.fn.activebar.container.find('.close').click(function() {
							WDN.setCookie(xpCookie, 1, xpCookieLifetime);
						});
					};

					window[campusSvcCallback] = function(data) {
						if (data == 'YES') {
							xpGo();
						}
						window[campusSvcCallback] = null;
					};
					$.ajax({
						url: campusSvc,
						dataType: 'jsonp',
						jsonpCallback: campusSvcCallback
					});
				}

				if (msgs.oldie) {
					content.push($('<div/>').html('This page may not be displayed correctly in this browser. You are strongly encouraged to update. <a href="http://its.unl.edu/standards">Read More</a>')[0]);
					url = 'http://windows.microsoft.com/en-us/internet-explorer/download-ie';
					go();
				}

				afterActivebar();
			});
		});
	}

	return setup;
});
