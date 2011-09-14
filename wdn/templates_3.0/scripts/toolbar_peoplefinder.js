WDN.toolbar_peoplefinder = function() {
    var wait = false;
    var defaultIntro = '<div class="pfintro"><h4>Search People</h4><p>Find contact information for faculty, staff and students. Search by:</p><ul><li>First name</li><li>Last name</li><li>Both first and last name</li><li>Last 3 or more digits of telephone</li></ul><h4>Search Departments</h4><p>Find UNL departments by entering a full or parital department name. Information available:</p><ul><li>Department contact information and location on campus</li><li>Complete list of department employees</li><li>Organizational hierarchy of department</li></ul></div><div id="pf_copyright">UNL | Office of University Communications | <a onclick="window.open(this.href); return false;" href="http://www1.unl.edu/wdn/wiki/About_Peoplefinder">About Directory</a> <div id="pf_disclaimer"><p>Information obtained from this directory may not be used to provide addresses for mailings to students, faculty or staff. Any solicitation of business, information, contributions or other response from individuals listed in this publication by mail, telephone or other means is forbidden.</p></div></div>';
    var pfresultsdiv = 'pfresults';
    var pfrecorddiv = 'pfShowRecord';
    var pfreq_q;
    return {
    	serviceURL : 'http://directory.unl.edu/',
    	
        initialize : function() {
        	
        },
        setupToolContent : function() {
        	WDN.loadCSS('/wdn/templates_3.0/css/header/toolbarPeoplefinder.css');
        	WDN.loadCSS('/wdn/templates_3.0/css/content/vcard.css');
            return '<h3>UNL\'s Online Directory <a href="http://directory.unl.edu/" class="external">(open in separate window)</a></h3><div class="col left"><form onsubmit="WDN.toolbar_peoplefinder.queuePFRequest(document.getElementById(\'pq\').value,\'pfresults\'); return false;" method="get" action="http://directory.unl.edu/"><div><input type="text" onkeyup="WDN.toolbar_peoplefinder.queuePFRequest(this.value,\'pfresults\');" name="pq" id="pq" /></div></form><div id="pfresults" class="toolbarMask">'+defaultIntro+'</div></div><div class="col right"><div id="pfShowRecord"></div></div>';
        },
        display : function() {
            setTimeout(function(){WDN.jQuery('#pq').focus();},500);
            return true;
        },
        pf_getUID : function(uid) {
            var url = WDN.toolbar_peoplefinder.serviceURL + 'service.php?view=hcard&uid=' + uid;
            WDN.get(url, null, WDN.toolbar_peoplefinder.updatePeopleFinderRecord);
            return false;
        },
        queuePFChooser : function(q, resultsdiv) {
            pfresultsdiv = resultsdiv;
            WDN.toolbar_peoplefinder.queuePFRequest(q, resultsdiv, true);
        },
        queuePFRequest : function(q, resultsdiv, chooser, cn, sn) {
            pfresultsdiv = resultsdiv;
            if (chooser) {
            	chooser = 'true';
            } else {
            	chooser = 'false';
            }
            if (cn === undefined && sn === undefined) {
            	splitQuery = '';
            } else {
            	splitQuery = '&cn='+escape(cn)+'&sn='+escape(sn);
            }
            clearTimeout(pfreq_q);
            if (q.length > 2 || splitQuery.length > 10) {
                document.getElementById(resultsdiv).innerHTML = '<img alt="progress" id="pfprogress" src="'+WDN.template_path+'wdn/templates_3.0/css/header/images/colorbox/loading.gif" />';
                pfreq_q = setTimeout('WDN.toolbar_peoplefinder.getPeopleFinderResults("'+escape(q)+splitQuery+'", '+chooser+')', 400);
            } else if (q.length>0) {
                document.getElementById(resultsdiv).innerHTML = 'Please enter more information.';
            } else {
                document.getElementById(resultsdiv).innerHTML = defaultIntro;
                WDN.jQuery('#pfShowRecord').empty();
            }
        },
        getPeopleFinderResults : function(q, chooser) {
        	var url = WDN.toolbar_peoplefinder.serviceURL + 'service.php?q=' + q;
        	if (chooser) {
        		url = url + '&chooser=true';
        	}
            WDN.get(url, null, WDN.toolbar_peoplefinder.updatePeopleFinderResults);
        },
        pfCatchUID : function(uid) {
            alert('I\'ve caught '+uid+'. You should create your own pfCatchUID function.');
            return false;
        },
        updatePeopleFinderResults : function(data, textStatus) {
        	if (textStatus == 'success') {
            	document.getElementById(pfresultsdiv).innerHTML = data;
                if (WDN.toolbar_peoplefinder.configuedWebService) {
                	service_peoplefinder.updatePeopleFinderResults();
                }
            } else {
                document.getElementById(pfresultsdiv).innerHTML = 'Error loading results.';
            }
        },
        updatePeopleFinderRecord : function(data, textStatus) {
            if (textStatus == 'success') {
                document.getElementById(pfrecorddiv).innerHTML = data;
                if (WDN.toolbar_peoplefinder.configuedWebService) {
                	service_peoplefinder.updatePeopleFinderRecord();
                }
            } else {
                document.getElementById(pfrecorddiv).innerHTML = 'Error loading results.';
            }
        },
        configuedWebService : false

    };
}();

var pf_getUID = WDN.toolbar_peoplefinder.pf_getUID;
var queuePFChooser = WDN.toolbar_peoplefinder.queuePFChooser;
var queuePFRequest = WDN.toolbar_peoplefinder.queuePFRequest;