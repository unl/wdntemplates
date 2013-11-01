define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var setup = function() {
		if ($('ul.wdn_tabs').length) {
			WDN.initializePlugin('tabs');
		}
	};
	$(setup);

	var showBar = false,
	msg = 'This page may not be displayed correctly in this browser. ',
	url,
	$html = $('html');

	// old IE
	if ($html.hasClass('ie6') || $html.hasClass('ie7')) {
		showBar = true;
		msg += 'You are strongly encouraged to update. <a href="http://its.unl.edu/standards">Read More</a>';
		url = 'http://windows.microsoft.com/en-us/internet-explorer/download-ie';
	}

	// old stock android browser
	if (window.navigator.userAgent.match('Version/[1-4]\.') && window.navigator.userAgent.match('Mobile Safari')) {
		showBar = true;
		msg += 'You are strongly encouraged to use the Chrome Browser.';
		url = 'https://play.google.com/store/apps/details?id=com.android.chrome';
	}

	if (showBar) {
		WDN.loadJQuery(function() {
			require(['plugins/activebar/activebar2'], function() {
				$('<div>').html(msg)
					.activebar({
						icon: WDN.getTemplateFilePath('images/activebar-information.png', true),
						button: WDN.getTemplateFilePath('images/activebar-closebtn.png', true),
						url: url
					});
			});
		});
	}

	return setup;
});
