WDN.toolbar = function() {
    var expandedHeight = 0;
    
    
    var weatherreq = new WDN.proxy_xmlhttp();
    var calreq = new WDN.proxy_xmlhttp();
    
    
    
    var firstTimeLoad = 1;
    var wait = false;
    var pfreq = new WDN.proxy_xmlhttp();
    var pfresultsdiv = 'pfresults';
    var pfserviceurl = 'http://peoplefinder.unl.edu/service.php?q=';
    var pfreq_q;
    if (!pfreq)
    	alert("Error initializing XMLHttpRequest!");

    
    
    
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
        	jQuery('#header').append('<div class="hidden"><div id="pfcontent"><form onsubmit="queuePFRequest(document.getElementById(\'pq\').value,\'pfresults\'); return false;" method="get" action="http://peoplefinder.unl.edu/"><div><label for="pq">Search People:</label><input type="text" onkeyup="queuePFRequest(this.value,\'pfresults\');" name="pq" id="pq"/><img alt="progress" id="pfprogress" src="/ucomm/templatedependents/templatecss/images/transpixel.gif"/> </div></form><div class="toolResultsMask" id="pfResultsMask"><div class="toolResults" id="pfresults"/></div> </div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="cameracontent"></div></div>');
        },
        colorboxSetup : function() {
            WDN.log('Setting up colorbox');
            jQuery("#wdn_tool_links li a.feed").colorbox({width:"1000", height:"550", iframe:true});
            jQuery("#wdn_tool_links li a.weather").colorbox({width:"1000", height:"550", inline:true, href:"#weathercontent"}, WDN.toolbar.displayUNLWeather);
            jQuery("#wdn_tool_links li a.calendar").colorbox({width:"1000", height:"550", inline:true, href:"#calendarcontent"}, WDN.toolbar.displayCalendar);
            jQuery("#wdn_tool_links li a.directory").colorbox({width:"1000", height:"550", inline:true, href:"#directorycontent"});
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
        },
        displayCalendar : function() {
        	var calurl = "http://events.unl.edu/?format=hcalendar";
        	calreq.open("GET", calurl, true);
        	calreq.onreadystatechange = WDN.toolbar.updateCalendarResults;
        	calreq.send(null);
        },
        updateCalendarResults : function() {
        	if (calreq.readyState == 4) {
        		if (calreq.status == 200) {
        			document.getElementById("calendarcontent").innerHTML = calreq.responseText;
        		} else {
        			document.getElementById("calendarcontent").innerHTML = 'Error loading results.';
        		}
        	}
        	wait = false;
        	calreq = new WDN.proxy_xmlhttp();
        },
        
        pf_getUID : function(uid) {
        	var url = "http://peoplefinder.unl.edu/hcards/"+uid;
        	if (wait==true) {
        		pfreq.abort();
        		pfreq = new XMLHTTP();
        	}
        	pfreq.open("GET", url, true);
        	pfreq.onreadystatechange = updatePeopleFinderResults;
        	pfreq.send(null);
        	wait=true;
        	return false;
        },

        updateWebcam : function(camuri) {
        	document.getElementById('webcamuri').src = camuri;
        	unlwebcam = camuri;
        },
        queuePFChooser : function(q,resultsdiv) {
        	pfserviceurl = 'http://peoplefinder.unl.edu/service.php?chooser=true&q=';
        	queuePFRequest(q,resultsdiv);
        },
        queuePFRequest : function(q,resultsdiv) {
        	pfresultsdiv = resultsdiv;
        	clearTimeout(pfreq_q);
        	if (q.length > 3) {
        		document.getElementById(pfresultsdiv).innerHTML = '';
        		document.getElementById("pfprogress").src = '/ucomm/templatedependents/templatecss/images/loadingContent.gif';
        		pfreq_q = setTimeout('getPeopleFinderResults("'+escape(q)+'")',400);
        		displayUNLPFScrollbar();
        		pfScrollBar.reset();
        	} else if (q.length>0) {
        		document.getElementById("pfprogress").src = '/ucomm/templatedependents/templatecss/images/transpixel.gif';
        		document.getElementById(pfresultsdiv).innerHTML = 'Please enter more information.';
        		displayUNLPFScrollbar();
        		pfScrollBar.reset();

        	} else {
        		document.getElementById("pfprogress").src = '/ucomm/templatedependents/templatecss/images/transpixel.gif';
        		document.getElementById(pfresultsdiv).innerHTML = '';
        		displayUNLPFScrollbar();
        		pfScrollBar.reset();
        	}
        },
        getPeopleFinderResults : function(g) {
        	var url = pfserviceurl + q;
        	if (wait==true) {
        		pfreq.abort();
        		pfreq = new XMLHTTP();
        	}
        	pfreq.open("GET", url, true);
        	pfreq.onreadystatechange = updatePeopleFinderResults;
        	pfreq.send(null);
        	wait=true;
        },
        pfCatchUID : function(uid)
        {
        	alert('I\'ve caught '+uid+'. You should create your own pfCatchUID function.');
        	return false;
        },

        updatePeopleFinderResults : function() {
        	if (pfreq.readyState == 4) {
        		if (pfreq.status == 200) {
        			document.getElementById(pfresultsdiv).innerHTML = pfreq.responseText;
        			displayUNLPFScrollbar();
        			pfScrollBar.reset();
        		} else {
        			document.getElementById(pfresultsdiv).innerHTML = 'Error loading results.';
        		}
        	}
        	document.getElementById("pfprogress").src = '/ucomm/templatedependents/templatecss/images/transpixel.gif';
        	wait = false;
        	pfreq = new XMLHTTP();
        }


    };
}();
