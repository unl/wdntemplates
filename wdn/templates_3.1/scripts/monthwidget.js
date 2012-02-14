/**
 * This plugin is intended to format calendar for pages. It takes the upcoming events feed found in the link rel=events
 * 
 */
WDN.monthwidget = function() {
	return {
		calURL : false,
		
		container : '#monthwidget',
		
		initialize : function() {
			WDN.loadJQuery(function() {
				WDN.monthwidget.setup();
			});
		},

		setup : function() {
			if (!this.calURL) {
				this.calURL = WDN.jQuery('link[rel=events]').attr('href');
			}
			
			if (WDN.jQuery(this.container).length) {
				WDN.loadCSS(WDN.getTemplateFilePath('css/content/monthwidget.css'));
				this.getEvents();
			}
		},
		getEvents : function() {
			var container = this.container;
			var calURL    = this.calURL;
			var __self    = this;
			WDN.jQuery.get(this.calURL+'?monthwidget&format=hcalendar', function(data) {
					__self.container = container;
					__self.calURL    = calURL;
					__self.display(data);
				}
			);
		},
		display : function(data) {
			var $container = WDN.jQuery(this.container);
			$container.hide().html(data);
			WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/hoverIntent/jQuery.hoverIntent.min.js'), function() {
				var now = new Date(), today = now.getDate();
				var month = WDN.jQuery('span.monthvalue a', $container).attr('href');
				month = month.substr(month.length - 3, 2);
				if (month.charAt(0) == '/') {
					month = month.substr(1);
				}
				
				var $days = WDN.jQuery('tbody td', $container);
				
				if (month - 1 == now.getMonth()) {
					$days.not('.prev, .next').each(function() {
						var $this = WDN.jQuery(this);
						if ($this.text() == today) {
							$this.addClass('today').append('<div class="today_image"/>');
							return false;
						}
					});
				}
				
				$days.has('a').hoverIntent({
                    over: function() {
                    	var infoBox = WDN.jQuery('.eventContainer', this);
                    	if (infoBox.length) {
                    		infoBox.show();
                    	} else {
                    		infoBox = WDN.jQuery('<div class="eventContainer"><div class="eventBox">Loading...</div></div>');
                    		infoBox.appendTo(this);
                    		if (WDN.jQuery(this).position().left + WDN.jQuery(this).width() + infoBox.width() 
                    			>= WDN.jQuery(infoBox[0].offsetParent).outerWidth()) {
                    			infoBox.addClass('pos2');
                    		}
                    		var eventBox = WDN.jQuery('.eventBox', this);
                    		WDN.jQuery.ajax({
                    			url: WDN.jQuery('a', this)[0].href + '?format=xml',
                    			dataType: 'xml',
                    			success: function(data) {
	                    			var eventTitle = WDN.jQuery('EventTitle', data);
	                    			var eventWebPageTitle = WDN.jQuery('Title', data);
	                    			var eventURL = [];
	                    			var startDate = WDN.jQuery('StartDate', data).eq(0).text();
	                    			
	                    			eventBox.empty().append('<h1>' + startDate + '</h1>');
	                    			eventWebPageTitle.each(function() {
	                    				var $this = WDN.jQuery(this);
	                    				if ($this.text() == 'Event Instance URL') {
	                    					eventURL.push($this.next().text());
	                    				}
	                    			});
	                    			WDN.jQuery.each(eventURL, function(i, url) {
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
                    	WDN.jQuery('.eventContainer', this).hide();
                    	return false;
                    },
                    timeout: 100
                });
				
				$container.show();
            });
		}
	};
}();