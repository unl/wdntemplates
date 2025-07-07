export default class UNLAnalytics {
    debugMode = import.meta.env.VITE_UNL_GA4_DEBUG_MODE || false;

    unlProp = import.meta.env.VITE_UNL_GA4_PROP || 'G-XYGRJGQFZK';

    thisURL = String(window.location);

    mediaHubOrigin = 'https://mediahub.unl.edu';

    constructor(options={}) {

        // Set up window.UNL.idm.config if not defined yet
        window.UNL = window.UNL || {};
        window.UNL.analytics = window.UNL.analytics || {};
        window.UNL.analytics.config = window.UNL.analytics.config || {};

        if ('debugMode' in window.UNL.analytics.config && typeof window.UNL.analytics.config.debugMode === 'boolean') {
            this.debugMode = window.UNL.analytics.config.debugMode;
        } else if ('debugMode' in options && typeof options.debugMode === 'boolean') {
            this.debugMode = options.debugMode;
        }
        if ('unlProp' in window.UNL.analytics.config && typeof window.UNL.analytics.config.unlProp === 'string') {
            this.unlProp = window.UNL.analytics.config.unlProp;
        } else if ('unlProp' in options && typeof options.unlProp === 'string') {
            this.unlProp = options.unlProp;
        }

        window.UNL.analytics.callTrackEvent = (category, eventAction, label, value, noninteractive=false) => {
            this.callTrackEvent(category, eventAction, label, value, noninteractive);
        };

        // Checks to see if we have initialized things already
        const initializeCheck = document.querySelector('script[data-unl-initialized="true"]');
        if (initializeCheck !== null) {
            return;
        }

        // Gets the head to append scripts to
        const headTag = document.querySelector('head');

        const larueScript = document.querySelector('script[src*="larue.unl.edu"],script[src*="webanalytics.unl.edu"]');
        if (larueScript === null) {
            const newLarueScriptTag = document.createElement('script');
            newLarueScriptTag.innerHTML = `
                var _paq = window._paq = window._paq || [];
                /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
                _paq.push(["setCookieDomain", "*.unl.edu"]);
                _paq.push(["setDomains", ["*.unl.edu"]]);
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                    var u="https://larue.unl.edu/";
                    _paq.push(['setTrackerUrl', u+'main.php']);
                    _paq.push(['setSiteId', '1']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.async=true; g.src=u+'main.js'; s.parentNode.insertBefore(g,s);
                })();
            `;
            headTag.append(newLarueScriptTag);
        }

        // Checks if we have a script for the gtag on the page already
        // If not we will create the script
        const gtagScriptCheck = document.querySelector(`script[src*=googletagmanager][src*='${this.unlProp}']`);
        if (gtagScriptCheck === null) {
            // Creates new gtag script and set up values to match GA4 specifications
            // Append it to the head element
            const newGtagScript = document.createElement('script');
            newGtagScript.setAttribute('async', '');
            newGtagScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.unlProp}`);
            headTag.append(newGtagScript);
        }

        // Set up initial state of the gtag
        // Append it to the head element
        const newGtagSetup = document.createElement('script');
        newGtagSetup.dataset.unlInitialized = 'true'; // This will let us know if we have initialize already
        newGtagSetup.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${this.unlProp}", {
                ${this.debugMode ? 'debug_mode: true,' : ''}
            });
            // These will be updated once idm initializes
            gtag('set', 'user_properties', {
                UNL_Affiliation: "None",
                login_status: "Not Logged In",
            });
        `;
        headTag.append(newGtagSetup);

        window.addEventListener('idmStateSet', () => {
            let affiliation = window.UNL.idm.getPrimaryAffiliation();

            // Clean up data
            affiliation = affiliation.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            this.#gtag('set', 'user_properties', {
                'UNL_Affiliation': affiliation,
                'login_status': affiliation === 'None' ? 'Not Logged In' : 'Logged In',
            });
        });

        window.UNL.analytics.loaded = true;
        document.dispatchEvent(new CustomEvent(UNLAnalytics.events('UNLAnalyticsReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            UNLAnalyticsReady: 'UNLAnalyticsReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    /**
     * This function will send a page_view event to GA4.
     * GTAG config will send the initial page_view event so this does not need to run on page load.
     * @param {string} thePage URL of the page that has or will be viewed
     * @return { void }
     */
    callTrackPageview(thePage) {
        const eventData = {
            'page_location': thePage,
            'send_to': this.unlProp,
        };
        if (this.debugMode) {
            eventData['debug_mode'] = true;
        }

        this.#gtag('event', 'page_view', eventData);
    }

    /**
     * This function will send any event with specific data to GA4.
     * @param { string } eventName Name of the event to be sent
     * @param { Object } event_data Data to be send to GA4
     * @return { void }
     */
    sendEvent(eventName, eventData) {
        // Send it to only our Measurement ID
        eventData['send_to'] = this.unlProp;

        // If debug mode is set we will add that
        if (this.debugMode) {
            eventData['debug_mode'] = true;
        }

        this.#gtag('event', eventName, eventData);
    }

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
    callTrackEvent(category, eventAction, label, value, noninteractive=false) {
        // Set up event data to send
        const eventData = {
            'event_category': category,
            'event_label': label,
            'send_to': this.unlProp,
        };

        // If debug mode is set we will add that
        if (this.debugMode) {
            eventData['debug_mode'] = true;
        }

        // If value is set we will add that
        if (value !== undefined) {
            eventData.value = value;
        }

        // If noninteractive is set we will add that
        if (noninteractive) {
            eventData.noninteractive = true;
        }

        // Send the event
        this.#gtag('event', eventAction, eventData);
    }

    /**
     * This function will set up event listeners for Media Hub related events
     * @return { void }
     */
    recordMediaHubEvents() {
        // Set up event listener to get mediahub message
        window.addEventListener('message', function(event) {
            // Validate origin
            if (this.mediaHubOrigin !== event.origin) {
                return;
            }

            // Check if it has a event for us
            if (event.data.message_type !== 'ga_event') {
                // not a ga event (maybe different event types in future?)
                return;
            }

            // Record the event if it does
            this.callTrackEvent('media', event.data.event, event.data.media_title);
        });
    }

    #gtag(arg1, arg2, arg3) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        gtag(arg1, arg2, arg3);
    }
}
