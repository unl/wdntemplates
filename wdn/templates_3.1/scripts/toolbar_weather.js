WDN.toolbar_weather = function() {
	var weatherServer = 'http://www.unl.edu/';
    return {
        initialize : function(contentCallback) {
        	WDN.jQuery.ajax({
            	url: WDN.getTemplateFilePath('includes/tools/weather.html', true),
            	success: function(data) {
            		contentCallback(data);
            	},
            	error: function() {
            		contentCallback("An error occurred while loading this section");
            	}
            });
        },
        display : function() {
            var reqs = {
        		"#currentcond": weatherServer + WDN.getTemplateFilePath('includes/weatherCurrent.html'),
        		"#weatherforecast": weatherServer + WDN.getTemplateFilePath('includes/weatherForecast.html')
            };
            
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
