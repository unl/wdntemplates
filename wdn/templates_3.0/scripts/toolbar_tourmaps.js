WDN.toolbar_tourmaps = function() {
    var tourmapsreq = new WDN.proxy_xmlhttp();
    return {     
    	initialize : function() {
    		
    	},
    	setupToolContent : function() {
    		return '<div id="tourmapscontent"></div>';
    	},
        display : function() {
        	var tourmapsurl = "http://www1.unl.edu/tour/?format=maincontent";
        	tourmapsreq.open("GET", tourmapsurl, true);
        	tourmapsreq.onreadystatechange = WDN.toolbar_tourmaps.updateTourMapsResults;
        	tourmapsreq.send(null);
        },
        updateTourMapsResults : function() {
        	if (tourmapsreq.readyState == 4) {
        		if (tourmapsreq.status == 200) {
        			document.getElementById("tourmapscontent").innerHTML = tourmapsreq.responseText;
        		} else {
        			document.getElementById("tourmapscontent").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	tourmapsreq = new WDN.proxy_xmlhttp();
        }      
    };
}();
