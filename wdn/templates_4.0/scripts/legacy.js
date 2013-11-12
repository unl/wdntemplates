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
	msg = 'This page may not be displayed correctly in this browser. ',
	url,
	$html = $('html');

	// old IE
	if ($html.hasClass('ie6') || $html.hasClass('ie7')) {
		showBar = true;
		msg += 'You are strongly encouraged to update. <a href="http://its.unl.edu/standards">Read More</a>';
		url = 'http://windows.microsoft.com/en-us/internet-explorer/download-ie';
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
