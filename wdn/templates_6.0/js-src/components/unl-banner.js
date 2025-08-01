import { isValidHttpUrl, getSessionStorage, setSessionStorage, removeSessionStorage } from '../lib/unl-utility.js';

export default class UNLNoticeBanner {

    bannerContainer = null;

    bannerElement = null;

    messageSource = null;

    messageKey = null;

    skipNav = document.getElementById('dcf-skip-nav');

    clearMessageIntervalSecs = 15 * 60 * 1000;

    constructor(options={}) {
        this.messageSource = 'https://its-unl-cms-prd-s3.s3.amazonaws.com/wdn-message.html';
        this.messageKey = 'UNLNoticeMessage';

        // Get the message and build the banner
        this.#getMessage().then((messageToDisplay) => {
            this.#buildBanner(messageToDisplay);
        });

        if ('clearMessageIntervalSecs' in options && typeof options.clearMessageIntervalSecs === 'number') {
            this.clearMessageIntervalSecs = options.clearMessageIntervalSecs;
        }

        // Remove session storage for that banner ever now and then
        setInterval(() => {
            removeSessionStorage(this.messageKey);
        }, this.clearMessageIntervalSecs );

        document.dispatchEvent(new CustomEvent(UNLNoticeBanner.events('UNLBannerReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            UNLBannerReady: 'UNLBannerReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    /**
     * Builds the banner and places it on the page
     * @param { string|null } messageToDisplay 
     */
    #buildBanner(messageToDisplay) {
        if (messageToDisplay === null && messageToDisplay === '') {
            return;
        }
        this.bannerElement = document.createElement('div');
        this.bannerElement.classList.add('dcf-d-none@print');
        this.bannerElement.innerHTML = messageToDisplay;
        if (this.skipNav !== null) {
            this.skipNav.parentNode.insertBefore( this.bannerElement, this.skipNav.nextSibling);
        } else {
            document.body.prepend( this.bannerElement);
        }
    }

    /**
     * Gets the data from session, or fetches from url, or the message source
     * It will also store the message in session data
     * @returns { Promise<String> } Message string
     */
    async #getMessage() {
        const sessionData = getSessionStorage(this.messageKey);
        if (sessionData !== null) {
            return sessionData;
        }

        let returnText = '';
        if (isValidHttpUrl(this.messageSource)) {
            returnText = await this.#fetchMessageFromUrl();
        } else {
            returnText = this.messageSource;
        }

        setSessionStorage(this.messageKey, returnText);
        return returnText;
    }

    /**
     * Fetches message from Url
     * @returns { Promise<String> } Fetched message
     */
    async #fetchMessageFromUrl() {
        const response = await fetch(this.messageSource);
        if (!response.ok) {
            throw new Error(`Failed to fetch banner data: ${response.status}`);
        }
        return await response.text();
    }
}
