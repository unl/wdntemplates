WDN.toolbar_weather = function() {
    return {
        initialize : function() {
            
        },
        setupToolContent : function() {
            return '<div class="col left"><h3>Local Weather</h3><div id="currentcond" class="toolbarMask"></div></div><div class="col middle"><h3>Lincoln Forecast</h3><div id="weatherforecast" class="toolbarMask"></div></div><div class="two_col right"><h3>Local Radar</h3><div id="showradar"><a href="http://radar.weather.gov/radar_lite.php?rid=oax&product=N0R&overlay=11101111&loop=yes"><img src="'+WDN.template_path+'wdn/templates_3.0/css/images/transpixel.gif" /></a></div></div>';
        },
        display : function() {
            WDN.jQuery('#showradar img').css({background:'url(http://radar.weather.gov/lite/N0R/OAX_loop.gif)  -5px -140px no-repeat'});
            
            var reqs = {
        		"#currentcond": "http://www.unl.edu/wdn/templates_3.0/scripts/weatherCurrent.html",
        		"#weatherforecast": "http://www.unl.edu/wdn/templates_3.0/scripts/weatherForecast.html"
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
        },
    };
}();
