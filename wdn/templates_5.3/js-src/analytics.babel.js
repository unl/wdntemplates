define(['wdn', 'idm'], function (WDN, idm) {
    let debug_mode = false;
    let wdnProp = 'G-XYGRJGQFZK';
    //#DEBUG_MODE
    //#wdnProp

	let Plugin;
	const thisURL = String(window.location);
	const mediaHubOrigin = 'https://mediahub.unl.edu';

    const bindLinks = () => {
        const navLinks = document.querySelectorAll('#dcf-navigation a');
        const mainLinks = document.querySelectorAll('#dcf-main a');
        const filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v|mov|mp4)$/i;

        const evaluateLinks = (link) => {
            const gahref = link.getAttribute("href");
            if (!gahref) {
                return;
            }

            if (gahref.match(/^https?\:/i) && !gahref.includes(location.hostname)) {
                link.addEventListener('click', () => {
                    Plugin.sendEvent('Outgoing Link', {
                        outgoing_link: gahref,
                    });
                    Plugin.callTrackPageview(gahref, false);
                });
            } else if (gahref.match(/^mailto\:/i)) {
                var mailLink = gahref.replace(/^mailto\:/i, '');
                link.addEventListener('click', () => {
                    Plugin.sendEvent('Email', {
                        email: mailLink,
                    });
                });
            } else if (gahref.match(filetypes)) {
                link.addEventListener('click', () => {
                    Plugin.sendEvent('File Download', {
                        file: gahref,
                    });
                    Plugin.callTrackPageview(gahref);
                });
            }
        };

        navLinks.forEach(evaluateLinks);
        mainLinks.forEach(evaluateLinks);
    }

    const gtag_script_check = document.querySelector(`script[src*=googletagmanager][src*=${wdnProp}]`);
    if (gtag_script_check === null) {
        let head_tag = document.querySelector('head');

        let new_gtag_script = document.createElement('script');
        new_gtag_script.setAttribute('async', '');
        new_gtag_script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${wdnProp}`);
        head_tag.append(new_gtag_script);

        let new_gtag_setup = document.createElement('script');
        new_gtag_setup.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${wdnProp}", {
                ${debug_mode ? "debug_mode: true," : ""}
            });
        `;
        head_tag.append(new_gtag_setup);

        idm.initialize(() => {
            bindLinks();
            window.addEventListener('idmStateSet', () => {
                let affiliation = idm.getPrimaryAffiliation();
                gtag('set', 'user_properties', {
                    WDN_Affiliation: affiliation,
                });
            });
        });
    }

    Plugin = {
        initialize: function() {
            WDN.log("WDN site analytics loaded for " + thisURL);
        },
        callTrackPageview: function(thePage) {
            let event_data = {
                'page_location': thePage,
                'send_to': wdnProp
            };

            if (debug_mode) {
                event_data.debug_mode = true;
            }

            gtag('event', 'page_view', event_data);
        },
        sendEvent: function(eventName, event_data) {
            event_data.send_to = wdnProp;
            if (debug_mode) {
                event_data.debug_mode = true;
            }
            gtag('event', eventName, event_data);
        },
        callTrackEvent: function(category, eventAction, label, value, noninteractive=false) {
            let event_data = {
                'event_category': category,
                'event_label': label,
                'send_to': wdnProp
            };

            if (debug_mode) {
                event_data.debug_mode = true;
            }

            if (value != undefined) {
                event_data.value = value;
            }

            if (noninteractive) {
                event_data.noninteractive = true;
            }

            gtag('event', eventAction, event_data);
        },
        recordMediaHubEvents: function() {
            window.addEventListener('message', function (e) {
				let originalEvent = e.originalEvent;

				if (mediaHubOrigin != originalEvent.origin) {
					//Verify the origin
					return;
				}

				if ('ga_event' != originalEvent.data.message_type) {
					//not a ga event (maybe different event types in future?)
					return;
				}

				Plugin.callTrackEvent('media', originalEvent.data.event, originalEvent.data.media_title);
			});
        }
    };

    return Plugin;
});
