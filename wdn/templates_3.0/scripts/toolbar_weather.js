WDN.toolbar_weather = function() {
    var weatherreq = new WDN.proxy_xmlhttp();
    var forecastreq = new WDN.proxy_xmlhttp();
    return {     
    	initialize : function() {
    		
    	},
    	setupToolContent : function() {
    		return '<div class="col"><h3>Local Weather</h3><div id="currentcond"></div></div><div class="col middle"><h3>Lincoln Forecast</h3><div id="weatherforecast"></div></div><div class="two_col"><h3>Local Radar</h3><div id="showradar"><a href="http://radar.weather.gov/radar_lite.php?rid=oax&product=N0R&overlay=11101111&loop=yes"><img src="/wdn/templates_3.0/css/images/transpixel.gif" /></a></div></div>';
    	},
        display : function() {
        	var weatherurl = "http://www.unl.edu/wdn/templates_3.0/scripts/weatherCurrent.html";
        	weatherreq.open("GET", weatherurl, true);
        	weatherreq.onreadystatechange = WDN.toolbar_weather.updateWeatherResults;
        	weatherreq.send(null);
        	var forecasturl = "http://www.unl.edu/wdn/templates_3.0/scripts/weatherForecast.html";
        	forecastreq.open("GET", forecasturl, true);
        	forecastreq.onreadystatechange = WDN.toolbar_weather.updateForecast;
        	forecastreq.send(null);
        },
        updateWeatherResults : function() {
        	if (weatherreq.readyState == 4) {
        		if (weatherreq.status == 200) {
        			document.getElementById("currentcond").innerHTML = weatherreq.responseText;
        		} else {
        			document.getElementById("currentcond").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	weatherreq = new WDN.proxy_xmlhttp();
        },
        updateForecast : function() {
        	if (forecastreq.readyState == 4) {
        		if (forecastreq.status == 200) {
        			document.getElementById("weatherforecast").innerHTML = forecastreq.responseText;
        		} else {
        			document.getElementById("weatherforecast").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	forecastreq = new WDN.proxy_xmlhttp();
        }      
    };
}();
