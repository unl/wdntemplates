define(['jquery', 'wdn', 'modernizr'], function($, WDN, Modernizr) {
	var initd = false,
		createSheet = function(media) {
			var style = document.createElement('style');
			style.appendChild(document.createTextNode(''));

			if (media) {
				style.setAttribute('media', media);
			}

			document.head.appendChild(style);

			return style.sheet;
		},
		addRule = function(sheet, selector, rules, index) {
			if (sheet.insertRule) {
				sheet.insertRule(selector + '{' + rules + '}', index);
			} else {
				sheet.addRule(selector, rules, index);
			}
		},
		removeRule = function(sheet, index) {
			if (! (sheet.cssRules || sheet.rules).length) {
				return;
			}

			if (sheet.deleteRule) {
				sheet.deleteRule(index || 0);
			} else {
				sheet.removeRule(index);
			}
		},

		mobileSheet,
		desktopSheet,

		eventScope = 'fixed.wdnAnchors',

		anchorSel = '.wdn-offset-anchor',
		defaultRule = 'border:0; position:relative;',
		fullNavMq = 'only screen and (min-width: 700px)';

	return {
		initialize: function() {
			if (initd) {
				return;
			}

			$(function() {
				$('#navigation').on(eventScope, function(e, offset) {
					var sheet, rule = defaultRule;
					if (!Modernizr.mq(fullNavMq)) {
						if (mobileSheet) {
							return;
						}
						sheet = mobileSheet = createSheet();
					} else {
						sheet = desktopSheet || createSheet(fullNavMq);
						desktopSheet = sheet;
					}

					removeRule(sheet);
					offset = offset * -1;
					try {
						rule += 'top:' + offset + 'px;';
						addRule(sheet, anchorSel, rule);
					} catch(e) {
						WDN.log(e);
					}
				});
			});

			initd = true;
		}
	};
});
