define(['jquery', 'wdn', 'require'], function($, WDN, require) {
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
                    if (!data.Events.Event) {
                        return;
                    }

                    $.each(data.Events.Event, function(index, event) {
                        var eventURL = event.WebPages.WebPage;
                        if($.isArray(eventURL)) {
                            var eventURL = event.WebPages.WebPage[0].URL;
                        }
                        else {
                            var eventURL = event.WebPages.WebPage.URL;
                        }


                        var parts   = event.DateTime.StartDate.split('-');
                        var year    = parts[0];
                        var month = parts[1];
                        var day     = parseInt(parts[2], 10);
                        switch (month) {
                            case '01':
                                month = 'Jan';
                            break;

                            case '02':
                                month = 'Feb';
                            break;

                            case '03':
                                month = 'March';
                            break;

                            case '04':
                                month = 'April';
                            break;

                            case '05':
                                month = 'May';
                            break;

                            case '06':
                                month = 'June';
                            break;

                            case '07':
                                month = 'July';
                            break;

                            case '08':
                                month = 'Aug';
                            break;

                            case '09':
                                month = 'Sept';
                            break;

                            case '10':
                                month = 'Oct';
                            break;

                            case '11':
                                month = 'Nov';
                            break;

                            case '12':
                                month = 'Dec';
                            break;
                        }
                        var time    = '';
                        var ampm = '';
                        var hour    = '';
                        if (event.DateTime.StartTime) {
                            time = event.DateTime.StartTime.substring(0, 5);
                            hour = event.DateTime.StartTime.substring(0, 2);
                            if (hour > 12) {
                                ampm = 'pm';
                                hour = hour - 12;
                                time = hour + time.substring(2);
                            } else {
                                ampm = 'am';
                            }
                        }

                        var location = event.Locations.Location.Address.BuildingName;

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


