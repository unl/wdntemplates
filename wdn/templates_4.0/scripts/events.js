define(['jquery', 'wdn', 'require', 'moment'], function($, WDN, require, moment) {
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
		$container.append('<span class="subhead"><a href="'+config.url+'upcoming/">See all '+config.title+' events</a></span>');

		$container.append('<div class="events">');
		$.each(data.Events, function(index, event) {
			var startDate = moment(event.DateTime.StartDate);
			var month    = '<span class="month">' + startDate.format('MMM') + '</span>';
			var day      = '<span class="day">' + startDate.format('d') + '</span>';
			var time     = '<span class="time">' + startDate.format('h:mm a') + '</span>';
			var title    = '<a class="title" href="'+ event.WebPages[0].URL +'">' + event.EventTitle + '</a>';
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
			$container.append('<div class="event">' + date + info  + '</div>');
		});
		$container.append('</div>');
		var ics = '<a class="ics" href="' + config.url + 'upcoming/?format=ics">ICS</a>';
		var rss = '<a class="rss" href="' + config.url + 'upcoming/?format=ics">RSS</a>';
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
			WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/events.css'));
			$.get(localConfig.url + 'upcoming/?format=json&limit=' + encodeURIComponent(localConfig.limit), function(data) {
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
