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
            var url = localConfig.url + '?format=json&limit=' + localConfig.limit;
                $.getJSON(url, function(data) {
                    if (!data.Events) {
                        return;
                    }

                    $.each(data.Events, function(index, event) {
                        var eventURL = event.WebPages[0].URL;
                        var date     = moment(event.DateTime.StartDate);
                        var month    = date.format('MMM');
                        var day      = date.format('D');
                        var time     = date.format('h:m');
                        var ampm     = date.format('a');
                        var location = event.Locations[0].Address.BuildingName;

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


