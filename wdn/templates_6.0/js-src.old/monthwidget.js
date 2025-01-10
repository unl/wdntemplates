define([
  'wdn',
  'jquery',
  'moment',
  'plugins/hoverIntent/hoverintent',
  'css!js-css/monthwidget'
], function(WDN, $, moment) {
  var initd = true;

  var getLocalEventSettings = function() {
    var $eventLink = $('link[rel=events]'),
    eventParams = WDN.getPluginParam('events');

    if ($eventLink.length) {
      return {
        href: $eventLink[0].href,
        title: $eventLink[0].title
      };
    }

    return eventParams || {};
  },
  container = '#monthwidget',
  defaultCal = 'https://events.unl.edu/';

  var display = function(data, config) {
    var $container = $(config.container);
    $container.hide().html(data);
    $('#prev_month', $container).removeAttr('id').addClass('prev');
    $('#next_month', $container).removeAttr('id').addClass('next');

    var now = new Date(), today = now.getDate();
    var month = $('span.monthvalue a', $container).attr('href');
    month = month.substr(month.length - 3, 2);
    if (month.charAt(0) == '/') {
      month = month.substr(1);
    }

    var $days = $('tbody td', $container).not('.prev, .next');

    if (month - 1 == now.getMonth()) {
      $days.each(function() {
        var $this = $(this);
        if ($this.text() == today) {
          $this.addClass('today');
          return false;
        }
      });
    }

    $days.wrapInner('<div/>');

    $container.show();
  };

  var setup = function(config) {
    var localSettings = getLocalEventSettings(),
    defaultConfig = {
      url: localSettings.href || defaultCal,
      container: container
    },
    localConfig = $.extend({}, defaultConfig, config);

    // ensure that the URL we are about to use is forced into an https:// protocol. (add https if it starts with //)
    if (localConfig.url && localConfig.url.match(/^\/\//)) {
      localConfig.url = 'https:' + localConfig.url;
    } else if (localConfig.url && localConfig.url.match(/^http:\/\//)) {
      localConfig.url = localConfig.url.replace('http://', 'https://');
    }

    if (localConfig.url && $(localConfig.container).length) {
      $.get(localConfig.url + '?monthwidget&format=hcalendar', function(data) {
        display(data, localConfig);
      });
    }
  };

  return {
    initialize : function(config) {
      $(function() {
        setup(config);
      });
    },

    setup : setup,
  };
});
