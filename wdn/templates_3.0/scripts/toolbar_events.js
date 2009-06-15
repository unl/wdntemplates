WDN.toolbar_events = function() {
    var calreq = new WDN.proxy_xmlhttp();
    return {
        initialize : function() {
        },
        display : function() {
        	var calurl = "http://events.unl.edu/?format=hcalendar";
        	calreq.open("GET", calurl, true);
        	calreq.onreadystatechange = WDN.toolbar_events.updateCalendarResults;
        	calreq.send(null);
        },
        updateCalendarResults : function() {
        	if (calreq.readyState == 4) {
        		if (calreq.status == 200) {
        			document.getElementById("allunlevents").innerHTML = calreq.responseText;
        		} else {
        			document.getElementById("allunlevents").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	calreq = new WDN.proxy_xmlhttp();
        }
    };
}();
