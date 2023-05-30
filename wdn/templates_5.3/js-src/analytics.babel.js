/**
 * Analytics (GA4)
 */
define(['wdn', 'idm'], function (WDN, idm) {
    // Set up variables
    let debug_mode = false;
    let wdnProp = 'G-XYGRJGQFZK';

    // This allows grunt to overwrite these variables if they are set
    //#DEBUG_MODE
    //#wdnProp

    // Set up other variables that are used in the code
    let Plugin;
    const thisURL = String(window.location);
    const mediaHubOrigin = 'https://mediahub.unl.edu';

    /**
     * Set up function for adding custom events to link clicks
     * @return { void }
     */
    const bindLinks = () => {
        // Gets all the links in the nav and main sections
        const navLinks = document.querySelectorAll('#dcf-navigation a');
        const mainLinks = document.querySelectorAll('#dcf-main a');

        // Set up REGEX for file extensions
        const filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v|mov|mp4)$/i;

        // Set up function to add event listener to link
        const evaluateLinks = (link) => {
            // Get the link and if its missing then exit the function
            const gahref = link.getAttribute("href");
            if (!gahref) {
                return;
            }

            // Outgoing link
            if (gahref.match(/^https?:/i) && !gahref.includes(location.hostname)) {
                // Set up when clicked it will send a custom "Outgoing Link" event
                link.addEventListener('click', () => {
                    Plugin.sendEvent('Outgoing Link', {
                        outgoing_link: gahref,
                    });
                    // Not sure if we need this but it will track a page view on that link href
                    Plugin.callTrackPageview(gahref, false);
                });
            // Email link
            } else if (gahref.match(/^mailto\:/i)) {
                // Parse out the email
                var mailLink = gahref.replace(/^mailto\:/i, '');
                // Set up when clicked it will send a custom "Email" event
                link.addEventListener('click', () => {
                    Plugin.sendEvent('Email', {
                        email: mailLink,
                    });
                });
            // File Download link
            } else if (gahref.match(filetypes)) {
                // Set up when clicked it will send a custom "File Download" event
                link.addEventListener('click', () => {
                    Plugin.sendEvent('File Download', {
                        file: gahref,
                    });
                    // Not sure if we need this but it will track a page view on that link href
                    Plugin.callTrackPageview(gahref);
                });
            }
        };

        // Run that function on each link in both the nav and main sections
        navLinks.forEach(evaluateLinks);
        mainLinks.forEach(evaluateLinks);
    }

    // This is the object that will be returned
    Plugin = {
        /**
         * Initializes gtag and create event listeners
         * @return { void }
         */
        initialize: function() {
            WDN.log("WDN site analytics loaded for " + thisURL);

            // Checks if we have a script for the gtag on the page already
            // If not we will create the script and set up initial items
            const gtag_script_check = document.querySelector(`script[src*=googletagmanager][src*=${wdnProp}]`);
            if (gtag_script_check === null) {
                // Gets the head to append scripts to
                let head_tag = document.querySelector('head');

                // Creates new gtag script and set up values to match GA4 specifications
                // Append it to the head element
                let new_gtag_script = document.createElement('script');
                new_gtag_script.setAttribute('async', '');
                new_gtag_script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${wdnProp}`);
                head_tag.append(new_gtag_script);

                // Set up initial state of the gtag
                // Append it to the head element
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
                    // These will be updated once idm initializes
                    gtag('set', 'user_properties', {
                        UNL_Affiliation: "None",
                        login_status: "Not Logged In",
                    });
                `;
                head_tag.append(new_gtag_setup);

                // Run bind links to set up those event listeners
                // We only want this to run once
                bindLinks();

                // Set up idm to track user affiliation and login status
                idm.initialize(() => {
                    // Once idm is ready we will update the user property
                    // This will not run if the user is not logged in
                    window.addEventListener('idmStateSet', () => {
                        // Get user affiliation
                        let affiliation = idm.getPrimaryAffiliation();

                        // Clean up data
                        if (affiliation === "false") {
                            affiliation = "None";
                        } else {
                            affiliation = affiliation.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                                return letter.toUpperCase();
                            });
                        }

                        // set the user's new properties
                        gtag('set', 'user_properties', {
                            UNL_Affiliation: affiliation,
                            login_status: "Logged In",
                        });
                    });
                });
            }
        },

        /**
         * This function will send a page_view event to GA4.
         * GTAG config will send the initial page_view event so this does not need to run on page load.
         * @param {string} thePage URL of the page that has or will be viewed
         * @return { void }
         */
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
        /**
         * This function will send any event with specific data to GA4.
         * @param { string } eventName Name of the event to be sent
         * @param { Object } event_data Data to be send to GA4
         * @return { void }
         */
        sendEvent: function(eventName, event_data) {
            // Send it to only our Measurement ID
            event_data.send_to = wdnProp;

            // If debug mode is set we will add that
            if (debug_mode) {
                event_data.debug_mode = true;
            }
            gtag('event', eventName, event_data);
        },
        /**
         * This function will send any event to GA4.
         * !This will not be able to send any custom data.
         * @deprecated
         * @param { string } category Event category
         * @param { string } eventAction Event name
         * @param { string } label Label for the event
         * @param { string } value Value of the send
         * @param { bool } noninteractive If the event was interactive or not
         * @return { void }
         */
        callTrackEvent: function(category, eventAction, label, value, noninteractive=false) {
            // Set up event data to send
            let event_data = {
                'event_category': category,
                'event_label': label,
                'send_to': wdnProp
            };

            // If debug mode is set we will add that
            if (debug_mode) {
                event_data.debug_mode = true;
            }

            // If value is set we will add that
            if (value != undefined) {
                event_data.value = value;
            }

            // If noninteractive is set we will add that
            if (noninteractive) {
                event_data.noninteractive = true;
            }

            // Send the event
            gtag('event', eventAction, event_data);
        },
        /**
         * This function will set up event listeners for Media Hub related events
         * @return { void }
         */
        recordMediaHubEvents: function() {
            // Set up event listener to get mediahub message
            window.addEventListener('message', function (e) {
                // Validate origin
                if (mediaHubOrigin != e.origin) {
                    return;
                }

                // Check if it has a event for us
                if ('ga_event' != e.data.message_type) {
                    // not a ga event (maybe different event types in future?)
                    return;
                }

                // Record the event if it does
                Plugin.callTrackEvent('media', e.data.event, e.data.media_title);
            });
        }
    };

    // Return the plugin
    return Plugin;
});
