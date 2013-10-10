define(['jquery', 'wdn', 'require'], function($, WDN, require) {
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
		$container.hide().html(data);
		$('h4', $container).replaceWith(function() {
			var heading = $('<div/>', {'class': 'upcoming-header'}).append($(this).contents());
			return heading.add('<span class="subhead"><a href="'+config.url+'upcoming/">See all '+config.title+' events</a></span>');
		});
		$('#feeds, #icsformat, #rssformat', $container).each(function() {
			$(this).addClass($(this).attr('id')).removeAttr('id');
		});
		$('abbr', $container).each(function() {
			// Convert the date and time into something we want.
			var eventdate = $(this).html();
			var month,day,time = '';
			var xp = new RegExp(/[A-Za-z]{3,3}/);
			if (xp.test(eventdate)) {
				month = '<span class="month">'+xp.exec(eventdate)+'</span>';
			}
			eventdate.replace(xp.exec(eventdate),'');
			xp = new RegExp(/[\d]+:[\d]+\s?[a,p]m/);
			if (xp.test(eventdate)) {
				time = '<span class="time">'+xp.exec(eventdate)+'</span>';
			}
			time = time.replace('0 ','0');
			xp = new RegExp(/([\d]{1,2})[a-z]{2}/);
			if (xp.test(eventdate)) {
				day = '<span class="day">'+xp.exec(eventdate)[1]+'</span>';
			}
			$(this).replaceWith('<div>'+month+' '+day+' '+time+'</div>');
		});
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
		localConfig = $.extend({}, config, defaultConfig);
		
		if (localConfig.url && $(localConfig.container).length) {
			$(this.container).addClass('wdn-calendar');
			WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/events.css'));
			$.get(localConfig.url + 'upcoming/?format=hcalendar&limit=' + encodeURIComponent(localConfig.limit), function(data) {
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
