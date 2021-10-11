require(['dcf-notice'], function(DCFNoticeModule) {
	const noticeTheme = new DCFNoticeModule.DCFNoticeTheme();
	noticeTheme.setThemeVariable('noticeContainerClassList', [ 'dcf-relative' ]);
	noticeTheme.setThemeVariable('closeNoticeContainerClassList', [ 'dcf-absolute', 'dcf-pin-top', 'dcf-pin-right', 'dcf-z-1' ]);
	noticeTheme.setThemeVariable('closeNoticeBtnClassList', [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-white' ]);
	noticeTheme.setThemeVariable('closeNoticeBtnInnerHTML', '<span class="dcf-sr-only">Close this notice</span>' +
		'<svg class="dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24">' +
		'<path d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"></path>' +
		'<path d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"></path>' +
		'</svg>');
	var notice = new DCFNoticeModule.DCFNotice(noticeTheme);
	notice.initialize();
});

define([
	'jquery',
	'css!js-css/notices.css'
], function($) {
	var selectorNamespace = '.wdn_notice';
	var animationSpeed = 'slow';
	var defaultDuration = 1000;
	var durationMultiplier = 1000; // seconds to milliseconds
	var initd = false;

	var closeNotice = function($el) {
		$el.fadeOut(animationSpeed, function() {
			$el.remove();
		});
	};

	var Plugin = {
		initialize : function() {
			// prevent double initialiation
			if (!initd) {
				// globally listen for notice close button clicks
				$(document).on('click', selectorNamespace + ' .close', function() {
					closeNotice($(this).closest(selectorNamespace));
					return false;
				});

				initd = true;
			}

			$(Plugin.launch);
		},

		launch : function() {
			// check each existing notice for special interactive features
			$(selectorNamespace).each(function() {
				var $el = $(this);
				var durationMatch = 'duration';
				var isOverlay = false;
				var overlayMatch = 'overlay';
				var overlayHeader = 'header';
				var overlayMaincontent = 'maincontent';
				var overlayClass;
				var duration;

				// check for overlay changers
				overlayClass = overlayMatch + '-' + overlayHeader;
				if ($el.data(overlayMatch) === overlayHeader || $el.is('.' + overlayClass)) {
					isOverlay = true;
					$el.addClass(overlayMatch).removeClass(overlayClass);
					$('#' + overlayHeader).append($el);
				}

				overlayClass = overlayMatch + '-' + overlayMaincontent;
				if (!isOverlay && ($el.data(overlayMatch) === overlayMaincontent || $el.is('.' + overlayClass))) {
					isOverlay = true;
					$el.addClass(overlayMatch).removeClass(overlayClass);
					$('#' + overlayMaincontent).prepend($el);
				}

				// check for auto-closing duration
				if ($el.data(durationMatch) || $el.is('[class*=' + durationMatch + '-]')) {
					duration = $el.data(durationMatch) * durationMultiplier;

					if (isNaN(duration) || duration < 1) {
						$.each($el[0].classList || $el[0].className.split(/\s+/), function(i, className) {
							var classMatch = className.match(new RegExp('^' + durationMatch + '-(.+)$'))
							if (classMatch) {
								duration = classMatch[1] * durationMultiplier;
								return false;
							}
						});
					}

					if (isNaN(duration) || duration < 1) {
						duration = defaultDuration;
					}

					setTimeout(function() {
						closeNotice($el);
					}, duration);
				}
			});
		}
	};

	return Plugin;
});
