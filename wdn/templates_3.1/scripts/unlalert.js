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
	var _flagPreviousAlert = function(flag) {
		var value = 1, time = 60;
		if (flag === false) {
			value = '';
			time = -1;
		}
		
		WDN.setCookie('unlAlertsA', value, time);
	};
	
	var activeIds = [], calltimeout;
	
	return {
		
		data_url : document.location.protocol+'//alert.unl.edu/json/unlcap.js',
//		data_url : '//ucommabel.unl.edu/workspace/wdntemplates/scripts/public/alertSimulator.php',
		
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
			_flagPreviousAlert();
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
					$alertBox = WDN.jQuery('<div/>').attr('id', 'alertbox').appendTo(
						WDN.jQuery('<div/>').addClass('hidden').appendTo('body')
					);
					$alertContent = WDN.jQuery('<div/>').addClass('grid6').appendTo($alertBox)
						.parent().prepend('<div class="grid2 first"><span class="alert-icon"/></div>').end();
				} else if (i === 0) {
					$alertContent = $alertBox.children('.grid6').empty();
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
			
			var $tool = WDN.jQuery('#unlalerttool');
			var readyCallback = function() {
				if (allAck) {
					WDN.log('Alert was previously acknowledged');
					// Ignore this alert... the user has already acknowledged it.
				} else {
					$tool.click();
				}
			};
			
			if (!$tool.length) {
				// Add the alert icon to the tool links
				var toolAttrs = {
					'id': 'unlalerttool',
					'class': 'alert',
					'title': 'UNL Alert: An alert has been issued.',
					'href': '#alertbox'
				};
				$tool = WDN.jQuery('<a/>').attr(toolAttrs).text('UNL Alert').wrap('<li class="focus" />');
				WDN.jQuery('#wdn_tool_links').prepend($tool.parent());
				WDN.tooltip.addTooltip($tool);
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/colorbox/jquery.colorbox.js'), function() {
					$tool.click(function() {
						WDN.jQuery('#unlalerttool').colorbox({
							inline: true,
							href: "#alertbox",
							open: true,
							title: toolAttrs['title'],
							onClosed: WDN.unlalert.closeAlert
						});
						return false;
					});
					
					readyCallback();
				});
			} else {
				readyCallback();
			}
		},
		
		/*------ close alert box ------*/
		closeAlert: function() {
			//create alert box
			for (var i = 0; i < activeIds.length; i++) {
				WDN.unlalert._acknowledgeAlert(activeIds[i]);
			}
		}, 
		
		noAlert: function() {
			_flagPreviousAlert(false);
		}
	};
}();

/* server side scripts for UNL Alert System */
var unlAlerts = {
	data: {},
	server: {
		/*------ initiate alert message if message is critical ------*/
		init: function() {
			WDN.unlalert.dataReceived();
			
			if (unlAlerts.data.alert && unlAlerts.data.alert.info) {
				WDN.log("Found an alert, calling alertUser()");
				WDN.unlalert.alertUser(unlAlerts.data.alert.info);
				
				return;
			}
			
			WDN.unlalert.noAlert();	
		}
	}
};
