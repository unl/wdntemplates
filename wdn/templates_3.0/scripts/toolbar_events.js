WDN.toolbar_events = function() {
    var calreq = new WDN.proxy_xmlhttp();
    return {
        initialize : function() {
        },
        display : function() {
        	var calurl = "http://www.unl.edu/wdn/template_3.0/scripts/eventsSniffer.php";
        	calreq.open("GET", calurl, true);
        	calreq.onreadystatechange = WDN.toolbar_events.updateCalendarResults;
        	calreq.send(null);
        },
        updateCalendarResults : function() {
        	if (calreq.readyState == 4) {
        		if (calreq.status == 200) {
        			document.getElementById("eventscontent").innerHTML = calreq.responseText;
        		} else {
        			document.getElementById("eventscontent").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	calreq = new WDN.proxy_xmlhttp();
        }
    };
}();
