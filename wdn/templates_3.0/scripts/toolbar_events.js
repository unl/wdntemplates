WDN.toolbar_events = function() {
    var calreq = new WDN.proxy_xmlhttp();
    var localcalreq = new WDN.proxy_xmlhttp();
    var havelocalevents = false;
    return {
        initialize : function() {

        },
        setupToolContent : function() {
        	var pagelinks = document.getElementsByTagName('link');
        	for(i=0;i<pagelinks.length;i++)
        	{
        	    relatt = pagelinks[i].getAttribute('rel');
        	    if(relatt=='localevents')
        	    {
        	    	havelocalevents = true;
        	    	localeventshref = pagelinks[i].getAttribute('href');
        	    	localeventstitle = pagelinks[i].getAttribute('title');
        	    	return '<div class="col left"><h3><span>UNL Events <em><a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></em></span><a href="http://events.unl.edu/upcoming/?format=rss"><span class="rssicon"></span></a></h3><div id="allunlevents" class="toolbarMask"></div></div><div class="col right"><h3><span>'+localeventstitle+' Events <em><a href="'+localeventshref+'/upcoming/">(Full Calendar)</a></em></span><a href="'+localeventshref+'/upcoming/?format=rss"><span class="rssicon"></span></a></h3><div id="localsiteevents" class="toolbarMask"></div></div>';
        	    }
        	}
        	return '<div class="col left"><h3><span>UNL Events <em><a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></em></span><a href="http://events.unl.edu/upcoming/?format=rss"><span class="rssicon"></span></a></h3><div id="allunlevents" class="toolbarMask"></div></div>';
        },
        display : function() {
        	if (havelocalevents)
        		jQuery('#toolbar_events .col.left').css({width:"460px", padding:"0 10px 0 0"});
        	else {}
        	WDN.toolbar_events.getCalendarResults();      	
        },
        getCalendarResults : function() {
        	var calurl = "http://events.unl.edu/?format=hcalendar";
        	calreq.open("GET", calurl, true);
        	calreq.onreadystatechange = WDN.toolbar_events.updateCalendarResults;
        	calreq.send(null);
        	if (havelocalevents)
        	{
        		var calurl = localeventshref+'/upcoming/?format=hcalendar';
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
