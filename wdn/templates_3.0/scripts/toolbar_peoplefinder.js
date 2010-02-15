WDN.toolbar_peoplefinder = function() {
    var wait = false;
    var defaultIntro = '<div style="width:350px;padding-top:30px;"><p style="margin-bottom:10px;"><strong style="font-size:1.2em;">People Lookup:</strong><br /><span style="padding-left:40px;display:block;">Enter in as much of the name as you know, first and/or last name in any order.</span></p><p style="margin-bottom:10px;"><strong style="font-size:1.2em;">Reverse Telephone Number Lookup:</strong><br /><span style="padding-left:40px;display:block;">Enter last three or more digits.</span></p><p><strong style="font-size:1.2em;">Department Lookup:</strong><br /><span style="padding-left:40px;display:block;">Begin typing the department name.</span></p></div><div id="pf_copyright" style="margin-top:50px;"><a title="More information about Peoplefinder" onclick="document.getElementById(\'pf_disclaimer\').style.display=\'block\'; return false;" class="imagelink" href="#"><img width="15" height="14" alt="Question Mark" src="http://peoplefinder.unl.edu/images/icon_question.gif"/></a> UNL | Office of University Communications | <a onclick="window.open(this.href); return false;" href="http://www1.unl.edu/wdn/wiki/About_Peoplefinder">About Peoplefinder</a> <div style="display: none;" id="pf_disclaimer"><p><strong>Information obtained from this directory may not be used to provide addresses for mailings to students, faculty or staff. Any solicitation of business, information, contributions or other response from individuals listed in this publication by mail, telephone or other means is forbidden.</strong></p></div></div>';
    var pfresultsdiv = 'pfresults';
    var pfrecorddiv = 'pfShowRecord';
    var pfreq_q;
    return {
    	serviceURL : 'http://peoplefinder.unl.edu/',
    	
        initialize : function() {
        
        },
        setupToolContent : function() {
            return '<h3>Peoplefinder: UNL\'s Online Directory <a href="http://peoplefinder.unl.edu/" class="external">(open in separate window)</a></h3><div class="col left"><form onsubmit="WDN.toolbar_peoplefinder.queuePFRequest(document.getElementById(\'pq\').value,\'pfresults\'); return false;" method="get" action="http://peoplefinder.unl.edu/"><div><input type="text" onkeyup="WDN.toolbar_peoplefinder.queuePFRequest(this.value,\'pfresults\');" name="pq" id="pq" /></div></form><div id="pfresults" class="toolbarMask">'+defaultIntro+'</div></div><div class="col right"><div id="pfShowRecord"></div></div>';
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
        queuePFRequest : function(q, resultsdiv, chooser) {
            pfresultsdiv = resultsdiv;
            if (chooser) {
            	chooser = 'true';
            } else {
            	chooser = 'false';
            }
            clearTimeout(pfreq_q);
            if (q.length > 3) {
                document.getElementById(resultsdiv).innerHTML = '<img alt="progress" id="pfprogress" src="'+WDN.template_path+'wdn/templates_3.0/css/images/loadingContent.gif" />';
                pfreq_q = setTimeout('WDN.toolbar_peoplefinder.getPeopleFinderResults("'+escape(q)+'", '+chooser+')', 400);
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
            } else {
                document.getElementById(pfresultsdiv).innerHTML = 'Error loading results.';
            }
        },
        updatePeopleFinderRecord : function(data, textStatus) {
            if (textStatus == 'success') {
                document.getElementById(pfrecorddiv).innerHTML = data;
            } else {
                document.getElementById(pfrecorddiv).innerHTML = 'Error loading results.';
            }
        }

    };
}();

var pf_getUID = WDN.toolbar_peoplefinder.pf_getUID;
var queuePFChooser = WDN.toolbar_peoplefinder.queuePFChooser;
var queuePFRequest = WDN.toolbar_peoplefinder.queuePFRequest;