import UNLDialog from '@js-src/components/unl-dialog.js';

export default class UNLSearch {
    searchContainer = null;

    searchDialogElement = null;

    domDesktopSearchLink = null;

    domDesktopSearchBtns = [];

    domMobileSearchLink = null;

    domMobileSearchBtns = [];

    mobileSearchBtn = null;

    domSearchResultWrapper = null;

    domQ = null;

    domSearchForm = null;

    domEmbed = null;

    searchEmbedVersion = '5.0';

    submitted = false;

    postReady = false;

    searchHost = import.meta.env.VITE_UNL_SEARCH_URL || 'https://search.unl.edu'; // domain of UNL Search app

    searchPath = '/'; // path to UNL Search app

    allowSearchParams = ['u', 'cx'];  // QS Params allowed by UNL Search app

    searchAction = '';

    searchFrameAction = '';

    siteHomepage = '';

    localSearch = null;

    progress = null;

    unlSearch = null;

    searchOpenedEvent = new Event(UNLSearch.events('searchOpened'));

    searchClosedEvent = new Event(UNLSearch.events('searchClosed'));

    constructor() {
        this.searchContainer = document.getElementById('dcf-search');

        this.searchDialogElement = document.querySelector('dialog#dcf-search-dialog');
        if (this.searchDialogElement === null) {
            throw new Error('Missing Search Dialog Element');
        }

        // Get Search links and buttons
        this.domDesktopSearchLink = document.getElementById('dcf-search-toggle-link');
        this.domDesktopSearchBtns = Array.from(document.getElementsByClassName('dcf-btn-search-desktop'));
        this.domMobileSearchLink = document.getElementById('dcf-mobile-search-link');
        this.domMobileSearchBtns = Array.from(document.getElementsByClassName('dcf-btn-search-mobile'));

        // Disable links and Enable buttons
        this.mobileSearchBtn = null;
        if (this.domMobileSearchLink && this.domMobileSearchBtns && this.domMobileSearchBtns.length) {
            this.domMobileSearchLink.setAttribute('hidden', '');
            this.domMobileSearchBtns.forEach((singleMobileButton) => {
                singleMobileButton.removeAttribute('hidden');
                singleMobileButton.setAttribute('aria-expanded', 'false');
                singleMobileButton.setAttribute('aria-label', 'Open search');
                singleMobileButton.innerHTML = this.domMobileSearchLink.innerHTML;
                this.mobileSearchBtn = singleMobileButton;
            });
        }

        if (this.domDesktopSearchLink && this.domDesktopSearchBtns && this.domDesktopSearchBtns.length) {
            this.domDesktopSearchLink.setAttribute('hidden', '');
            this.domDesktopSearchLink.setAttribute('aria-hidden', true);
            this.domDesktopSearchBtns.forEach((singleDesktopButton) => {
                singleDesktopButton.removeAttribute('hidden');
                singleDesktopButton.setAttribute('aria-expanded', 'false');
                singleDesktopButton.setAttribute('aria-label', 'Open search');
                singleDesktopButton.innerHTML = this.domDesktopSearchLink.innerHTML;
            });
        }

        this.domSearchResultWrapper = document.getElementById('dcf-search-results-wrapper');
        this.domQ = document.getElementById('dcf-search_query');
        this.domSearchForm = document.getElementById('dcf-search-form');
        this.searchAction = `${this.searchHost}${this.searchPath}`;
        this.searchFrameAction = `${this.searchAction}?embed=${this.searchEmbedVersion}`;
        this.siteHomepage = `${location.protocol}//${location.host}/`;
        this.localSearch = this.#getLocalSearch();

        // Give up if the search form has been unexpectedly removed
        if (!this.domSearchForm) {
            return;
        }

        // Ensure the default action is the UNL Search app
        if (this.domSearchForm.action !== this.searchAction) {
            this.domSearchForm.setAttribute('action', this.searchAction);
        }

        if (this.localSearch && this.localSearch.indexOf(`${this.searchAction}?`) === 0) {
            // Attempt to parse the allowed UNL Search parameter overrides allowed
            let localSearchParams;
            try {
                if (window.URLSearchParams) {
                    localSearchParams = new URLSearchParams(this.localSearch.slice(this.localSearch.indexOf('?') + 1));

                    for (let index = 0; index < this.allowSearchParams.length; index++) {
                        if (localSearchParams.has(this.allowSearchParams[index])) {
                            const input = document.createElement('input');
                            input.type = 'hidden';
                            input.name = this.allowSearchParams[index];
                            input.value = localSearchParams.get(this.allowSearchParams[index]);
                            this.domSearchForm.appendChild(input);
                        }
                    }
                } else {
                    let paramPair;
                    localSearchParams = this.localSearch.slice(this.localSearch.indexOf('?') + 1).split('&');
                    for (let index = 0; index < localSearchParams.length; index++) {
                        paramPair = localSearchParams[index].split('=');
                        if (this.allowSearchParams.indexOf(paramPair[0]) >= 0) {
                            const input = document.createElement('input');
                            input.type = 'hidden';
                            input.name = paramPair[0];
                            input.value = decodeURIComponent(paramPair[1]);
                            this.domSearchForm.appendChild(input);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        } else if (this.siteHomepage && !(/^https?:\/\/www\.unl\.edu\/$/.test(this.siteHomepage))) {
            // Otherwise default to adding a local param for this site's homepage (but not UNL top)
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'u';
            input.value = this.siteHomepage;
            this.domSearchForm.appendChild(input);
            this.searchFrameAction += `&u=${encodeURIComponent(this.siteHomepage)}`;
        }

        // Create a loading indicator
        this.progress = document.createElement('progress');
        this.progress.setAttribute('id', 'wdn_search_progress');
        this.progress.innerText = 'Loading...';

        // Add an input to the form to let the search application know that we want the embedded format
        this.domEmbed = document.createElement('input');
        this.domEmbed.type = 'hidden';
        this.domEmbed.name = 'embed';
        this.domEmbed.value = this.searchEmbedVersion; // Specify which theme version for search

        // Add a parameter for triggering the iframe compatible rendering
        this.domSearchForm.appendChild(this.domEmbed);

        // Add an event listener for close search from search iframe
        window.addEventListener('message', function(event) {
            if (event.data === UNLSearch.events('iframeMessage')) {
                this.closeSearch();
            }
        }, false);

        // Set up dialog open and close listeners
        this.searchDialogElement.addEventListener(UNLDialog.events('dialogPreOpen'), this.#dialogOpened.bind(this));
        this.searchDialogElement.addEventListener(UNLDialog.events('dialogPostClose'), this.#dialogClosed.bind(this));

        // Set up form submit listeners
        this.domSearchForm.addEventListener('submit', this.#handleFormSubmit.bind(this));

        this.searchContainer.dispatchEvent(new CustomEvent(UNLSearch.events('searchReady'), {
            detail: {
                classInstance: this,
            },
        }));

        this.searchDialogElement.dispatchEvent(new CustomEvent(UNLSearch.events('searchReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            searchReady: 'searchReady',
            iframeMessage: 'wdn.search.close',
            searchClosed: 'searchClosed',
            searchOpened: 'searchOpened',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    /**
     * Handles when the search form submits
     *
     * @param {Event} event
     * @returns { Void }
     */
    #handleFormSubmit(event) {
        event.preventDefault();

        // Enable the iframe search params
        this.#createSearchFrame();
        this.#activateSearch();
        this.domEmbed.disabled = false;

        // This is band-aid to fix the issue with the double scroll bar
        this.domSearchResultWrapper.parentElement.classList.add('dcf-overflow-y-hidden');
        this.domSearchResultWrapper.parentElement.classList.remove('dcf-overflow-y-auto');

        if (!event.detail || event.detail !== 'auto') {
            // a11y: send focus to the results if manually submitted
            this.unlSearch.focus();
        }

        // Support sending messages to iframe without reload
        if (this.postReady) {
            this.#postSearchMessage(this.domQ.value);
        }
    }

    /**
     * Creates the search iframe element
     *
     * @returns { Void }
     */
    #createSearchFrame() {
        // Lazy create the search iframe
        if (this.unlSearch === null) {
            this.unlSearch = document.createElement('iframe');
            this.unlSearch.name = 'unlsearch';
            this.unlSearch.setAttribute('id', 'wdn_search_frame');
            this.unlSearch.title = 'Search';
            this.unlSearch.className = 'dcf-b-0 dcf-w-100% dcf-h-100%';
            this.unlSearch.src = `${this.searchFrameAction}&q=${this.domQ.value}`;

            this.unlSearch.addEventListener('load', function() {
                this.postReady = true; // iframe should be ready to post messages to
                this.progress.remove();
            }.bind(this));

            this.domSearchResultWrapper.appendChild(this.progress);
            this.domSearchResultWrapper.appendChild(this.unlSearch);

            this.searchDialogElement.style.height = '100%';
        }
    }

    /**
     * Activates search input
     *
     * @returns { Void }
     */
    #activateSearch() {
        this.domSearchForm.parentElement.classList.add('active');
        this.progress.remove();
    }

    /**
     * Posts new queries into the iframe instead of having to reload it every time
     *
     * @param { String } query
     * @returns { Void }
     */
    #postSearchMessage(query) {
        this.unlSearch.contentWindow.postMessage({type: 'search', query: query}, this.searchHost);
        this.progress.remove();
    }

    /**
     * Function to be called when the dialog closes
     *
     * @returns { Void }
     */
    #dialogClosed() {
        this.domQ.value = '';
        this.domSearchForm.parentElement.classList.remove('active');
        this.domSearchForm.reset();

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        gtag('event', 'UNL_search_closed', {
            'app_name': 'UNL_search',
        });

        if (this.unlSearch) {
            this.unlSearch = null;
            this.domSearchResultWrapper.innerHTML = '';
            this.postReady = false;
        }

        document.dispatchEvent(this.searchClosedEvent);
    }

    /**
     * Function to be called when the dialog Opens
     *
     * @returns { Void }
     */
    #dialogOpened() {
        document.dispatchEvent(this.searchOpenedEvent);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        gtag('event', 'UNL_search_opened', {
            'app_name': 'UNL_search',
        });
    }

    /**
     * Gets local search link on the page
     *
     * @returns { String|null }
     */
    #getLocalSearch() {
        const link = document.querySelector('link[rel="search"]');
        if (link && link.type !== 'application/opensearchdescription+xml') {
            return link.href;
        }

        return null;
    }
}
