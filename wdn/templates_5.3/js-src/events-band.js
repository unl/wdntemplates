define([
  'wdn',
  'jquery',
  'plugins/moment-timezone-with-data',
  'css!js-css/events',
  'css!js-css/events-band'
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

  container = '#events-band',
  defaultCal = 'https://events.unl.edu/';

  var fetchEvents = function(localConfig) {
    var containerClasses = 'dcf-bleed dcf-wrapper dcf-pt-9 dcf-pb-8 unl-bg-lightest-gray';
    if (localConfig.use_band_background) {
      containerClasses = containerClasses + ' unl-bg-grit';
    }
    var type = 'upcoming',
        $container = $(localConfig.container).addClass(containerClasses),
        grid = document.createElement('div');
        grid.classList.add('unl-offset-grid', 'dcf-col-gap-4');
        eventList = document.createElement('ul');
        eventList.classList.add('unl-event-teaser-list', 'dcf-list-bare', 'dcf-col-gap-vw', 'dcf-row-gap-6', 'dcf-mb-0');

    // Handle direct url to upcoming or featured
    if (localConfig.url.match(/upcoming\/?$/)) {
      localConfig.url = localConfig.url.replace('upcoming/', '');
      typePath = '';
      type = 'upcoming';
    } else if (localConfig.url.match(/featured\/?$/)) {
      localConfig.url = localConfig.url.replace('featured/', '');
      typePath = '';
      type = 'featured';
    }

    if (localConfig.featured === true) {
      type = 'featured';
    }

    typePath = type + '/';

    var url = localConfig.url + typePath + '?format=json&limit=' + localConfig.limit + '&pinned_limit=' + localConfig.pinned_limit;
    var jqxhr = $.getJSON(url, function(data) {
      if (!data.Events) {
        return;
      }

      $.each(data.Events.Event || data.Events, function(index, event) {
        var date;
        var timezone = 'America/Chicago';
        var ampmFormat = 'a';
        if (event.DateTime.hasOwnProperty("EventTimezone")) {
          var timezone = event.DateTime.EventTimezone;
          if (event.DateTime.EventTimezone != event.DateTime.CalendarTimezone) {
            ampmFormat = 'a z';
          }
        }

        if (event.DateTime.Start) {
          date = moment.tz(event.DateTime.Start, timezone);
        } else {
          //legacy
          date = moment.tz(event.DateTime.StartDate +  'T' + event.DateTime.StartTime.substring(0, event.DateTime.StartTime.length - 1), timezone);
        }
        var month     = date.format('MMM');
        var day       = date.format('D');
        var time      = '<time class="unl-event-time dcf-d-flex dcf-ai-center dcf-uppercase" datetime="' + date.format('HH:mm') + '"><svg class="dcf-mr-1 dcf-h-4 dcf-w-4 dcf-flex-shrink-0 dcf-fill-current" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path d="M12 23C5.9 23 1 18.1 1 12S5.9 1 12 1s11 4.9 11 11-4.9 11-11 11zm0-20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"/><path d="M16.8 17.8c-.2 0-.5-.1-.7-.3l-5.2-4.8c-.2-.2-.3-.5-.3-.7V7.2c0-.6.4-1 1-1s1 .4 1 1v4.3l4.9 4.5c.4.4.4 1 .1 1.4-.3.3-.5.4-.8.4z"/><path fill="none" d="M0 0h24v24H0z"/></svg>' + date.format('h:mm') + ' ' + date.format(ampmFormat) + '</time>'
        if (event.DateTime.AllDay) {
          // all day event so clear out time
          time = '';
        }

        var location = '';

        if (event.Locations[0] !== undefined && event.Locations[0].Address.BuildingName) {
          if (event.Locations[0].MapLinks[0]) {
            location += '<a class="dcf-txt-decor-hover unl-dark-gray" href="'+ event.Locations[0].MapLinks[0] +'">';
          } else if (event.Locations[0].WebPages[0].URL) {
            location += '<a class="dcf-txt-decor-hover unl-dark-gray" href="'+ event.Locations[0].WebPages[0].URL +'">';
          }
          location += event.Locations[0].Address.BuildingName
          if (event.Locations[0].MapLinks[0] || event.Locations[0].WebPages[0].URL) {
            location += '</a>';
          }

          if (localConfig.rooms) {
            if (event.Room) {
              var room = event.Room;
              if (room.match(/^room /i)) {
                room = room.substring(5);
              }
              location = location + ', Room: ' + room;
            }
          }
        }

        var eventURL = '';
        if ($.isArray(event.WebPages)) {
          eventURL = event.WebPages[0].URL
        } else if ($.isArray(event.WebPages.WebPage)) {
          eventURL = event.WebPages.WebPage[0].URL
        } else {
          eventURL = event.WebPages.WebPage.URL;
        }

        var subtitle = '';
        if (event.EventSubtitle) {
          subtitle = '<p class="dcf-subhead dcf-mt-1 dcf-mb-3 dcf-txt-3xs dcf-bold unl-dark-gray">' + event.EventSubtitle + '</p>';
        }
        eventList.innerHTML += '<li class="unl-event-teaser-li"><article class="unl-event-teaser dcf-card-as-link"><header class="unl-event-title"><h3 class="dcf-mb-0 dcf-lh-3 dcf-bold dcf-txt-h6 unl-lh-crop"><a class="dcf-txt-decor-hover dcf-card-link unl-darker-gray" href="' + eventURL + '">' + event.EventTitle + '</a></h3>' + subtitle + '</header><time class="unl-event-date dcf-flex-shrink-0 dcf-w-8 dcf-mr-4 dcf-txt-center" datetime="' + date.format('YYYY-MM-DD') + '"><span class="unl-event-month dcf-d-block dcf-txt-3xs dcf-pt-2 dcf-pb-1 dcf-uppercase dcf-bold unl-ls-2 unl-cream unl-bg-scarlet">' + month + '</span><span class="unl-event-day dcf-d-block dcf-txt-h5 dcf-bold dcf-br-1 dcf-bb-1 dcf-bl-1 dcf-br-solid dcf-bb-solid dcf-bl-solid dcf-bg-white unl-br-light-gray unl-bb-light-gray unl-bl-light-gray unl-darker-gray">' + day + '</span>' + '</time><div class="unl-event-details dcf-txt-xs unl-dark-gray">' + time + '<div class="unl-event-location dcf-d-flex dcf-ai-center dcf-lh-3"><svg class="dcf-mr-1 dcf-h-4 dcf-w-4 dcf-flex-shrink-0 dcf-fill-current" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path d="M12 23.5c-.3 0-.6-.2-.8-.4-.7-1.1-7-10.7-7-14.7C4.2 4 7.7.5 12 .5s7.8 3.5 7.8 7.8c0 4-6.3 13.6-7 14.7-.2.3-.5.5-.8.5zm0-21c-3.2 0-5.8 2.6-5.8 5.8 0 2.5 3.7 8.9 5.8 12.3 2.2-3.4 5.8-9.8 5.8-12.3 0-3.2-2.6-5.8-5.8-5.8z"/><path d="M12 12.1c-2.1 0-3.7-1.7-3.7-3.7 0-2.1 1.7-3.7 3.7-3.7 2.1 0 3.7 1.7 3.7 3.7s-1.6 3.7-3.7 3.7zm0-5.5c-1 0-1.7.8-1.7 1.7S11.1 10 12 10s1.7-.8 1.7-1.7S13 6.6 12 6.6z"/><path fill="none" d="M0 0h24v24H0z"/></svg>' + location + '</div></div></article></li>';
      });
      $container.append('<div class="dcf-absolute dcf-pin-top dcf-pt-9"><h2 class="dcf-m-0 dcf-txt-xs dcf-uppercase dcf-txt-vertical-lr unl-ls-2 unl-dark-gray">' + type + ' Events</h2></div>');
      grid.append(eventList);
      $container.append(grid);
      $container.append('<div class="dcf-d-flex dcf-jc-flex-end dcf-mt-6"><a class="dcf-btn dcf-btn-secondary" href="' + localConfig.url + typePath + '">More Events</a></div>');
    });

    jqxhr.done(function() {
      require(['dcf-cardAsLink'], function (cardAsLinkModule) {
        var cards = $container[0].querySelectorAll('.dcf-card-as-link');
        if (cards.length > 0) {
          var cardAsLink = new cardAsLinkModule.DCFCardAsLink(cards);
          cardAsLink.initialize();
        }
      });
    });
  };

  var setup = function(config) {
    var localSettings = getLocalEventSettings(),
    defaultConfig = {
      title: localSettings.title || '',
      url: localSettings.href || defaultCal,
      container: container,
      limit: localSettings.limit || 10,
      pinned_limit: localSettings.pinned_limit || 1,
      rooms: false,
      use_band_background: true
    },
    localConfig = $.extend({}, defaultConfig, config);

    // Add trailing slash to URL if missing
    if (localConfig.url && !localConfig.url.match(/\/$/)) {
      localConfig.url += '/';
    }

    // ensure that the URL we are about to use is forced into an https:// protocol. (add https if it starts with //)
    if (localConfig.url && localConfig.url.match(/^\/\//)) {
      localConfig.url = 'https:' + localConfig.url;
    } else if (localConfig.url && localConfig.url.match(/^http:\/\//)) {
      localConfig.url = localConfig.url.replace('http://', 'https://');
    }

    if (localConfig.url && $(localConfig.container).length) {
      fetchEvents(localConfig);
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
