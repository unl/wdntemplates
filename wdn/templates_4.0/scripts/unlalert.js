/**
 * This file does not use jQuery so it can be used in all cases.
 */
define(['jquery', 'wdn'], function($, WDN) {
	var activeIds = [], calltimeout,
	
	ckPrfx = 'unlAlerts',
	idPrfx = 'unlalert',
	cntSuf = '_content',
	togSuf = '_toggle',
	
	_browserCompat = function() {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (searchElement) {
				"use strict";
				if (this == null) {throw new TypeError();}
				var t = Object(this);
				var len = t.length >>> 0;
				if (len === 0) {return -1;}
				var n = 0;
				if (arguments.length > 0) {
					n = Number(arguments[1]);
					if (n != n) {n = 0;} else if (n != 0 && n != Infinity && n != -Infinity) {n = (n > 0 || -1) * Math.floor(Math.abs(n));}
				}
				if (n >= len) {return -1;}
				var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
				for (; k < len; k++) {if (k in t && t[k] === searchElement) {return k;}}
				return -1;
			};
		}
	},
	
	_getClosedAlerts = function() {
		var c = WDN.getCookie(ckPrfx + 'C');
		if (c) {
			return c.split(',');
		}
		return [];
	},
	
	_pushClosedAlert = function(id) {
		var closed = _getClosedAlerts();
		if (closed.indexOf(id) != -1) {
			return;
		}
		closed.push(id);
		WDN.setCookie(ckPrfx + 'C', closed.join(','), 3600);
	},
	
	_checkCookie = function(name) {
		var c = WDN.getCookie(name);
		if (c) {
			return true;
		}
		return false;
	},
	
	_dataHasExpired = function() {
		return !_checkCookie(ckPrfx + 'Data');
	},
	
	_hasPreviousAlert = function() {
		return _checkCookie(ckPrfx + 'A');
	},
	
	_flagPreviousAlert = function(flag) {
		var value = 1, time = 60;
		if (flag === false) {
			value = '';
			time = -1;
		}
		WDN.setCookie(ckPrfx + 'A', value, time);
	},
	
	dataUrl = document.location.protocol+'//alert.unl.edu/json/unlcap.js',
//	dataUrl = '//ucommabel.unl.edu/workspace/wdntemplates/scripts/public/alertSimulator.php',
	
	_callServer = function() {
		WDN.log('Checking the alert server for data '+ dataUrl);
		var head = document.getElementsByTagName('head')[0],
		old  = document.getElementById('lastLoadedCmds'),
		cacheBust = (new Date()).getTime(),
		script = document.createElement('script');
		
		if (old) {
			head.removeChild(old);
		}
		
		script.type = 'text/javascript';
		script.defer = true;
		script.async = true;
		script.id = 'lastLoadedCmds';
		script.src = dataUrl + '?' + cacheBust;
		head.appendChild(script);
	},
	
	_checkIfCallNeeded = function() {
		if (_dataHasExpired() || _hasPreviousAlert()) {
			_callServer();
		}
	},
	
	dataReceived = function() {
		WDN.log('UNL Alert data received');
		clearTimeout(calltimeout);
		// Set cookie to indicate time the data was aquired
		WDN.setCookie(ckPrfx + 'Data', 1, 60);
		calltimeout = setTimeout(_checkIfCallNeeded, 60000);
	},
	
	alertWasAcknowledged = function(id) {
		var closed = _getClosedAlerts();
		return (closed.indexOf(id) != -1 ? true : false);
	},
	
	_acknowledgeAlert = function(id) {
		_pushClosedAlert(id);
	},
	
	toggleAlert = function() {
		WDN.log('Toggle UNL Alert Visibility');
		var $alert = $('#' + idPrfx),
			$alertToggle = $('#' + idPrfx + togSuf),
			i;

		if ($alert.hasClass('show')) {
			$alert.removeClass('show');
			$alertToggle.find('i').attr('class', 'wdn-icon-attention');
			for (i = 0; i < activeIds.length; i++) {
				_acknowledgeAlert(activeIds[i]);
			}
		} else {
			$alert.addClass('show');
			$alertToggle.find('i').attr('class', 'wdn-icon-cancel');
		}
	},
	
	alertUser = function(root) {
		WDN.log('Alerting the user');

		if (!(root instanceof Array)) {
			root = [root];
		}
		_flagPreviousAlert();
		activeIds = [];
		var $alertWrapper = $('#' + idPrfx), $alertContent, allAck = true, i;

		for (i = 0; i < root.length; i++) {
			if (root[i].severity !== 'Extreme') {
				continue;
			}

			var uniqueID = root[i].parameter.value;
			activeIds.push(uniqueID);

			if (!allAck || !alertWasAcknowledged(uniqueID)) {
				allAck = false;
			}

			// Add a div to store the html content
			if (!$alertWrapper.length) {
				WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/unlalert.css'));
				
				$alertWrapper = $('<div>', {
					'id': idPrfx,
					'class': 'wdn-band wdn-content-slide'
				}).css({
					'position': 'absolute',
					'top': '-1000px'
				}).insertBefore('#header');
				
				$alertContent = $('<div>', {'id': idPrfx + cntSuf});
				
				$('<div>', {'class': 'wdn-inner-wrapper'})
					.append($alertContent)
					.appendTo($alertWrapper);
			} else if (i === 0) {
				$alertContent = $('#' + idPrfx + cntSuf).empty();
			}
			
			var effectiveDate = root[i].effective || '';
			if (effectiveDate.length) {
				// transform the ISO effective date into a JS date by inserting a missing colon
				effectiveDate = new Date(effectiveDate.slice(0, -2) + ":" + effectiveDate.slice(-2)).toLocaleString();
			}
			var web = root[i].web || 'http://www.unl.edu/';

			var alertContentHTML = '<h1><span>Emergency UNL Alert:</span> ' + root[i].headline + '</h1>';
			if (effectiveDate) {
				alertContentHTML += '<h2>Issued at ' + effectiveDate + '</h2>';
			}
			alertContentHTML += '<p>' + root[i].description + ' ' + root[i].instruction + ' <!-- ID '+uniqueID+' -->';
			alertContentHTML += 'Additional info (if available) at <a href="' + web + '">' + web + '</a></p>';
			
			$alertContent.append(alertContentHTML);
		}

		// Add an visibility toggle tab
		var $alertToggle = $('#' + idPrfx + togSuf);
		if (!$alertToggle.length) {
			$alertToggle = $('<a>', {
				'id': idPrfx + togSuf,
				'href': 'javascript:void(0)'
			})
			.append($('<i>', {'class': 'wdn-icon-attention'}))
			.append($('<span>').text('Toggle Alert Visibility'))
			.click(toggleAlert)
			.prependTo($alertContent.parent());
		}

		if (allAck) {
			WDN.log('No unlalert display: all were previously acknowledged');
		} else {
			// Only trigger when $alertContent is hidden, otherwise an active, unacknowledged alert will be hidden
			if (!$alertWrapper.hasClass('show')) {
				$alertToggle.click();
			}
		}
	},
	
	noAlert = function() {
		_flagPreviousAlert(false);
	};
	
	window.unlAlerts = {
		data: {},
		server: {
			init: function() {
				dataReceived();

				// There is an alert if unlAlerts.data.alert.info exists
				if (unlAlerts.data.alert && unlAlerts.data.alert.info) {
					WDN.log("Found an alert");
					alertUser(unlAlerts.data.alert.info);
				} else {
					noAlert();
				}
			}
		}
	};

	return {
		
		initialize: function() {
			_browserCompat();
			_checkIfCallNeeded();
		},

		// Toggle visible alert message open/closed
		toggleAlert: function() {
			toggleAlert();
		}
	};
});
