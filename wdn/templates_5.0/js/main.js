// WDN must be loaded synchronously for BC and config support
requirejs.config({
	baseUrl: WDN.getTemplateFilePath('scripts', true),
	map: {
		"*": {
			css: 'require-css/css'
		}
	}
});

require(['jquery'], function($) {
	$(document).ready(function() {
		var menu_shown_at_small = false;
		var unl_primary_nav = $('#unl-primary-nav');

		$('#dcf-menu-toggle').click(function (click) {
			click.preventDefault();
			unl_primary_nav.css('bottom', (-1 * unl_primary_nav.height() - 10) + 'px');
			unl_primary_nav.show();
			unl_primary_nav.animate({
				bottom: 0
			}, 350);
			menu_shown_at_small = true;
		});

		$('#unl-primary-nav-close').click(function (click) {
			click.preventDefault();
			unl_primary_nav.animate({
				bottom: (-1* $('#unl-primary-nav').height() - 10)
			}, 350, function() {
				unl_primary_nav.hide();
				unl_primary_nav.css('bottom', 0);
			});
			menu_shown_at_small = false;
		});

		$(window).resize(function (resize) {
			if ($(window).width() / parseFloat($("body").css("font-size")) < 55.925) {
				if (menu_shown_at_small) {
					unl_primary_nav.show();
				} else {
					unl_primary_nav.hide();
				}
			} else {
				unl_primary_nav.show();
			}
		});
	});
});