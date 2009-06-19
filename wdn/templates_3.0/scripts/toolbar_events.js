WDN.toolbar_events = function() {
    var calreq = new WDN.proxy_xmlhttp();
    var localcalreq = new WDN.proxy_xmlhttp();
    return {
        initialize : function() {

        },
        setupToolContent : function() {
        	if (myEventsName != "ReplaceThisButLeaveTheQuotes")
        		return '<div class="col left"><h3>UNL Events <a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></h3><div id="allunlevents"></div></div><div class="col right"><h3>Local Site Events</h3><div id="localsiteevents"></div></div>';
        	else	
        		return '<div class="col left"><h3>UNL Events <a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></h3><div id="allunlevents"></div></div>';
        },
        display : function() {
        	if (myEventsName != "ReplaceThisButLeaveTheQuotes")
        	{
        		jQuery('#toolbar_events .col.left').css({width:"460px", padding:"0 10px 0 0"});
        		WDN.toolbar_events.getCalendarResults(myEventsName);
        	}
        	else	
        	{
        		WDN.toolbar_events.getCalendarResults("donthaveone");
        	}
        },
        getCalendarResults : function(localEventsName) {
        	var calurl = "http://events.unl.edu/?format=hcalendar";
        	calreq.open("GET", calurl, true);
        	calreq.onreadystatechange = WDN.toolbar_events.updateCalendarResults;
        	calreq.send(null);
        	if (localEventsName != "donthaveone")
        	{
        		var calurl = "http://events.unl.edu/"+localEventsName+"/?format=hcalendar";
            	localcalreq.open("GET", calurl, true);
            	localcalreq.onreadystatechange = WDN.toolbar_events.updateLocalCalendarResults;
            	localcalreq.send(null);
        	}
        	
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
        },
        updateLocalCalendarResults : function() {
        	if (localcalreq.readyState == 4) {
        		if (localcalreq.status == 200) {
        			document.getElementById("localsiteevents").innerHTML = localcalreq.responseText;
        		} else {
        			document.getElementById("localsiteevents").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	localcalreq = new WDN.proxy_xmlhttp();
        }
    };
}();
