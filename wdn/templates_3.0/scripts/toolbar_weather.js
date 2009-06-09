WDN.toolbar_weather = function() {
    var weatherreq = new WDN.proxy_xmlhttp();
    return {     
    	initialize : function() {
    	
    	},
        display : function() {
        	var weatherurl = "http://www.unl.edu/ucomm/templatedependents/templatesharedcode/scripts/current.html";
        	weatherreq.open("GET", weatherurl, true);
        	weatherreq.onreadystatechange = WDN.toolbar_weather.updateWeatherResults;
        	weatherreq.send(null);
        },
        updateWeatherResults : function() {
        	if (weatherreq.readyState == 4) {
        		if (weatherreq.status == 200) {
        			document.getElementById("weathercontent").innerHTML = weatherreq.responseText;
        		} else {
        			document.getElementById("weathercontent").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	weatherreq = new WDN.proxy_xmlhttp();
        }      
    };
}();
