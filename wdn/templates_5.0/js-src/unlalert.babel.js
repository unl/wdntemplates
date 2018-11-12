define([
	'wdn',
	'jquery',
	'dialog-helper'
], function(WDN, $, dialogHelper) {
	let dataUrl = 'https://alert.unl.edu/json/unlcap.js';
	let activeIds = [], calltimeout,

	ckPrfx = 'unlAlerts',
	idPrfx = 'unlalert',
	cntSuf = '_content',
	dialogId = 'wdn-emergency-alert-dialog',
	bannerId = 'wdn-emergency-alert-banner',

	timeoutPeriod = 30, // how ofter to check for expired data in seconds
	dataLifetime = 30, // seconds until the data cookie expires
	ackLifetime = 3600, // seconds until an acknowledgment expires

	_getClosedAlerts = function() {
		let c = WDN.getCookie(ckPrfx + 'C');
		if (c) {
			return c.split(',');
		}
		return [];
	},

	_pushClosedAlert = function(id) {
		let closed = _getClosedAlerts();
		if ($.inArray(id, closed) != -1) {
			return;
		}
		closed.push(id);
		WDN.setCookie(ckPrfx + 'C', closed.join(','), ackLifetime);
	},

	_checkCookie = function(name) {
		let c = WDN.getCookie(name);
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
		//Sets a cookie to indicate that there is an active alert
		var value = 1, time = 60;
		if (flag === false) {
			value = '';
			time = -1;
		}
		WDN.setCookie(ckPrfx + 'A', value, time);
	},

	_callServer = function() {
		WDN.log('Checking the alert server for data '+ dataUrl);
		var loadedId = 'lastLoadedCmds';
		$old = $('#' + loadedId);

		if ($old.length) {
			$old.remove();
		}

		$('<script>', {
			"async": "async",
			"defer": "defer",
			"type": "text/javascript",
			"id": loadedId,
			"src": dataUrl
		}).appendTo($('head'));
	},

	_checkIfCallNeeded = function() {
		if (_dataHasExpired() || _hasPreviousAlert()) {
			//call the server if our data has expired or if there is a current alert
			//This should reduce the number of times we call the server
			_callServer();
		}

		clearTimeout(calltimeout);
		calltimeout = setTimeout(_checkIfCallNeeded, timeoutPeriod * 1000);
	},

	dataReceived = function() {
		WDN.log('UNL Alert data received');
		clearTimeout(calltimeout);
		// Set cookie to indicate time the data was acquired
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
	
	getDialog = function() {
		let dialog = document.getElementById(dialogId);
		
		if (dialog) {
			//Dialog has already been set up, so return it.
			return dialog;
		}

		let $dialog = $('<dialog>', {
			'id': dialogId
		});

		$dialog.append('<h2 tabindex="-1">Emergency Alert</h2>');
		$dialog.append($('<button>', {
			'data-close-dialog': dialogId
		}).text('Close'));
		$dialog.append($('<div>', {
			'class': 'emergency-contents'
		}));

		$('body').append($dialog);

		dialogHelper.initialize($dialog.get(0));
		
		$dialog.on('close cancel', function() {
			for (let i = 0; i < activeIds.length; i++) {
				_acknowledgeAlert(activeIds[i]);
			}
		});
		
		return $dialog.get(0);
	},
	
	getBanner = function() {
		let banner = document.getElementById(bannerId);
		if (banner) {
			return banner;
		}
		
		let $banner = $('<div>', {
			'class': 'dcf-c-alert dcf-o-wrapper dcf-u-pt4 dcf-u-pb4 dcf-u-sm2',
			'id': bannerId
		});
		
		$banner.append($('<h2></h2>', {
			'class': 'dcf-c-alert__header'
		}).text('Emergency Alert'));
		
		$banner.append($('<div>', {
			'class': 'alert-preview dcf-c-alert__msg'
		}));
		
		let $button = $('<button>', {
			'class': 'dcf-c-btn dcf-c-btn--primary'
		});
		$button.text('Show Alert');
		$button.on('click', function() {
			let dialog = getDialog();
			dialog.showModal();
		});
		
		$banner.append($button);

		$('.dcf-c-header').first().before($banner);
		
		return $banner.get(0);
	},

	alertUser = function(root) {
		WDN.log('Alerting the user');

		_flagPreviousAlert();
		activeIds = [];
		let $alertContent,
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
		
		let dialog = getDialog();
		let messageContainer = dialog.querySelector('.emergency-contents');
		messageContainer.innerHTML = '';

		uniqueID = root.identifier || +(new Date);
		activeIds.push(uniqueID);
		allAck = alertWasAcknowledged(uniqueID);

		effectiveDate = new Date(root.sent).toLocaleString();
		
		for (i = 0; i < info.length; i++) {
			$alertContent = $('<div>', {'id': idPrfx + cntSuf});

			web = info[i].web || 'http://www.unl.edu/';

			alertContentHTML = '<h3>' + info[i].headline + '</h3><p>' + info[i].description + '</p>';
			if (info[i].instruction) {
				alertContentHTML += '<p class="unlalert-desc">' + info[i].instruction + '</p>';
			}
			alertContentHTML += '<div class="unlalert-meta"><div class="unlalert-datetime"><div class="wdn-sans-caps unlalert-heading">Issued</div><div>' + effectiveDate + '</div></div><div class="unlalert-link"><div class="wdn-sans-caps unlalert-heading">Additional info (if available)</div><div><a href="' + web + '">' + web + '</a></div></div></div>';

			$alertContent.append(alertContentHTML);
			messageContainer.innerHTML += $alertContent.html();
		}
		
		let banner = getBanner();
		banner.querySelector('.alert-preview').innerHTML = info[0].headline;
		
		if (allAck) {
			WDN.log('No unlalert display: all were previously acknowledged');
		} else if (!dialog.hasAttribute('open')) {
			dialog.showModal();
		}
	},

	noAlert = function() {
		_flagPreviousAlert(false);
	};

	// push namespace to window to support alert service
	window.unlAlerts = {
		data: {},
		server: {
			init: function() {
				dataReceived();

				// There is an alert if unlAlerts.data.alert.info exists
				if (unlAlerts.data.alert && unlAlerts.data.alert.info) {
					WDN.log("Found an alert");
					$(function() {
						alertUser(unlAlerts.data.alert);
					});
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
	};
});
