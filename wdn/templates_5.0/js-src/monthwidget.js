define([
	'wdn',
	'jquery',
	'moment',
	'plugins/hoverIntent/jquery.hoverIntent',
	'css!js-css/monthwidget'
], function(WDN, $, moment) {
	var initd = true;

	var getLocalEventSettings = function() {
		var $eventLink = $('link[rel=events]'),
			eventParams = WDN.getPluginParam('events');

		if ($eventLink.length) {
			return {
				href: $eventLink[0].href,
				title: $eventLink[0].title
			};
		}

		return eventParams || {};
	},
	container = '#monthwidget',
	defaultCal = 'https://events.unl.edu/';

	var display = function(data, config) {
		var $container = $(config.container);
		$container.hide().html(data);
		$('#prev_month', $container).removeAttr('id').addClass('prev');
		$('#next_month', $container).removeAttr('id').addClass('next');

		var now = new Date(), today = now.getDate();
		var month = $('span.monthvalue a', $container).attr('href');
		month = month.substr(month.length - 3, 2);
		if (month.charAt(0) == '/') {
			month = month.substr(1);
		}

		var $days = $('tbody td', $container).not('.prev, .next');

		if (month - 1 == now.getMonth()) {
			$days.each(function() {
				var $this = $(this);
				if ($this.text() == today) {
					$this.addClass('today');
					return false;
				}
			});
		}

		$days.wrapInner('<div/>');

		$days.has('a').hoverIntent({
			over: function() {
				var infoBox = $('.eventContainer', this);
				if (infoBox.length) {
					infoBox.show();
				} else {
					infoBox = $('<div class="eventContainer dcf-absolute dcf-z-1 dcf-pt-3 dcf-pb-3 dcf-txt-left dcf-bg-white dcf-bt-3 dcf-bt-solid unl-bt-scarlet"><div class="eventBox">Loading...</div></div>');
					infoBox.appendTo($('div:first', this));
					if ($(this).position().left + $(this).width() + infoBox.width() >= $($container[0].offsetParent).outerWidth()) {
						infoBox.addClass('pos2');
					}
					var eventBox = $('.eventBox', this);
					var regex = /\d{4}\/\d{1,2}\/\d{1,2}/;
					var date = moment(regex.exec($('a', this)[0].href)[0]);
					$.ajax({
						url: $('a', this)[0].href + '?format=xml',
						dataType: 'xml',
						success: function(data) {
							var eventTitle = $('EventTitle', data);
							var eventWebPageTitle = $('Title', data);
							var eventURL = [];
              eventBox.empty();

							eventWebPageTitle.each(function() {
								var $this = $(this);
								if ($this.text() == 'Event Instance URL') {
									eventURL.push($this.next().text());
								}
							});
							$.each(eventURL, function(i, url) {
								eventBox.append('<a class="dcf-d-block dcf-mr-6 dcf-ml-6 dcf-pt-1 dcf-pb-1 dcf-txt-xs dcf-lh-2" href="' + url + '">' + eventTitle.eq(i).text() + '</a>');
							});
						},
						error: function() {
							eventBox.html('Error loading results.');
						}
					});
				}
				return false;
			},
			sensitivity: 3,
			out: function() {
				$('.eventContainer', this).hide();
				return false;
			},
			timeout: 100
		});

		$container.show();
	};

	var setup = function(config) {
		var localSettings = getLocalEventSettings(),
		defaultConfig = {
			url: localSettings.href || defaultCal,
			container: container
		},
		localConfig = $.extend({}, defaultConfig, config);

		// ensure that the URL we are about to use is forced into an https:// protocol. (add https if it starts with //)
        if (localConfig.url && localConfig.url.match(/^\/\//)) {
            localConfig.url = 'https:' + localConfig.url;
        } else if (localConfig.url && localConfig.url.match(/^http:\/\//)) {
            localConfig.url = localConfig.url.replace('http://', 'https://');
        }

		if (localConfig.url && $(localConfig.container).length) {
			$.get(localConfig.url + '?monthwidget&format=hcalendar', function(data) {
					display(data, localConfig);
				}
			);
		}
	};

	return {
		initialize : function(config) {
			$(function() {
				setup(config);
			});
		},

		setup : setup,
	};
});
