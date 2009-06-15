WDN.toolbar_weather = function() {
    var weatherreq = new WDN.proxy_xmlhttp();
    var forecastreq = new WDN.proxy_xmlhttp();
    return {     
    	initialize : function() {
    	
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
