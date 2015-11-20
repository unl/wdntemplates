define([
	'wdn',
	'jquery',
	'moment',
	'css!js-css/events'
], function(WDN, $, moment) {
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
	container = '#wdn_calendarDisplay',
	defaultCal = '//events.unl.edu/';

	var display = function(data, config) {
		var $container = $(config.container).addClass('wdn-calendar');
		$container.hide();

		$container.append($('<div/>', {'class': 'upcoming-header'}).html('Upcoming Events'));

		var events_html = '';
		$.each(data.Events.Event || data.Events, function(index, event) {
			var startDate;
			if (event.DateTime.Start) {
				startDate = moment.parseZone(event.DateTime.Start);
			} else {
				//legacy
				startDate = moment.parseZone(event.DateTime.StartDate +  'T' + event.DateTime.StartTime.substring(0, event.DateTime.StartTime.length - 1));
			}
			var eventURL = '';
			if ($.isArray(event.WebPages)) {
				eventURL = event.WebPages[0].URL
			} else if ($.isArray(event.WebPages.WebPage)) {
				eventURL = event.WebPages.WebPage[0].URL
			} else {
				eventURL = event.WebPages.WebPage.URL;
			}
			var month    = '<span class="month">' + startDate.format('MMM') + '</span>';
			var day      = '<span class="day">' + startDate.format('D') + '</span>';
			var time     = '<span class="time">' + startDate.format('h:mm a') + '</span>';
			var title    = '<a class="title" href="'+ eventURL +'">' + event.EventTitle + '</a>';
			var location = '';

			if (event.Locations[0] !== undefined && event.Locations[0].Address.BuildingName) {
				location =  '<span class="location">';
				if (event.Locations[0].MapLinks[0]) {
					location += '<a href="'+ event.Locations[0].MapLinks[0] +'">';
				}
				location += event.Locations[0].Address.BuildingName
				if (event.Locations[0].MapLinks[0]) {
					location += '</a>';
				}
				location += '</span>';
			}

			var info = '<div class="info">' + title + location  + '</div>';
			var date = '<div class="date">' + month + day + time +'</div>';
			events_html += ('<div class="event">' + date + info  + '</div>');
		});
		$container.append('<div class="events">' + events_html + '</div>');
		$container.append('<span class="see-all"><a href="'+config.url+'upcoming/">See all '+config.title+' events</a></span>');

		var ics = '<a class="ics" href="' + config.url + 'upcoming/?format=ics">ICS</a>';
		var rss = '<a class="rss" href="' + config.url + 'upcoming/?format=rss">RSS</a>';
		var feeds = '<div class="feeds">' + ics + rss + '</div>';
		$container.append(feeds);
		$container.show();
	};

	var setup = function(config) {
		var localSettings = getLocalEventSettings(),
		defaultConfig = {
			title: localSettings.title || '',
			url: localSettings.href || defaultCal,
			container: container,
			limit: localSettings.limit || 10
		},
		localConfig = $.extend({}, defaultConfig, config);

		if (localConfig.url && $(localConfig.container).length) {
			$(this.container).addClass('wdn-calendar');
			$.getJSON(localConfig.url + 'upcoming/?format=json&limit=' + encodeURIComponent(localConfig.limit), function(data) {
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

		setup : setup
	};
});
