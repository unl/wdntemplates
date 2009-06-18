WDN.toolbar_events = function() {
    var calreq = new WDN.proxy_xmlhttp();
    var initialized = false;
    return {
        initialize : function() {
	    	if (initialized) {
				return true;
			}
			jQuery('#toolbarcontent').append('<div id="eventscontent"><div class="col left"><h3>Local Site Events</h3><div id="localsiteevents"></div></div><div class="col right"><h3>UNL Events <a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></h3><div id="allunlevents"></div></div></div>');
			initialized = true;
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
