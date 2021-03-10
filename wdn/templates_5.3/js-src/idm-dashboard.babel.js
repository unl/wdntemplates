'use strict';

/* global define: false */
define(['wdn', 'idm', 'jquery'], function (WDN, idm, $) {
  "use strict";

  const NOTIFICATION_UPDATE_INTERVAL = 300000;  // every 5 minutes

  let Plugin,
    loggedIn = false,
    idmUserID = false,
    idmDisplayName = '',
    initd = false;

  let updateIDMBadgeNotification = function() {
    Plugin.updateIDMBadgeNotification();
  }

  Plugin = {
    initialize: function() {
      let domReady = function domReady() {
        loggedIn = idm.isLoggedIn();

        if (loggedIn) {
          idmUserID = idm.getUserId();
          idmDisplayName = idm.getDisplayName();
          // update now
          Plugin.updateIDMBadgeNotification();
          Plugin.updateIDMNotifications();

          // update every notification update interval
          setInterval(updateIDMBadgeNotification, NOTIFICATION_UPDATE_INTERVAL);

        }
      };

      if (!initd) {
        idm.initialize(function () {
          $(domReady);
        });
      }

      initd = true;
    },

    updateIDMNotifications: function() {
      let notifications = Plugin.getNotifications();
      let idmNotificationList = document.getElementById("idm-notification-list");
      // Clear List
      idmNotificationList.innerHTML='';

      // Update list with current notifications
      if (notifications.length) {
        for (let i=0; i<notifications.length; i++) {
          var notificationItem = document.createElement("li");
          notificationItem.classList.add('dcf-txt-sm');
          notificationItem.setAttribute('id', 'idm-notification-' + notifications[i].id);
          var notificationTitle = document.createElement("h3");
          notificationTitle.classList.add('dcf-txt-h6');
          notificationTitle.innerText = notifications[i].title;
          notificationItem.appendChild(notificationTitle);
          var notificationBody = document.createElement("span");
          notificationBody.classList.add('dcf-txt-sm');
          notificationBody.innerText = notifications[i].body;
          notificationItem.appendChild(notificationBody);
          idmNotificationList.appendChild(notificationItem);
        }
      } else {
        var notificationItem = document.createElement("li");
        notificationItem.classList.add('dcf-txt-sm');
        notificationItem.appendChild(document.createTextNode("No notifications"));
        idmNotificationList.appendChild(notificationItem);
      }
    },

    updateIDMBadgeNotification: function() {
      let notifications = Plugin.getNotifications();
      let idmBadges = document.querySelectorAll('.dcf-idm-badge');
      for (let i=0; i<idmBadges.length; i++) {
        if (notifications.length) {
          idmBadges[i].textContent = notifications.length.toString();
          idmBadges[i].classList.remove('dcf-invisible');
        } else {
          idmBadges[i].removeEventListener('click');
          idmBadges[i].classList.add('dcf-invisible');
        }
      }
    },

    getNotifications: function() {
      WDN.log("Collecting notifications for : " + idmUserID);
      console.log("Collecting notifications for : " + idmUserID);
      //return [];
      return [
        {
          'id': 2999,
          'title': 'Lorem ipsum dolor sit amet,',
          'body': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nisi sapien, at pulvinar velit rhoncus vitae. Nunc et nibh venenatis, ultricies nisl a, tincidunt diam. Sed euismod molestie diam quis aliquet. Nam sit amet orci eget enim sollicitudin vulputate sit amet quis eros. Curabitur mattis non eros ac varius. Nulla tellus purus, aliquam et faucibus eget, vehicula nec nibh. Fusce ullamcorper augue a dolor fringilla, non dignissim nisl faucibus. Maecenas pulvinar lacinia nibh, vitae accumsan nulla. Nulla vel lacus ut turpis dictum lacinia vestibulum et neque. Interdum et malesuada fames ac ante ipsum primis in faucibus.'
        },

        {
          'id': 3003,
          'title': 'Mauris luctus felis ut ligula porta consectetur',
          'body': 'Mauris luctus felis ut ligula porta consectetur. Pellentesque sodales eros ligula, non sodales enim pulvinar non. Donec sit amet leo vel felis mattis mollis nec at nunc. Pellentesque dapibus dictum ornare. Quisque vitae mi quis lacus dictum vulputate vitae ac orci. Suspendisse vehicula consectetur orci, sed viverra ante congue et. In ac finibus risus. Vivamus et dictum diam, eu condimentum elit. Aenean vel vulputate ex, nec vulputate metus. Phasellus ac tincidunt tellus. Sed urna ipsum, cursus id libero nec, varius rhoncus lectus. Pellentesque vulputate, neque sit amet cursus pellentesque, mauris libero sagittis mi, ut laoreet velit est et lectus. Suspendisse auctor tellus id nulla sollicitudin, vitae finibus dui dictum. Duis quis ullamcorper enim. Aliquam non dolor lacus. Phasellus non arcu lacus.'
        }
      ];
    }

  };

  return Plugin;
});