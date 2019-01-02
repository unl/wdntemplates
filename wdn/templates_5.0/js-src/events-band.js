define([
	'wdn',
	'jquery',
	'moment',
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
        var upcoming = 'upcoming/',
            $container = $(localConfig.container).addClass('dcf-bleed dcf-wrapper dcf-pt-9 dcf-pb-8 unl-bg-lightest-gray unl-bg-grit'),
            grid = document.createElement('div');
            grid.classList.add('unl-offset-grid', 'dcf-d-grid', 'dcf-col-gap-4');
            eventList = document.createElement('ul');
            eventList.classList.add('unl-event-teaser-list', 'dcf-list-bare', 'dcf-d-grid', 'dcf-col-gap-vw', 'dcf-row-gap-6', 'dcf-mb-0');

        if (localConfig.url.match(/upcoming\/$/)) {
            //Don't add the upcoming endpoint if it already exists.
            upcoming = '';
        }
        var url = localConfig.url + upcoming + '?format=json&limit=' + localConfig.limit;
        $.getJSON(url, function(data) {
            if (!data.Events) {
                return;
            }

            $.each(data.Events.Event || data.Events, function(index, event) {
                var date;
                if (event.DateTime.Start) {
                    date = moment.parseZone(event.DateTime.Start);
                } else {
                    //legacy
                    date = moment.parseZone(event.DateTime.StartDate +  'T' + event.DateTime.StartTime.substring(0, event.DateTime.StartTime.length - 1));
                }
                var month    = date.format('MMM');
                var day      = date.format('D');
                var time     = date.format('h:mm');
                var ampm     = date.format('a');
                var location = '';

                if (event.Locations[0] && event.Locations[0].Address.BuildingName) {
                    location = event.Locations[0].Address.BuildingName;
                }

                if (localConfig.rooms) {
                    if (event.Room) {
                        var room = event.Room;
                        if (room.match(/^room /i)) {
                            room = room.substring(5);
                        }
                        if (location != '') {
                            location = location + '<br>';
                        }
                        location = location + 'Room: ' + room;
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

               eventList.innerHTML += '<li class="unl-event-teaser dcf-d-grid dcf-col-gap-4 dcf-mb-0"><h3 class="unl-event-title dcf-mb-0 dcf-lh-3 dcf-bold dcf-txt-h6 unl-lh-crop"><a class="dcf-txt-decor-hover unl-darker-gray" href="' + eventURL + '">' + event.EventTitle + '</a></h3><div class="unl-event-datetime dcf-flex-shrink-0 dcf-w-8 dcf-mr-5 dcf-txt-center">' + '<span class="unl-event-month dcf-d-block dcf-txt-3xs dcf-pt-2 dcf-pb-1 dcf-uppercase dcf-bold unl-ls-2 unl-font-sans unl-cream unl-bg-scarlet">' + month + '</span><span class="unl-event-day dcf-d-block dcf-txt-h5 dcf-bold dcf-br-1 dcf-bb-1 dcf-bl-1 dcf-br-solid dcf-bb-solid dcf-bl-solid dcf-bg-white unl-br-light-gray unl-bb-light-gray unl-bl-light-gray unl-darker-gray">' + day + '</span><span class="unl-event-time dcf-d-block dcf-pt-2 dcf-txt-2xs dcf-uppercase dcf-bold unl-font-sans unl-scarlet">' + time + ' ' + ampm + '</span>' + '</div><div class="unl-event-location dcf-txt-xs dcf-pt-1 unl-font-sans unl-dark-gray">' + location + '</div></li>';
            });
            $container.append('<div class="dcf-absolute dcf-pin-top dcf-pt-9"><h2 class="dcf-m-0 dcf-txt-xs dcf-uppercase dcf-txt-vertical-lr unl-ls-2 unl-dark-gray">Upcoming Events</h2></div>');
            grid.append(eventList);
            $container.append(grid);
            $container.append('<div class="dcf-d-flex dcf-jc-flex-end dcf-mt-6"><a class="dcf-btn dcf-btn-secondary" href="' + localConfig.url + '">More Events</a></div>');
        });
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
