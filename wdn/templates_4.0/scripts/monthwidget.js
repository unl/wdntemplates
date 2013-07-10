/**
 * This plugin is intended to format calendar for pages. It takes the upcoming events feed found in the link rel=events
 * 
 */
define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var getLocalEventSettings = function() {
		var $eventLink = $('link[rel=events]'),
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
	},
	container = '#monthwidget';
	
	var display = function(data, config) {
		var $container = $(config.container);
		$container.hide().html(data);
		$('#prev_month', $container).removeAttr('id').addClass('prev');
		$('#next_month', $container).removeAttr('id').addClass('next');
		
		require(['./plugins/hoverIntent/jquery.hoverIntent.min'], function() {
			var now = new Date(), today = now.getDate();
			var month = $('span.monthvalue a', $container).attr('href');
			month = month.substr(month.length - 3, 2);
			if (month.charAt(0) == '/') {
				month = month.substr(1);
			}
			
			var $days = $('tbody td', $container);
			
			if (month - 1 == now.getMonth()) {
				$days.not('.prev, .next').each(function() {
					var $this = $(this);
					if ($this.text() == today) {
						$this.addClass('today').append('<div class="today_image"/>');
						return false;
					}
				});
			}
			
			$days.has('a').hoverIntent({
                over: function() {
                	var infoBox = $('.eventContainer', this);
                	if (infoBox.length) {
                		infoBox.show();
                	} else {
                		infoBox = $('<div class="eventContainer"><div class="eventBox">Loading...</div></div>');
                		infoBox.appendTo(this);
                		if ($(this).position().left + $(this).width() + infoBox.width() 
                			>= $(infoBox[0].offsetParent).outerWidth()) {
                			infoBox.addClass('pos2');
                		}
                		var eventBox = $('.eventBox', this);
                		$.ajax({
                			url: $('a', this)[0].href + '?format=xml',
                			dataType: 'xml',
                			success: function(data) {
                    			var eventTitle = $('EventTitle', data);
                    			var eventWebPageTitle = $('Title', data);
                    			var eventURL = [];
                    			var startDate = $('StartDate', data).eq(0).text();
                    			
                    			eventBox.empty().append('<h1>' + startDate + '</h1>');
                    			eventWebPageTitle.each(function() {
                    				var $this = $(this);
                    				if ($this.text() == 'Event Instance URL') {
                    					eventURL.push($this.next().text());
                    				}
                    			});
                    			$.each(eventURL, function(i, url) {
                    				eventBox.append('<a href="' + url + '">' + eventTitle.eq(i).text() + '</a>');
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
        });
	};
	
	var setup = function(config) {
		var localSettings = getLocalEventSettings(),
		defaultConfig = {
			url: localSettings.href,
			container: container
		},
		localConfig = $.extend({}, config, defaultConfig);
		
		if ($(localConfig.container).length) {
			WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/monthwidget.css'));
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
