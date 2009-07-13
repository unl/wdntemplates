WDN.toolbar_peoplefinder = function() {
    var pfreq = new WDN.proxy_xmlhttp();
    var firstTimeLoad = 1;
    var wait = false;
    var defaultIntro = '<div style="width:350px;padding-top:30px;"><p style="margin-bottom:10px;"><strong style="font-size:1.2em;">People Lookup:</strong><br /><span style="padding-left:40px;display:block;">Enter in as much of the name as you know, first and/or last name in any order.</span></p><p style="margin-bottom:10px;"><strong style="font-size:1.2em;">Reverse Telephone Number Lookup:</strong><br /><span style="padding-left:40px;display:block;">Enter last three or more digits.</span></p><p><strong style="font-size:1.2em;">Department Lookup:</strong><br /><span style="padding-left:40px;display:block;">Begin typing the department name.</span></p></div><div id="pf_copyright" style="margin-top:50px;"><a title="More information about Peoplefinder" onclick="document.getElementById(\'pf_disclaimer\').style.display=\'block\'; return false;" class="imagelink" href="#"><img width="15" height="14" alt="Question Mark" src="http://peoplefinder.unl.edu/images/icon_question.gif"/></a> UNL | Office of University Communications | <a onclick="window.open(this.href); return false;" href="http://www1.unl.edu/wdn/wiki/About_Peoplefinder">About Peoplefinder</a> <div style="display: none;" id="pf_disclaimer"><p><strong>Information obtained from this directory may not be used to provide addresses for mailings to students, faculty or staff. Any solicitation of business, information, contributions or other response from individuals listed in this publication by mail, telephone or other means is forbidden.</strong></p></div></div>';
    var pfresultsdiv = 'pfresults';
    var pfrecorddiv = 'pfShowRecord';
    var pfserviceurl = 'http://peoplefinder.unl.edu/service.php?q=';
    var pfreq_q;
    return {
        initialize : function() {
    	
        },
        setupToolContent : function() {
        	return '<h3>Peoplefinder: UNL\'s Online Directory</h3><div class="col left"><form onsubmit="WDN.toolbar_peoplefinder.queuePFRequest(document.getElementById(\'pq\').value,\'pfresults\'); return false;" method="get" action="http://peoplefinder.unl.edu/"><div><input type="text" onkeyup="WDN.toolbar_peoplefinder.queuePFRequest(this.value,\'pfresults\');" name="pq" id="pq"/><img alt="progress" id="pfprogress" src="/ucomm/templatedependents/templatecss/images/transpixel.gif"/></div></form><div id="pfresults" class="toolbarMask">'+defaultIntro+'</div></div><div class="col right"><div id="pfShowRecord"></div></div>';
        },
        display : function() {
        	return true;
        },
        pf_getUID : function(uid) {
        	var url = "http://peoplefinder.unl.edu/hcards/"+uid;
        	if (wait==true) {
        		pfreq.abort();
        		pfreq = new WDN.proxy_xmlhttp();
        	}
        	pfreq.open("GET", url, true);
        	pfreq.onreadystatechange = WDN.toolbar_peoplefinder.updatePeopleFinderRecord;
        	pfreq.send(null);
        	wait=true;
        	return false;
        },
        queuePFChooser : function(q,resultsdiv) {
        	pfserviceurl = 'http://peoplefinder.unl.edu/service.php?chooser=true&q=';
        	WDN.toolbar_peoplefinder.queuePFRequest(q,resultsdiv);
        },
        queuePFRequest : function(q,resultsdiv) {
        	clearTimeout(pfreq_q);
        	if (q.length > 3) {
        		document.getElementById(resultsdiv).innerHTML = '';
        		document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/loadingContent.gif';
        		pfreq_q = setTimeout('WDN.toolbar_peoplefinder.getPeopleFinderResults("'+escape(q)+'")',400);
        	} else if (q.length>0) {
        		document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/transpixel.gif';
        		document.getElementById(resultsdiv).innerHTML = 'Please enter more information.';
        	} else {
        		document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/transpixel.gif';
        		document.getElementById(resultsdiv).innerHTML = defaultIntro;
        		jQuery('#pfShowRecord').empty();
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
        },
        updatePeopleFinderRecord : function() {
        	if (pfreq.readyState == 4) {
        		if (pfreq.status == 200) {
        			document.getElementById(pfrecorddiv).innerHTML = pfreq.responseText;
        		} else {
        			document.getElementById(pfrecorddiv).innerHTML = 'Error loading results.';
        		}
        	}
        	document.getElementById("pfprogress").src = 'wdn/templates_3.0/css/images/transpixel.gif';
        	wait = false;
        	pfreq = new WDN.proxy_xmlhttp();
        }

    };
}();

var pf_getUID = WDN.toolbar_peoplefinder.pf_getUID;