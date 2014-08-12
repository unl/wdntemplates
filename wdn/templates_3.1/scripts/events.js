/**
 * This plugin is intended to format calendar for pages. It takes the upcoming events feed found in the link rel=events
 * 
 */
WDN.events = function() {
	var getLocalEventSettings = function() {
		var $eventLink = WDN.jQuery('link[rel=events]'),
			eventParams = WDN.getPluginParam('events');
		if ($eventLink.length) {
			return {
				href: $eventLink[0].href,
				title: $eventLink[0].title
			};
		} else if (eventParams) {
			return eventParams;
		}
		
		return null;
	};
	
	return {
		limit : 10,
		
		calURL : false,
		
		calTitle : false,
		
		container : '#wdn_calendarDisplay',
		
		initialize : function() {
			WDN.loadJQuery(function() {
				WDN.events.setup();
			});
		},

		setup : function() {
			var localSettings = getLocalEventSettings() || {};
			if (!this.calURL) {
				this.calURL = localSettings.href;
			}
			
			if (!this.calTitle) {
				this.calTitle = localSettings.title || '';
			}
			
			if (localSettings.limit) {
				this.limit = localSettings.limit;
			}
			
			if (WDN.jQuery(this.container).length != 0) {
				WDN.jQuery(this.container).addClass('wdn_calendarDisplay');
				WDN.loadCSS(WDN.getTemplateFilePath('css/content/events.css'));
				WDN.loadJS(WDN.getTemplateFilePath('scripts/moment.min.js'), function() {
					WDN.events.getEvents();
				});
			}
		},
		getEvents : function() {
			var container = this.container;
			var calURL    = this.calURL;
			var calTitle  = this.calTitle;
			WDN.jQuery.getJSON(this.calURL+'upcoming/?format=json&limit='+this.limit, null, function(data, textStatus) {
					WDN.events.container = container;
					WDN.events.calURL    = calURL;
					WDN.events.calTitle  = calTitle;
					WDN.events.display(data, textStatus);
				}
			);			
		},
		display : function(data, textStatus) {
			var $container = WDN.jQuery(this.container).addClass('wdn-calendar');
			$container.hide();

			$container.append(WDN.jQuery('<div/>', {'class': 'upcoming-header'}).html('Upcoming Events:'));

			var events_html = '';
			WDN.jQuery.each(data.Events.Event || data.Events, function(index, event) {
				var startDate;
				if (event.DateTime.Start) {
					startDate = moment(event.DateTime.Start);
				} else {
					//legacy
					startDate = moment(event.DateTime.StartDate +  'T' + event.DateTime.StartTime.substring(0, event.DateTime.StartTime.length - 1));
				}
				var month    = '<span class="month">' + startDate.format('MMM') + '</span> ';
				var day      = '<span class="day">' + startDate.format('D') + '</span> ';
				var time     = '<span class="time">' + startDate.format('h:mm a') + '</span> ';
				var eventURL = '';
				if (WDN.jQuery.isArray(event.WebPages)) {
					eventURL = event.WebPages[0].URL
				} else if (WDN.jQuery.isArray(event.WebPages.WebPage)) {
					eventURL = event.WebPages.WebPage[0].URL
				} else {
					eventURL = event.WebPages.WebPage.URL;
				}
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
				events_html += '<div class="event">' + date + info  + '</div>';
			});
			$container.append('<div class="events">' + events_html + '</div>');
            $container.append('<span class="see-all-events"><a href="'+this.calURL+'upcoming/">See all '+this.calTitle+' events</a></span>');
			var ics = '<a class="ics" href="' + this.calURL + 'upcoming/?format=ics">ICS</a>';
			var rss = '<a class="rss" href="' + this.calURL + 'upcoming/?format=ics">RSS</a>';
			var feeds = '<div class="feeds">' + ics + rss + '</div>';
			$container.append(feeds);
			$container.show();
		}
	};
}();