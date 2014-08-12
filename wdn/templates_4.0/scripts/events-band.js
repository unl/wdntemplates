define(['jquery', 'wdn', 'require', 'moment'], function($, WDN, require, moment) {
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
    defaultCal = '//events.unl.edu/';

    var fetchEvents = function(localConfig) {
            var upcoming = 'upcoming/';
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
                            date = moment(event.DateTime.Start);
                        } else {
                            //legacy
                            date = moment(event.DateTime.StartDate +  'T' + event.DateTime.StartTime.substring(0, event.DateTime.StartTime.length - 1));
                        }
                        var month    = date.format('MMM');
                        var day      = date.format('D');
                        var time     = date.format('h:mm');
                        var ampm     = date.format('a');
                        var location = '';

                        if (event.Locations[0]) {
                            location = event.Locations[0].Address.BuildingName;
                        }

                        var eventURL = '';
                        if ($.isArray(event.WebPages)) {
                            eventURL = event.WebPages[0].URL
                        } else if ($.isArray(event.WebPages.WebPage)) {
                            eventURL = event.WebPages.WebPage[0].URL
                        } else {
                            eventURL = event.WebPages.WebPage.URL;
                        }

                        $('#events-band').append('<div class="wdn-col"> <a href="' + eventURL + '" target="_blank"><div class="event"> <div class="dateTime">' + '<span class="month">'+month+'</span><span class="day">'+day+'</span><span class="time">'+time+' '+ampm+'<\/span>' + '<\/div> <div class="eventInfo"><p class="eventTitle">'
                            + event.EventTitle + '</p><span class="location">' + location + ' </span>' + '</div></div></a></div>');

                    });
                    $('#events-band').append('<div class="wdn-col-full"><p class="more-events"><a href="' + localConfig.url + '" target="_blank">More Events</a></p></div>');
                });
    }

    var setup = function(config) {
        var localSettings = getLocalEventSettings(),
        defaultConfig = {
            title: localSettings.title || '',
            url: localSettings.href || defaultCal,
            container: container,
            limit: localSettings.limit || 10
        },
        localConfig = $.extend({}, defaultConfig, config);

        if (localConfig.url && $(localConfig.container).length) {
            WDN.loadCSS(WDN.getTemplateFilePath('css/layouts/events-band.css'));
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


