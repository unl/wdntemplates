WDN.toolbar_peoplefinder = function() {
    var pfresultsdiv = 'pfresults',
    	pfrecorddiv = 'pfShowRecord',
    	defaultIntro,
    	pfreq_q;
    
    return {
    	serviceURL : 'http://directory.unl.edu/',
    	
        initialize : function() {},
        setupToolContent : function(contentCallback) {
        	WDN.loadCSS('/wdn/templates_3.0/css/header/toolbarPeoplefinder.css');
        	WDN.loadCSS('/wdn/templates_3.0/css/content/vcard.css');
        	WDN.jQuery.ajax({
            	url: WDN.template_path + 'wdn/templates_3.0/includes/tools/peoplefinder.html',
            	success: function(data) {
            		var $tempDiv = WDN.jQuery('<div/>').append(data),
            			$pq = WDN.jQuery('#pq', $tempDiv);
            		
            		WDN.jQuery('form', $tempDiv).submit(function() {
            			WDN.toolbar_peoplefinder.queuePFRequest($pq.val(), 'pfresults');
            			return false;
            		});
            		$pq.keyup(function() {
            			WDN.toolbar_peoplefinder.queuePFRequest($pq.val(), 'pfresults');
            		});
            		defaultIntro = WDN.jQuery('#pfresults', $tempDiv).children().clone();
            		
            		contentCallback($tempDiv.children());
            	},
            	error: function() {
            		contentCallback("An error occurred while loading this section");
            	}
            });
        },
        display : function() {
            setTimeout(function() {
        		WDN.jQuery('#pq').focus();
    		}, 500);
        },
        pf_getUID : function(uid) {
            var url = WDN.toolbar_peoplefinder.serviceURL + 'service.php?view=hcard&uid=' + uid;
            WDN.get(url, WDN.toolbar_peoplefinder.updatePeopleFinderRecord);
            return false;
        },
        queuePFChooser : function(q, resultsdiv) {
            WDN.toolbar_peoplefinder.queuePFRequest(q, resultsdiv, true);
        },
        queuePFRequest : function(q, resultsdiv, chooser, cn, sn) {
            pfresultsdiv = resultsdiv;
            var $results = WDN.jQuery('#' + pfresultsdiv),
            	splitQuery = '';
            
            if (cn !== undefined || sn !== undefined) {
            	splitQuery = '&cn=' + escape(cn) + '&sn=' + escape(sn);
            }
            
            clearTimeout(pfreq_q);
            if (q.length > 2 || splitQuery.length > 10) {
                $results.html('<div id="pf_progress"/>');
                pfreq_q = setTimeout(function() {
                	WDN.toolbar_peoplefinder.getPeopleFinderResults(escape(q) + splitQuery, chooser);
                }, 400);
            } else if (q.length>0) {
            	$results.html('Please enter more information.');
            } else {
            	$results.empty().append(defaultIntro.clone());
                WDN.jQuery('#pfShowRecord').empty();
            }
        },
        getPeopleFinderResults : function(q, chooser) {
        	var url = WDN.toolbar_peoplefinder.serviceURL + 'service.php?q=' + q;
        	if (chooser) {
        		url += '&chooser=true';
        	}
            WDN.get(url, WDN.toolbar_peoplefinder.updatePeopleFinderResults);
        },
        pfCatchUID : function(uid) {
            alert('I\'ve caught '+uid+'. You should create your own pfCatchUID function.');
            return false;
        },
        updatePeopleFinderResults : function(data, textStatus) {
        	var $results = WDN.jQuery('#' + pfresultsdiv);
        	if (textStatus == 'success') {
            	$results.html(data);
                if (WDN.toolbar_peoplefinder.configuedWebService) {
                	service_peoplefinder.updatePeopleFinderResults();
                }
            } else {
                $results.html('Error loading results.');
            }
        },
        updatePeopleFinderRecord : function(data, textStatus) {
        	var $record = WDN.jQuery('#' + pfrecorddiv);
            if (textStatus == 'success') {
                $record.html(data);
                if (WDN.toolbar_peoplefinder.configuedWebService) {
                	service_peoplefinder.updatePeopleFinderRecord();
                }
            } else {
                $record.html('Error loading results.');
            }
        },
        configuedWebService : false

    };
}();

var pf_getUID = WDN.toolbar_peoplefinder.pf_getUID;
var queuePFChooser = WDN.toolbar_peoplefinder.queuePFChooser;
var queuePFRequest = WDN.toolbar_peoplefinder.queuePFRequest;