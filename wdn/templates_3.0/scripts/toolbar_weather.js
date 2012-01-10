WDN.toolbar_weather = function() {
    return {
        initialize : function() {},
        setupToolContent : function(contentCallback) {
        	WDN.jQuery.ajax({
            	url: WDN.template_path + 'wdn/templates_3.0/includes/tools/weather.html',
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
        		"#currentcond": "http://www.unl.edu/wdn/templates_3.0/includes/weatherCurrent.html",
        		"#weatherforecast": "http://www.unl.edu/wdn/templates_3.0/includes/weatherForecast.html"
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
