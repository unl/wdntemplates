define(['jquery', 'wdn'], function($, WDN) {
	var activeIds = [], calltimeout,

	ckPrfx = 'unlAlerts',
	idPrfx = 'unlalert',
	cntSuf = '_content',
	togSuf = '_toggle',

	timeoutPeriod = 30, // how ofter to check for expired data
	dataLifetime = 30, // seconds until the data cookie expires
	ackLifetime = 3600, // seconds until an acknowledgment expires

	_getClosedAlerts = function() {
		var c = WDN.getCookie(ckPrfx + 'C');
		if (c) {
			return c.split(',');
		}
		return [];
	},

	_pushClosedAlert = function(id) {
		var closed = _getClosedAlerts();
		if ($.inArray(id, closed) != -1) {
			return;
		}
		closed.push(id);
		WDN.setCookie(ckPrfx + 'C', closed.join(','), ackLifetime);
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

//	dataUrl = document.location.protocol+'//alert.unl.edu/json/unlcap.js',
	dataUrl = '//ucommabel.unl.edu/workspace/wdntemplates/scripts/public/alertSimulator.php',

	_callServer = function() {
		WDN.log('Checking the alert server for data '+ dataUrl);
		var loadedId = 'lastLoadedCmds'
		$old = $('#' + loadedId),
		cacheBust = (new Date()).getTime();

		if ($old.length) {
			$old.remove();
		}

		$('<script>', {
			"async": "async",
			"defer": "defer",
			"type": "text/javascript",
			"id": loadedId,
			"src": dataUrl + '?' + cacheBust
		}).appendTo($('head'));
	},

	_checkIfCallNeeded = function() {
		if (_dataHasExpired() || _hasPreviousAlert()) {
			_callServer();
		}

		clearTimeout(calltimeout);
		calltimeout = setTimeout(_checkIfCallNeeded, timeoutPeriod * 1000);
	},

	dataReceived = function() {
		WDN.log('UNL Alert data received');
		clearTimeout(calltimeout);
		// Set cookie to indicate time the data was aquired
		WDN.setCookie(ckPrfx + 'Data', 1, dataLifetime);
		calltimeout = setTimeout(_checkIfCallNeeded, (dataLifetime + 1) * 1000);
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
			$alert.removeClass('show').closest('body').removeClass(idPrfx + '-shown');
			$alertToggle.find('i').attr('class', 'wdn-icon-attention');
			for (i = 0; i < activeIds.length; i++) {
				_acknowledgeAlert(activeIds[i]);
			}
		} else {
			$alert.addClass('show').closest('body').addClass(idPrfx + '-shown');
			$alertToggle.find('i').attr('class', 'wdn-icon-cancel');
		}
	},

	alertUser = function(root) {
		WDN.log('Alerting the user');

		_flagPreviousAlert();
		activeIds = [];
		var $alertWrapper = $('#' + idPrfx),
			$alertContent,
			containsExtreme = false,
			allAck = true,
			i,
			info = root.info,
			effectiveDate = '',
			uniqueID,
			web,
			alertContentHTML;

		if (!(info instanceof Array)) {
			info = [info];
		}

		for (i = 0; i < info.length; i++) {
			if (info[i].severity !== 'Extreme') {
				continue;
			}
			containsExtreme = true;
		}

		if (!containsExtreme) {
			return;
		}

		uniqueID = root.identifier || +(new Date);
		activeIds.push(uniqueID);
		allAck = alertWasAcknowledged(uniqueID);

		effectiveDate = new Date(root.sent).toLocaleString();

		for (i = 0; i < info.length; i++) {
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

			web = info[i].web || 'http://www.unl.edu/';

			alertContentHTML = '<h1><span>Emergency UNL Alert:</span> ' + info[i].headline + '</h1>';
			alertContentHTML += '<h2>Issued at ' + effectiveDate + '</h2>';
			alertContentHTML += '<p>' + info[i].description + '<br/>';
			if (info[i].instruction) {
				alertContentHTML += info[i].instruction + '<br/>';
			}
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
					alertUser(unlAlerts.data.alert);
				} else {
					noAlert();
				}
			}
		}
	};

	return {

		initialize: function() {
			_checkIfCallNeeded();
		},

		// Toggle visible alert message open/closed
		toggleAlert: function() {
			toggleAlert();
		}
	};
});
