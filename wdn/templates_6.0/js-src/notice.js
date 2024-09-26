require(['dcf-notice'], function(DCFNoticeModule) {
	const noticeTheme = new DCFNoticeModule.DCFNoticeTheme();
	noticeTheme.setThemeVariable('noticeContainerClassList', [ 'dcf-d-grid', 'dcf-w-max-xl', 'dcf-ml-auto', 'dcf-mr-auto', 'dcf-mb-6', 'dcf-rounded' ]);
	noticeTheme.setThemeVariable('closeNoticeInfoIconInnerHTML', '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm-.5 4.8c.7 0 1.2.6 1.2 1.2s-.6 1.2-1.2 1.2-1.3-.5-1.3-1.2.6-1.2 1.3-1.2zM15 19.2H9c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h2.2v-7.5H10c-.4 0-.8-.3-.8-.8s.4-.5.8-.5h2c.2 0 .4.1.5.2.1.1.2.3.2.5v8.2H15c.4 0 .8.3.8.8s-.4.7-.8.7z"/></svg>');
	noticeTheme.setThemeVariable('closeNoticeSuccessIconInnerHTML', '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 9L10 16c-.1.1-.3.2-.5.2s-.4-.1-.5-.2l-2.5-2.5c-.1-.1-.2-.3-.2-.5s.1-.4.2-.5c.3-.3.8-.3 1.1 0l2 2 7-6.5c.1-.1.3-.2.5-.2s.4.1.5.2c.2.3.2.8-.1 1z"/></svg>');
	noticeTheme.setThemeVariable('closeNoticeWarningIconInnerHTML', '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M22.9 22.3l-11-22c-.2-.3-.7-.3-.9 0l-11 22c-.1.3.1.7.5.7h22c.4 0 .6-.4.4-.7zM10.8 8.1c0-.4.3-.7.8-.7.2 0 .4.1.5.2.1.1.2.3.2.5v7.7c0 .2-.1.4-.2.5-.1.1-.3.2-.5.2-.4 0-.7-.3-.8-.7V8.1zm.7 12.2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z"/></svg>');
	noticeTheme.setThemeVariable('closeNoticeDangerIconInnerHTML', '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M23.9 7L17.1.2c-.1-.1-.3-.2-.4-.2H7.2c-.1 0-.2.1-.3.1L.1 7c0 .1-.1.2-.1.3v9.5c0 .1.1.3.1.4l6.7 6.7c.2 0 .3.1.4.1h9.5c.1 0 .3-.1.4-.1l6.8-6.7c.1-.1.1-.2.1-.4V7.3c0-.1-.1-.2-.1-.3zM17 16c.3.3.3.8 0 1.1-.1.1-.3.2-.5.2s-.4-.1-.5-.3l-4-4-4 4c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1l4-4L7 8c-.2-.1-.2-.3-.2-.5s0-.4.2-.5c.3-.3.7-.3 1 0l4 4 4-4c.3-.3.8-.3 1.1 0 .1.1.2.3.2.5s-.1.4-.2.5l-4 4 3.9 4z"/></svg>');
	noticeTheme.setThemeVariable('closeNoticeBtnClassList', [ 'dcf-btn', 'dcf-btn-inverse-tertiary', 'dcf-lh-1' ]);
	noticeTheme.setThemeVariable('closeNoticeBtnInnerHTML', '<span class="dcf-sr-only">Close this notice</span><svg class="dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M23.707 22.293L13.414 12 23.706 1.707A.999.999 0 1022.292.293L12 10.586 1.706.292A1 1 0 00.292 1.706L10.586 12 .292 22.294a1 1 0 101.414 1.414L12 13.414l10.293 10.292a.999.999 0 101.414-1.413z"/><path fill="none" d="M0 0h24v24H0z"/></svg>');
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
