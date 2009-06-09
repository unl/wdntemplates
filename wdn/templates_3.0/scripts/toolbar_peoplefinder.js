WDN.toolbar_peoplefinder = function() {
    var pfreq = new WDN.proxy_xmlhttp();
    var firstTimeLoad = 1;
    var wait = false;
    var pfresultsdiv = 'pfresults';
    var pfserviceurl = 'http://peoplefinder.unl.edu/service.php?q=';
    var pfreq_q;
    return {
        initialize : function() {
        },
        pf_getUID : function(uid) {
        	var url = "http://peoplefinder.unl.edu/hcards/"+uid;
        	if (wait==true) {
        		pfreq.abort();
        		pfreq = new WDN.proxy_xmlhttp();
        	}
        	pfreq.open("GET", url, true);
        	pfreq.onreadystatechange = WDN.toolbar_peoplefinder.updatePeopleFinderResults;
        	pfreq.send(null);
        	wait=true;
        	return false;
        },
        queuePFChooser : function(q,resultsdiv) {
        	pfserviceurl = 'http://peoplefinder.unl.edu/service.php?chooser=true&q=';
        	WDN.toolbar_peoplefinder.queuePFRequest(q,resultsdiv);
        },
        queuePFRequest : function(q,resultsdiv) {
        	pfresultsdiv = resultsdiv;
        	clearTimeout(pfreq_q);
        	if (q.length > 3) {
        		document.getElementById(pfresultsdiv).innerHTML = '';
        		document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/loadingContent.gif';
        		pfreq_q = setTimeout('WDN.toolbar_peoplefinder.getPeopleFinderResults("'+escape(q)+'")',400);
        	} else if (q.length>0) {
        		document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/transpixel.gif';
        		document.getElementById(pfresultsdiv).innerHTML = 'Please enter more information.';
        	} else {
        		document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/transpixel.gif';
        		document.getElementById(pfresultsdiv).innerHTML = '';
        	}
        },
        getPeopleFinderResults : function(q) {
        	var url = pfserviceurl + q;
        	if (wait==true) {
        		pfreq.abort();
        		pfreq = new WDN.proxy_xmlhttp();
        	}
        	pfreq.open("GET", url, true);
        	pfreq.onreadystatechange = WDN.toolbar_peoplefinder.updatePeopleFinderResults;
        	pfreq.send(null);
        	wait=true;
        },
        pfCatchUID : function(uid) {
        	alert('I\'ve caught '+uid+'. You should create your own pfCatchUID function.');
        	return false;
        },

        updatePeopleFinderResults : function() {
        	if (pfreq.readyState == 4) {
        		if (pfreq.status == 200) {
        			document.getElementById(pfresultsdiv).innerHTML = pfreq.responseText;
        		} else {
        			document.getElementById(pfresultsdiv).innerHTML = 'Error loading results.';
        		}
        	}
        	document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/transpixel.gif';
        	wait = false;
        	pfreq = new WDN.proxy_xmlhttp();
        }

    };
}();

var pf_getUID = WDN.toolbar_peoplefinder.pf_getUID;