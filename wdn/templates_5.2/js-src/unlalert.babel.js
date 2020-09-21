define([
  'wdn',
  'jquery',
  'css!js-css/unlalert'
], function(WDN, $) {
  var dataUrl = 'https://alert.unl.edu/json/unlcap.js';
  var activeIds = [], calltimeout,

  ckPrfx = 'unlAlerts',
  idPrfx = 'unlalert',
  cntSuf = '_content',
  togSuf = '_toggle',
  icnSuf = '_icon',
  axnSuf = '_action',

  timeoutPeriod = 30, // how ofter to check for expired data in seconds
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
    //call the server if our data has expired or if there is a current alert
    //This should reduce the number of times we call the server
    if (_dataHasExpired() || _hasPreviousAlert()) {
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

  toggleAlert = function() {
    WDN.log('Toggle UNL Alert Visibility');
    var $alert = $('#' + idPrfx),
      $alertToggle = $('#' + idPrfx + togSuf),
      $alertContent = $('#' + idPrfx + cntSuf),
      $alertIcon = $('#' + idPrfx + icnSuf),
      $alertAction = $('#' + idPrfx + axnSuf),
      i;

    if ($alert.hasClass('show')) {
      $alert.removeClass('show').closest('body').removeClass(idPrfx + '-shown');
      $alertIcon.attr('class','wdn-icon-attention dcf-mr-3');
      $alertAction.removeClass('dcf-sr-only').text('Show emergency alert');
      for (i = 0; i < activeIds.length; i++) {
        _acknowledgeAlert(activeIds[i]);
      }
    } else {
      $alert.addClass('show').closest('body').addClass(idPrfx + '-shown');
      $alertIcon.attr('class','wdn-icon-cancel');
      $alertAction.addClass('dcf-sr-only').text('Hide emergency alert');
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
        $alertWrapper = $('<div>', {
          'id': idPrfx,
          'class': 'dcf-bleed dcf-z-1',
          'role': 'alert'
        }).css({
          'position': 'absolute',
          'top': '-1000px'
        }).insertBefore('#dcf-header');

        $alertContent = $('<div>', {
          'id': idPrfx + cntSuf,
          'class': 'dcf-relative dcf-col-gap-vw dcf-row-gap-6'
        });

        $('<div>', {'class': 'dcf-wrapper'})
          .append($alertContent)
          .appendTo($alertWrapper);
        } else if (i === 0) {
        $alertContent = $('#' + idPrfx + cntSuf).empty();
      }

      web = info[i].web || 'https://www.unl.edu/';

      alertContentHTML = '<div class="unlalert-info"><header><h2 class="unlalert-heading dcf-mb-2 dcf-txt-2xs dcf-regular dcf-lh-3 dcf-uppercase unl-ls-2">Emergency alert</h2><h3 class="unlalert-headline dcf-mt-0 dcf-txt-h4">' + info[i].headline + '</h3></header><p class="unlalert-desc dcf-mb-0 dcf-txt-xs">' + info[i].description + '</p>';
      if (info[i].instruction) {
        alertContentHTML += '<p class="unlalert-desc dcf-mt-2 dcf-mb-0 dcf-txt-xs">' + info[i].instruction + '</p>';
      }
      alertContentHTML += '</div><footer class="unlalert-meta dcf-d-grid dcf-col-gap-vw dcf-row-gap-5 dcf-txt-2xs"><div class="unlalert-datetime"><span class="unlalert-heading dcf-d-block dcf-mb-1 dcf-lh-3 dcf-uppercase unl-ls-2">Issued </span>' + effectiveDate + '</div><div class="unlalert-link"><span class="unlalert-heading dcf-d-block dcf-mb-1 dcf-lh-3 dcf-uppercase unl-ls-2">Additional info (if&nbsp;available)<span class="dcf-sr-only">: </span></span><a href="' + web + '">' + web + '</a></div></footer>';

      $alertContent.append(alertContentHTML);
    }

    // Add a visibility toggle tab
    var $alertToggle = $('#' + idPrfx + togSuf);
    if (!$alertToggle.length) {
      $alertToggle = $('<button>', {
        'id': idPrfx + togSuf,
        'class': 'dcf-btn dcf-btn-tertiary dcf-txt-decor-none'
      })
      .append($('<span>', {
        'id': idPrfx + icnSuf,
        'class': 'wdn-icon-attention dcf-mr-3',
                'aria-hidden': 'true'
            }))
      .append($('<span>', {
        'id': idPrfx + axnSuf
      }).text('Show emergency alert'))
      .click(toggleAlert)
      .appendTo($alertContent.parent());
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

  // push namespace to window to support alert service
  window.unlAlerts = {
    data: {},
    server: {
      init: function() {
        dataReceived();

        // There is an alert if NOT in an iframe and unlAlerts.data.alert.info exists
        if (window.top === window && unlAlerts.data.alert && unlAlerts.data.alert.info) {
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

    // Toggle visible alert message open/closed
    toggleAlert: function() {
      toggleAlert();
    }
  };
});
