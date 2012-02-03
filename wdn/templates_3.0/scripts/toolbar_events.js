WDN.toolbar_events = function() {
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
		initialize : function() {},
		setupToolContent : function(contentCallback) {
			WDN.jQuery.ajax({
            	url: WDN.getTemplateFilePath('includes/tools/events.html', true),
            	success: function(data) {
            		var $tempDiv = WDN.jQuery('<div/>').append(data),
            			localSettings = getLocalEventSettings();
            		
            		if (localSettings) {
            			try {
            				WDN.jQuery('.events_local_label', $tempDiv).text(localSettings.title);
            				WDN.jQuery('.events_local_link', $tempDiv).attr('href', localSettings.href + '/upcoming/');
            				WDN.jQuery('.events_local_rss', $tempDiv).attr('href', localSettings.href + '/upcoming/?format=rss');
            			} catch (e) {}
            		}
            		
            		contentCallback($tempDiv.children());
            	},
            	error: function() {
            		contentCallback("An error occurred while loading this section");
            	}
            });
		},
		display : function() {
			var reqs = {
        		'#allunlevents': 'http://events.unl.edu/?format=hcalendar'
            }, localSettings = getLocalEventSettings();
			
			if (localSettings) {
				reqs['#localsiteevents'] = localSettings.href + '/upcoming/?format=hcalendar';
			}
			
			WDN.jQuery.each(reqs, function(id, url) {
	            WDN.jQuery.ajax({
	            	url: url,
	            	success: function(data) {
	            		WDN.jQuery(id).html(data);
	            	},
	            	error: function() {
	            		WDN.jQuery(id).html('Error loading results');
	            	}
	            });
            });
		}
	};
}();
