WDN.toolbar = function() {
    var expandedHeight = 0;
    var weatherreq = new WDN.proxy_xmlhttp();
    return {
        initialize : function() {
            WDN.loadCSS('wdn/templates_3.0/scripts/plugins/colorbox/colorbox.css');
            if (jQuery.browser.ie) {
                WDN.loadCSS('wdn/templates_3.0/scripts/plugins/colorbox/colorbox-ie.css');
            }
            WDN.loadJS('wdn/templates_3.0/scripts/plugins/colorbox/jquery.colorbox.js', WDN.toolbar.colorboxSetup);
            
            jQuery('#header').append('<div class="hidden"><div id="feedcontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="weathercontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="calendarcontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="directorycontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="cameracontent"></div></div>');
        },
        colorboxSetup : function() {
            WDN.log('Setting up colorbox');
            jQuery("#wdn_tool_links li a.feed").colorbox({width:"1000", height:"550", iframe:true});
            jQuery("#wdn_tool_links li a.weather").colorbox({width:"1000", height:"550", inline:true, href:"#weathercontent"}, WDN.toolbar.displayUNLWeather);
            jQuery("#wdn_tool_links li a.calendar").colorbox({width:"1000", height:"550", iframe:true});
            jQuery("#wdn_tool_links li a.directory").colorbox({width:"1000", height:"550", iframe:true});
            jQuery("#wdn_tool_links li a.camera").colorbox({width:"1000", height:"550", iframe:true});
            
        },
        getContent : function(url) {
            
        },  
        displayUNLWeather : function() { 
        	var weatherurl = "http://www.unl.edu/ucomm/templatedependents/templatesharedcode/scripts/current.html";
        	weatherreq.open("GET", weatherurl, true);
        	weatherreq.onreadystatechange = WDN.toolbar.updateWeatherResults;
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
