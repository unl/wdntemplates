define([
  'wdn',
  'jquery',
  'css!js-css/unlalert'
], function(WDN, $) {
  var alertDataUrl = 'https://alert.unl.edu/json/unlcap.js';
  var alertDataActiveIDs = [],
  serverCallTimeoutID,
  
  closedAlertCookieName = 'unlAlertsC',
  alertDataReceivedCookieName = 'unlAlertsData',
  activeAlertCookieName = 'unlAlertsA',
  
  serverCallExecutionDelay = 30000, // Delay (in milliseconds) before executing the checkIfServerCallIsNeeded function
  serverCallExecutionDelayTwo = 31000, // Secondary delay (in milliseconds) before executing the checkIfServerCallIsNeeded function

  alertDataReceivedCookieMaxAge = 30, // Maximum age (in seconds) for the alertDataReceived cookie
  closedAlertCookieMaxAge = 3600, // Maximum age (in seconds) for the alertDataReceived cookie

  // Sets a cookie to indicate unlAlerts.data has been received
  _setAlertDataReceivedCookie = function() {
    WDN.log('UNL Alert data received');
    clearTimeout(serverCallTimeoutID);
  
    WDN.setCookie(alertDataReceivedCookieName, 1, alertDataReceivedCookieMaxAge);
    serverCallTimeoutID = setTimeout(_checkIfServerCallNeeded, serverCallExecutionDelayTwo );//1000 instead of 20
  },

  _getAlertDataReceivedCookie = function() {
    return _checkCookie(alertDataReceivedCookieName);
  },
  // Sets a cookie to indicate that there is an active alert
  _setActiveAlertCookie = function(flag) {
    var value = 1, time = 60;
    if (flag === false) {
      value = '';
      time = -1;
    }
    WDN.setCookie(activeAlertCookieName, value, time);
  },

  _getActiveAlertCookie = function() {
    return _checkCookie(activeAlertCookieName);
  },
 
  // Sets a cookie to indicate that there is an acknowledged alert
  _setClosedAlertCookie = function(alertDataActiveID) {
    var closedAlertCookieValue = _getClosedAlertCookie();

  // Exit the function without setting a cookie if closedAlertCookie already exists for the alert
  if ($.inArray(alertDataActiveID, closedAlertCookieValue) != -1) {
      return;
    }

    closedAlertCookieValue.push(alertDataActiveID);
    WDN.setCookie(closedAlertCookieName, closedAlertCookieValue.join(','), closedAlertCookieMaxAge);
  },

  _getClosedAlertCookie = function() {
    var cookie = WDN.getCookie(closedAlertCookieName);
    if (cookie) {
      // Split cookie for index value comparison
      return cookie.split(',');
    }
    return [];
  },

  _acknowledgeAlert = function(alertDataActiveID) {
    _setClosedAlertCookie(alertDataActiveID);
  },

  _isAlertAcknowledged = function(alertDataID) {
    var closedAlertCookieValue = _getClosedAlertCookie();
    return (closedAlertCookieValue.indexOf(alertDataID) != -1 ? true : false);
  },

  _checkCookie = function(name) {
    try {
      var cookie = WDN.getCookie(name);
      if (cookie) {
          return true;
      }
      return false;
  } catch (e) {
      WDN.log('Error checking cookie:', e);
      return false; // Default to false if error occurs
  }
  },

  _callServer = function() {
    WDN.log('Checking the alert server for data '+ alertDataUrl);
    var loadedId = 'lastLoadedCmds';

    $old_alert = $('#' + loadedId);

    if ($old_alert.length) {
      // remove the current script tag
      $old_alert.remove();
    }

    //Add script to invoke the init function
    $('<script>', {
      "async": "async",
      "defer": "defer",
      "type": "text/javascript",
      "id": loadedId,
      "src": alertDataUrl
    }).appendTo($('head'));
  },

  _checkIfServerCallNeeded = function() {
    // Call the server if the data has expired (alertDataReceived cookie doesn't exist) or if there is a current alert
    // This should reduce the number of times we call the server
    if ( !_getAlertDataReceivedCookie() || _getActiveAlertCookie()) {
      _callServer();
    }

    clearTimeout(serverCallTimeoutID);
    serverCallTimeoutID = setTimeout(_checkIfServerCallNeeded, serverCallExecutionDelay); 
  },

  toggleAlert = function() {
    WDN.log('Toggle UNL Alert Visibility');
    var $alert = $('#unlalert'),
      // Are these two variables below needed?
        // $alertToggle = $('#unlalert_toggle'),
        // $alertContent = $('#_content'),
      $alertIconClose = $('#unlalert_icon_close'),
      $alertIconWarning = $('#unlalert_icon_warning'),
      $alertAction = $('#unlalert_action');

    if ($alert.hasClass('show')) {
      $alert.removeClass('show').closest('body').removeClass('unlalert-shown');
      $alertIconClose.attr('hidden', 'true');
      $alertIconWarning.removeAttr('hidden');
      $alertAction.removeClass('dcf-sr-only').addClass('dcf-ml-2 dcf-txt-sm').text('Show emergency alert');

      for (var i = 0; i < alertDataActiveIDs.length; i++) {
        _acknowledgeAlert(alertDataActiveIDs[i]);
      }
    } else {
      $alert.addClass('show').closest('body').addClass('unlalert-shown');
      $alertIconWarning.attr('hidden', 'true');
      $alertIconClose.removeAttr('hidden');
      $alertAction.removeClass('dcf-ml-2 dcf-txt-sm').addClass('dcf-sr-only').text('Hide emergency alert');
    }
  },

  alertUser = function(alertData) {
    WDN.log('Alerting the user');

    _setActiveAlertCookie(true);
    alertDataActiveIDs = [];

    var $alertWrapper = $('#unlalert'),
      $alertContent,
      containsExtreme = false,
      alertAcknowledgmentStatus = true,
      info = alertData.info,
      effectiveDate = '',
      alertDataID,
      web,
      alertContentHTML;

    if (!(info instanceof Array)) {
      info = [info];
    }

    for (var i = 0; i < info.length; i++) {
      if (info[i].severity !== 'Extreme') {
        continue;
      }
      containsExtreme = true;
    }

    if (!containsExtreme) {
      return;
    }

    alertDataID = alertData.identifier || +(new Date);
    alertDataActiveIDs.push(alertDataID);
    alertAcknowledgmentStatus = _isAlertAcknowledged(alertDataID);

    effectiveDate = new Date(alertData.sent).toLocaleString();

    for (var i = 0; i < info.length; i++) {
      // Add a div to store the html content
      if (!$alertWrapper.length) {
        $alertWrapper = $('<div>', {
          'id': 'unlalert',
          'class': 'dcf-bleed dcf-z-1',
          'role': 'alert'
        }).css({
          'position': 'absolute',
          'top': '-1000px'
        }).insertBefore('#dcf-header');

        $alertContent = $('<div>', {
          'id': 'unlalert_content',
          'class': 'dcf-relative dcf-col-gap-vw dcf-row-gap-6'
        });

        $('<div>', {'class': 'dcf-wrapper'})
          .append($alertContent)
          .appendTo($alertWrapper);
      } else if (i === 0) {
        $alertContent = $('#unlalert_content').empty();
      }

      web = info[i].web || 'https://www.unl.edu/';
      alertContentHTML = '<div class="unlalert-info"><header><h2 class="unlalert-heading dcf-mb-2 dcf-txt-2xs dcf-regular dcf-lh-3 dcf-uppercase unl-ls-2">Emergency alert</h2><h3 class="unlalert-headline dcf-mt-0 dcf-txt-h4">' + info[i].headline + '</h3></header><p class="unlalert-desc dcf-mb-0 dcf-txt-xs">' + info[i].description + '</p>';
      if (info[i].instruction) {
        alertContentHTML += '<p class="unlalert-desc dcf-mt-2 dcf-mb-0 dcf-txt-xs">' + info[i].instruction + '</p>';
      }
      alertContentHTML += '</div><footer class="unlalert-meta dcf-d-grid dcf-col-gap-vw dcf-row-gap-5 dcf-txt-2xs"><div class="unlalert-datetime"><span class="unlalert-heading dcf-d-block dcf-mb-1 dcf-lh-3 dcf-uppercase unl-ls-2">Issued </span>' + effectiveDate + '</div><div class="unlalert-link"><span class="unlalert-heading dcf-d-block dcf-mb-1 dcf-lh-3 dcf-uppercase unl-ls-2">Additional info (if&nbsp;available)<span class="dcf-sr-only">: </span></span><a href="' + web + '">' + web + '</a></div></footer>';
      $alertContent.append(alertContentHTML);
    }

    var alertIconSvg = '<svg id="unlalert" class="dcf-h-4 dcf-w-4 dcf-fill-current" viewBox="0 0 24 24" height="16" width="16" focusable="false" aria-hidden="true"><g id="unlalert_icon_close"><path d="M13.4 12 23.7 1.7c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 10.6 1.7.3C1.3-.1.7-.1.3.3s-.4 1 0 1.4L10.6 12 .3 22.3c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3L12 13.4l10.3 10.3c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L13.4 12z"></path></g><g id="unlalert_icon_warning" hidden><path d="M12 17.3c-.6 0-1-.4-1-1V8.7c0-.6.4-1 1-1s1 .4 1 1v7.7c0 .5-.4.9-1 .9z"></path><path d="M23 24H1c-.3 0-.7-.2-.9-.5s-.2-.7 0-1l11-22c.3-.7 1.5-.7 1.8 0l11 22c.2.3.1.7 0 1s-.6.5-.9.5zM2.6 22h18.8L12 3.2 2.6 22z"></path><path d="M12 21c-.8 0-1.5-.7-1.5-1.5S11.2 18 12 18s1.5.7 1.5 1.5S12.8 21 12 21z"></path></g><path fill="none" d="M0 0h24v24H0z"></path></svg>'

    // Add a visibility toggle tab
    var $alertToggle = $('#unlalert_toggle');
    if (!$alertToggle.length) {
      $alertToggle = $('<button>', {
        'id': 'unlalert_toggle',
        'class': 'dcf-btn dcf-btn-tertiary dcf-txt-decor-none dcf-d-flex dcf-ai-center dcf-jc-center dcf-txt-base'
      })
      .append(alertIconSvg)
      .append($('<span>', {
        'id': 'unlalert_action',
        'class': 'dcf-ml-2 dcf-txt-sm'
      }).text('Show emergency alert'))
      .click(toggleAlert)
      .appendTo($alertContent.parent());
    }

    if (alertAcknowledgmentStatus) {
      WDN.log('No unlalert display: all are acknowledged');
    } else {
      // Only trigger when $alertContent is hidden, otherwise an active, unacknowledged alert will be hidden
      if (!$alertWrapper.hasClass('show')) {
        $alertToggle.click();
      }
    }
  },

  noAlert = function() {
    _setActiveAlertCookie(false);

    // Remove alert div if no alert data exists
    if ($('#unlalert').length) {
      $('#unlalert').remove();
    }
  };

  // push namespace to window to support alert service
  window.unlAlerts = {
    data: {},
    server: {
      init: function() {
        _setAlertDataReceivedCookie();

        // Alert the user if the page is not in an iframe and alert data exists
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
    // The initialize function gets called first by main-wdn-pugins.js
    initialize: function() {
      _checkIfServerCallNeeded();
    },

    // Toggle visible alert message open/closed
    toggleAlert: function() {
      toggleAlert();
    }
  };
});
