export default class UNLQa {

    /**
     * @type { HTMLElement|null }
     */
    qaLink = null;

    webauditQueryUrl = 'https://webaudit.unl.edu/registry/closest/?format=json&query=';

    constructor() {
        this.qaLink = document.getElementById('qa-test');

        if (this.qaLink !== null) {
            this.#appendLinkWithLocation();
            this.#appendLinkWithStar();
        }

        this.qaLink.dispatchEvent(new CustomEvent(UNLQa.events('qaReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            qaReady: 'qaReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    #appendLinkWithLocation() {
        let pathname = document.location.pathname;

        // webaudit expects pages to end with a slash, so add one if missing
        if (!pathname.match(/\..*$/) && !pathname.match(/\/$/)) {
            pathname += '/';
        }

        const currentHref = this.qaLink.getAttribute('href');
        this.qaLink.setAttribute('href', `${currentHref}?url=${encodeURI(document.location.origin + pathname)}`);
    }

    async #appendLinkWithStar() {
        const gpa = await this.#fetchScore();

        if (gpa === null) {
            return;
        }

        if (gpa === 100) {
            const starIcon = document.createElement('span');
            starIcon.setAttribute('aria-hidden', 'true');
            starIcon.innerHTML = '&nbsp;&starf;';

            const starText = document.createElement('span');
            starText.classList.add('dcf-sr-only');
            starText.innerText = '100% (gold star)';

            this.qaLink.after(starIcon, starText);
        } else if (gpa >= 90) {
            const starIcon = document.createElement('span');
            starIcon.setAttribute('aria-hidden', 'true');
            starIcon.innerHTML = '&nbsp;&star;';

            const starText = document.createElement('span');
            starText.classList.add('dcf-sr-only');
            starText.innerText = `${gpa}% (silver star)`;

            this.qaLink.after(starIcon, starText);
        }
    }

    #getBaseUrl() {
        const baseTag = document.querySelector('base');
        let baseUrl = window.location;
        if (baseTag !== null) {
            const baseTagHref = baseTag.getAttribute('href');
            if (baseTagHref.length > 1 && baseTagHref !== null) {
                try {
                    const parsedUrl = new URL(baseTagHref);
                    baseUrl = parsedUrl.toString();
                } catch {
                    // intentionally blank
                }
            }
        }

        //Otherwise use the current page URL which will result in a request to webaudit for every page on the site
        return baseUrl;
    }

    /**
     * 
     * @returns { Promise<Number|null> }
     */
    async #fetchScore() {
        try {
            const baseURIEncoded = encodeURIComponent(this.#getBaseUrl());
            const response = await fetch(`${this.webauditQueryUrl}${baseURIEncoded}`);
            if (!response.ok) {
                return null;
            }
            const jsonData = await response.json();
            if (!('gpa' in jsonData)) {
                return null;
            }

            return parseFloat(jsonData.gpa);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
