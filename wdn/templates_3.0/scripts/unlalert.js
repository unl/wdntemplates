/* Constructor */
var unlAlerts = function() {};

WDN.unlalert = function() {
	var _getClosedAlerts = function() {
		var c = WDN.getCookie('unlAlertsC');
		if (c) {
			return c.split(',');
		}
		
		return [];
	};
	var _pushClosedAlert = function(id) {
		var closed = _getClosedAlerts();
		if (WDN.jQuery.inArray(id, closed) >= 0) {
			return;
		}
		
		closed.push(id);
		WDN.setCookie('unlAlertsC', closed.join(','), 3600);
	};
	var _checkCookie = function(name) {
		var c = WDN.getCookie(name);
		if (c) {
			return true;
		}
		return false;
	};
	
	var activeIds = [], calltimeout;
	
	return {
		
		data_url : document.location.protocol+'//alert.unl.edu/json/unlcap.js',
		//data_url : 'http://ucommbieber.unl.edu/ucomm/templatedependents/templatesharedcode/scripts/alert.master.server.js',
		
		initialize : function()
		{
			WDN.log('Initializing the UNL Alert Plugin');
			WDN.unlalert.checkIfCallNeeded();
		},
		
		checkIfCallNeeded: function() {
			if (WDN.unlalert._dataHasExpired() || WDN.unlalert._hasPreviousAlert()) {
				WDN.unlalert._callServer();
			}
		},
		
		dataReceived: function() {
			WDN.log('UNL Alert data received');
			clearTimeout(calltimeout);
			/* Set cookie to indicate time the data was aquired */
			WDN.setCookie('unlAlertsData', 1, 60);
			calltimeout = setTimeout(WDN.unlalert.checkIfCallNeeded, 60000);
		},
		
		/*------ Check if the data has expired ------*/
		_dataHasExpired: function() {
			return !_checkCookie('unlAlertsData');
		},
		
		_hasPreviousAlert: function() {
			return _checkCookie('unlAlertsA');
		},
		
		_callServer: function() {
			WDN.log('Checking the alert server for data '+WDN.unlalert.data_url);
			var head = document.getElementsByTagName('head').item(0);
			var old  = document.getElementById('lastLoadedCmds');
			if (old) {
				head.removeChild(old);
			}
			var currdate = new Date();
			script = document.createElement('script');
			script.src = WDN.unlalert.data_url+'?'+currdate.getTime();
			script.type = 'text/javascript';
			script.defer = true;
			script.id = 'lastLoadedCmds';
			head.appendChild(script);
		},
		
		/*------ check if alert was acknowledged ------*/
		alertWasAcknowledged: function(id) {
			var closed = _getClosedAlerts();
			return WDN.jQuery.inArray(id, closed) >= 0;
		},
		
		/*------ acknowledge alert, and don't show again ------*/
		_acknowledgeAlert: function(id) {
			_pushClosedAlert(id);
		},
		
		/*------ building alert message ------*/
		alertUser: function(root) {
			if (!WDN.jQuery.isArray(root)) {
				root = [root];
			}
			
			WDN.log('Alerting the user');
			WDN.setCookie('unlAlertsA', 1, 60);
			activeIds = [];
			var $alertBox = WDN.jQuery("#alertbox"), $alertContent;
			var firstAlert = !$alertBox.length;
			var allAck = true;
			
			for (var i = 0; i < root.length; i++) {
				if (root[i].severity !== 'Extreme') {
					continue;
				}
				
				var uniqueID = root[i].parameter.value;
				activeIds.push(uniqueID);
				
				if (!allAck || !WDN.unlalert.alertWasAcknowledged(uniqueID)) {
					allAck = false;
				}
				
				// Add a div to store the html content
				if (!$alertBox.length) {
					$alertBox = WDN.jQuery('<div id="alertbox" />').appendTo('#maincontent').hide();
					$alertContent = WDN.jQuery('<div class="two_col right" />').appendTo($alertBox)
						.parent().prepend('<div class="col left"><img src="/wdn/templates_3.0/css/images/alert/generic.png" alt="An emergency has been issued" /></div>').end();
				} else if (i === 0) {
					$alertContent = $alertBox.children('.two_col').empty();
				}
				
				var alertTitle = root[i].headline;
				var alertDescription = root[i].description;
				var effectiveDate = root[i].effective || '';
				if (effectiveDate.length) {
					// transform the ISO effective date into a JS date by inserting a missing colon
					effectiveDate = new Date(effectiveDate.slice(0, -2) + ":" + effectiveDate.slice(-2)).toLocaleString();
				}
				
				var alertContentHTML = '<h1 class="sec_header">UNL Alert: ' + alertTitle + '</h1>';
				if (effectiveDate) {
					alertContentHTML += '<h4 class="effectiveDate">Issued at ' + effectiveDate + '</h4>';
				}
				alertContentHTML += '<p>'+ alertDescription +'<!-- Number '+uniqueID+' --></p>';
				$alertContent.append(alertContentHTML);
			}
			
			if ($alertBox.length && firstAlert) {
				// Add the alert icon to the tool links
				WDN.jQuery('#wdn_tool_links').prepend('<li class="focus"><a id="unlalerttool" class="alert" title="UNL Alert: An alert has been issued." href="#alertbox">UNL Alert</a></li>');
				WDN.tooltip.addTooltip(WDN.jQuery('#unlalerttool'));
				WDN.jQuery('#unlalerttool').click(function() {
					$alertBox.show();
					WDN.jQuery(document).bind('cbox_closed', WDN.unlalert.closeAlert);
					WDN.jQuery('#unlalerttool').colorbox({inline:true,width:"640px",href:"#alertbox",open:true});
					return false;
				});
			}
			
			if (allAck) {
				WDN.log('Alert was previously acknowledged');
				// Ignore this alert... the user has already acknowledged it.
			} else {
				WDN.jQuery('#unlalerttool').click();
			}
		},
		
		/*------ close alert box ------*/
		closeAlert: function() {
			//create alert box
			WDN.jQuery('#alertbox').hide();
			for (var i = 0; i < activeIds.length; i++) {
				WDN.unlalert._acknowledgeAlert(activeIds[i]);
			}
		}
	};
}();

/* server side scripts for UNL Alert System */
unlAlerts.server = {

	/*------ initiate alert message if message is critical ------*/
	init: function() {
		/* We have received the data */
		WDN.unlalert.dataReceived();
		
		/* get the root of the alert data tree*/
		var alertInfo = unlAlerts.data.alert.info;
		
		if (alertInfo) {
			WDN.log("Found an alert, calling alertUser()");
			WDN.unlalert.alertUser(alertInfo);
			
			return true;
		}

		WDN.setCookie('unlAlertsA', '', -1);
		return false;
	}
};
