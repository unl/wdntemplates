define([
  'wdn',
  'jquery',
  'plugins/moment-timezone-with-data',
  'css!js-css/events'
], function(WDN, $, moment) {
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
  container = '#wdn_calendarDisplay',
  defaultCal = 'https://events.unl.edu/';

  var display = function(data, config) {
    var $container = $(config.container).addClass('wdn-calendar');
    $container.hide();

    $container.append($('<h2/>', {'class': 'dcf-d-flex dcf-ai-center dcf-mb-6 dcf-txt-xs dcf-uppercase unl-ls-2 unl-dark-gray unl-txt-stripes-after'}).html('Upcoming Events'));

    var events_html = '';
    $.each(data.Events.Event || data.Events, function(index, event) {
      var startDate;
      var timezone = 'America/Chicago';
      var timeformat = 'h:mm a';
      if (event.DateTime.hasOwnProperty("EventTimezone")) {
        var timezone = event.DateTime.EventTimezone;
        if (event.DateTime.EventTimezone != event.DateTime.CalendarTimezone) {
          timeformat += ' z';
        }
      }
      if (event.DateTime.Start) {
        startDate = moment.tz(event.DateTime.Start, timezone);
      } else {
        //legacy
        startDate = moment.tz(event.DateTime.StartDate +  'T' + event.DateTime.StartTime.substring(0, event.DateTime.StartTime.length - 1), timezone);
      }
      var eventURL = '';
      if ($.isArray(event.WebPages)) {
        eventURL = event.WebPages[0].URL
      } else if ($.isArray(event.WebPages.WebPage)) {
        eventURL = event.WebPages.WebPage[0].URL
      } else {
        eventURL = event.WebPages.WebPage.URL;
      }
      var month    = '<span class="dcf-d-block dcf-txt-3xs dcf-pt-2 dcf-pb-1 dcf-uppercase dcf-bold unl-ls-2 unl-cream unl-bg-scarlet">' + startDate.format('MMM') + '</span>';
      var day      = '<span class="dcf-d-block dcf-txt-h5 dcf-bold dcf-br-1 dcf-bb-1 dcf-bl-1 dcf-br-solid dcf-bb-solid dcf-bl-solid unl-br-light-gray unl-bb-light-gray unl-bl-light-gray unl-darker-gray dcf-bg-white">' + startDate.format('D') + '</span>';
      var time     = '<span class="dcf-d-block dcf-pt-2 dcf-txt-2xs dcf-uppercase dcf-bold unl-scarlet">' + startDate.format(timeformat) + '</span>';
      if (event.DateTime.AllDay) {
        // all day event so clear out time
        time = '';
      }
      var subtitle = '';
      if (event.EventSubtitle) {
        subtitle = '<p class="dcf-subhead dcf-mt-2 dcf-txt-3xs unl-dark-gray">' + event.EventSubtitle + '</p>';
      }
      var title    = '<header class="unl-event-title"><h3 class="dcf-mb-0 dcf-lh-3 dcf-bold dcf-txt-h6 unl-lh-crop"><a class="dcf-txt-decor-hover unl-darker-gray" href="'+ eventURL +'">' + event.EventTitle + '</a></h3>' + subtitle + '</header>';

      var location = '';

      if (event.Locations[0] !== undefined && event.Locations[0].Address.BuildingName) {
        location =  '<div class="unl-event-location dcf-txt-xs dcf-pt-1 unl-dark-gray">';
        if (event.Locations[0].MapLinks[0]) {
          location += '<a class="dcf-txt-decor-hover unl-dark-gray" href="'+ event.Locations[0].MapLinks[0] +'">';
        } else if (event.Locations[0].WebPages[0].URL) {
          location += '<a class="dcf-txt-decor-hover unl-dark-gray" href="'+ event.Locations[0].WebPages[0].URL +'">';
        }
        location += event.Locations[0].Address.BuildingName
        if (event.Locations[0].MapLinks[0] || event.Locations[0].WebPages[0].URL) {
          location += '</a>';
        }

        if (config.rooms) {
          if (event.Room) {
            var room = event.Room;
            if (room.match(/^room /i)) {
              room = room.substring(5);
            }
            location = location + '<br>Room: ' + room;
          }
        }

        location += '</span>';
      }

      var date = '<div class="unl-event-datetime dcf-flex-shrink-0 dcf-w-8 dcf-mr-5 dcf-txt-center">' + month + day + time +'</div>';
      events_html += ('<li class="unl-event-teaser">' + title + date + location  + '</li>');
    });
    $container.append('<ul class="dcf-list-bare">' + events_html + '</ul>');
    var seeAll = '<div class="dcf-mt-4"><a class="dcf-btn dcf-btn-secondary" href="' + config.url + 'upcoming/">See all '+config.title+' events</a></div>';
    var ics = '<a class="dcf-btn dcf-btn-secondary" href="' + config.url + 'upcoming/?format=ics">ICS</a>';
    var rss = '<a class="dcf-btn dcf-btn-secondary" href="' + config.url + 'upcoming/?format=rss">RSS</a>';
    var feeds = '<div class="dcf-btn-group dcf-mt-4 dcf-mr-5">' + ics + rss + '</div>';
    var more = '<div class="dcf-d-flex dcf-flex-row dcf-flex-wrap dcf-jc-between">' + feeds + seeAll + '</div>';
    $container.append(more);
    $container.show();
  };

  var setup = function(config) {
    var localSettings = getLocalEventSettings(),
    defaultConfig = {
      title: localSettings.title || '',
      url: localSettings.href || defaultCal,
      container: container,
      limit: localSettings.limit || 10,
      rooms: false
    },
    localConfig = $.extend({}, defaultConfig, config);

    // ensure that the URL we are about to use is forced into an https:// protocol. (add https if it starts with //)
        if (localConfig.url && localConfig.url.match(/^\/\//)) {
            localConfig.url = 'https:' + localConfig.url;
        } else if (localConfig.url && localConfig.url.match(/^http:\/\//)) {
            localConfig.url = localConfig.url.replace('http://', 'https://');
        }

    if (localConfig.url && $(localConfig.container).length) {
      $(this.container).addClass('wdn-calendar');
      $.getJSON(localConfig.url + 'upcoming/?format=json&limit=' + encodeURIComponent(localConfig.limit), function(data) {
          display(data, localConfig);
        }
      );
    }
  };

  return {
    initialize : function(config) {
      $(function() {
        setup(config);
      });
    },

    setup : setup
  };
});
