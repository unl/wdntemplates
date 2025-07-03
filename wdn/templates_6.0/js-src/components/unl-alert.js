import { loadJS, setCookie, getCookie } from '../lib/unl-utility.js';
import unlalertCssUrl from '@scss/components-js/_unlalert.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

export default class UNLAlert {
    alertDataUrl;

    alertDataActiveIDs = [];

    serverCallTimeoutID;

    closedAlertCookieName = 'unlAlertsC';

    alertDataReceivedCookieName = 'unlAlertsData';

    activeAlertCookieName = 'unlAlertsA';

    serverCallExecutionDelay = 30000; // Delay (in milliseconds) before executing the checkIfServerCallIsNeeded function

    serverCallExecutionDelayTwo = 31000; // Secondary delay (in milliseconds) before executing the checkIfServerCallIsNeeded function

    alertDataReceivedCookieMaxAge = 30; // Maximum age (in seconds) for the alertDataReceived cookie

    closedAlertCookieMaxAge = 3600; // Maximum age (in seconds) for the alertDataReceived cookie

    constructor() {
        loadStyleSheet(unlalertCssUrl);

        this.alertDataUrl = 'https://alert.unl.edu/json/unlcap.js';

        window.unlAlerts = window.unlAlerts || {};
        window.unlAlerts.data = window.unlAlerts.data || {};

        this.#fetchAlertData();

        document.dispatchEvent(
            new CustomEvent(UNLAlert.events('UNLAlertReady'), {
                detail: {
                    classInstance: this,
                },
            }),
        );
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            UNLAlertReady: 'UNLAlertReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }


    // Sets a cookie to indicate that there is an active alert
    #setActiveAlertCookie = (flag) => {
        let value = 1,
            time = 60; // Seconds
        if (flag === false) {
            value = '';
            time = -1;
        }
        setCookie(this.activeAlertCookieName, value, time);
    };


    // Sets a cookie to indicate that there is an acknowledged alert
    #setClosedAlertCookie = function(alertDataActiveID) {
        const closedAlertCookieValue = this.#getClosedAlertCookie();

        // Exit the function without setting a cookie if closedAlertCookie already exists for the alert
        if (closedAlertCookieValue.indexOf(alertDataActiveID) !== -1) {
            return;
        }

        closedAlertCookieValue.push(alertDataActiveID);
        setCookie(
            this.closedAlertCookieName,
            closedAlertCookieValue.join(','),
            this.closedAlertCookieMaxAge,
        );
    };

    #getClosedAlertCookie = function() {
        const cookie = getCookie(this.closedAlertCookieName);
        if (cookie) {
            // Split cookie for index value comparison
            return cookie.split(',');
        }
        return [];
    };

    #acknowledgeAlert = function(alertDataActiveID) {
        this.#setClosedAlertCookie(alertDataActiveID);
    };

    #isAlertAcknowledged(alertDataID) {
        const closedAlertCookieValue = this.#getClosedAlertCookie();
        return closedAlertCookieValue.indexOf(alertDataID) !== -1 ? true : false;
    }


    #checkIfFetchCallNeeded = () => {
        this.#fetchAlertData();

    };

    #toggleAlert() {
        const alert = document.getElementById('unlalert');
        const alertIconClose = document.getElementById('unlalert_icon_close');
        const alertIconWarning = document.getElementById('unlalert_icon_warning');
        const alertAction = document.getElementById('unlalert_action');

        if (alert.classList.contains('show')) {
            alert.classList.remove('show');
            const body = alert.closest('body');
            if(body) {
                body.classList.remove('unlalert-shown');
            }
            alertIconClose.setAttribute('hidden', 'true');
            alertIconWarning.removeAttribute('hidden');
            alertAction.classList.remove('dcf-sr-only');
            alertAction.classList.add('dcf-ml-2', 'dcf-txt-sm');
            alertAction.textContent = 'Show emergency alert';

            for (let counter = 0; counter < this.alertDataActiveIDs.length; counter++) {
                this.#acknowledgeAlert(this.alertDataActiveIDs[counter]);
            }
        } else {
            if(alert) {
                alert.classList.add('show');
                const body = alert.closest('body');
                if(body) {
                    body.classList.add('unlalert-shown');
                }
            }
            if(alertIconWarning) {
                alertIconWarning.setAttribute('hidden', 'true');
            }
            if(alertIconClose) {
                alertIconClose.removeAttribute('hidden');
            }
            if(alertAction) {
                alertAction.classList.remove('dcf-ml-2', 'dcf-txt-sm');
                alertAction.classList.add('dcf-sr-only');
                alertAction.textContent = 'Hide emergency alert';
            }
        }
    }

    #alertUser = function(alertData) {
        this.#setActiveAlertCookie(true);

        this.alertDataActiveIDs = [];
        let unlalertDivWrapper = document.getElementById('unlalert');
        let alertToggle = document.getElementById('unlalert_toggle');
        let unlalertContent,
            containsExtreme = false,
            info = alertData.info,
            effectiveDate = '',
            web,
            alertContentHTML;
        let alertAcknowledgmentStatus = true;
        const alertDataID = alertData.identifier || +new Date();
        const dcfHeaderDiv = document.getElementById('dcf-header');
        const alertIconSvg =
        `<svg id="unlalert" class="dcf-h-4 dcf-w-4 dcf-fill-current" viewBox="0 0 24 24" height="16" width="16" focusable="false" aria-hidden="true">
            <g id="unlalert_icon_close">
                <path d="M13.4 12 23.7 1.7c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 10.6 1.7.3C1.3-.1.7-.1.3.3s-.4 1 0 1.4L10.6 12 .3 22.3c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3L12 13.4l10.3 10.3c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L13.4 12z">
                </path>
            </g>
            <g id="unlalert_icon_warning" hidden>
                <path 
                    d="M12 17.3c-.6 0-1-.4-1-1V8.7c0-.6.4-1 1-1s1 .4 1 1v7.7c0 .5-.4.9-1 .9z">
                </path>
                <path 
                    d="M23 24H1c-.3 0-.7-.2-.9-.5s-.2-.7 0-1l11-22c.3-.7 1.5-.7 1.8 0l11 22c.2.3.1.7 0 1s-.6.5-.9.5zM2.6 22h18.8L12 3.2 2.6 22z">
                </path>
                <path 
                    d="M12 21c-.8 0-1.5-.7-1.5-1.5S11.2 18 12 18s1.5.7 1.5 1.5S12.8 21 12 21z">
                </path>
            </g>
            <path fill="none" d="M0 0h24v24H0z">
            </path>
        </svg>`;

        if (!(info instanceof Array)) {
            info = [info];
        }

        for (let counter = 0; counter < info.length; counter++) {
            if (info[counter].severity !== 'Extreme') {
                continue;
            }
            containsExtreme = true;
        }

        if (!containsExtreme) {
            return;
        }

        this.alertDataActiveIDs.push(alertDataID);
        alertAcknowledgmentStatus = this.#isAlertAcknowledged(alertDataID);
        effectiveDate = new Date(alertData.sent).toLocaleString();

        for (let counter = 0; counter < info.length; counter++) {
            // Check if unlalertDivWrapper doesn't exist
            if (!unlalertDivWrapper) {
                unlalertDivWrapper = document.createElement('div');
                unlalertDivWrapper.id = 'unlalert';
                unlalertDivWrapper.className = 'dcf-bleed dcf-z-1';
                unlalertDivWrapper.setAttribute('role', 'alert');
                unlalertDivWrapper.style.position = 'absolute';
                unlalertDivWrapper.style.top = '-1000px';

                dcfHeaderDiv.parentNode.insertBefore(unlalertDivWrapper, dcfHeaderDiv);

                // Create the alert content div
                unlalertContent = document.createElement('div');
                unlalertContent.className = 'dcf-relative dcf-col-gap-vw dcf-row-gap-6';
                unlalertContent.id = 'unlalert_content';

                //Create a div to append the alert content and unlalertDivWrapper
                const unlalertInnerDivWrapper = document.createElement('div');
                unlalertInnerDivWrapper.className = 'dcf-wrapper';
                unlalertInnerDivWrapper.appendChild(unlalertContent);
                unlalertDivWrapper.appendChild(unlalertInnerDivWrapper);

            } else if (counter === 0) {
                unlalertContent = document.getElementById('unlalert_content');
                if(unlalertContent) {
                    unlalertContent.innerHTML = '';
                }
            }

            web = info[counter].web || 'https://www.unl.edu/';
            alertContentHTML =
                `<div class="unlalert-info"><header><h2 class="unlalert-heading dcf-mb-2 dcf-txt-2xs dcf-regular dcf-lh-3 dcf-uppercase unl-ls-2">Emergency alert</h2><h3 class="unlalert-headline dcf-mt-0 dcf-txt-h4">
                ${info[counter].headline}
                </h3></header><p class="unlalert-desc dcf-mb-0 dcf-txt-xs">
                ${info[counter].description} 
                </p>`;
            if (info[counter].instruction) {
                alertContentHTML +=
                    `<p class="unlalert-desc dcf-mt-2 dcf-mb-0 dcf-txt-xs"> 
                    ${info[counter].instruction}
                    </p>`;
            }
            alertContentHTML +=
                `</div><footer class="unlalert-meta dcf-d-grid dcf-col-gap-vw dcf-row-gap-5 dcf-txt-2xs"><div class="unlalert-datetime"><span class="unlalert-heading dcf-d-block dcf-mb-1 dcf-lh-3 dcf-uppercase unl-ls-2">Issued </span>
                ${effectiveDate}
                </div><div class="unlalert-link"><span class="unlalert-heading dcf-d-block dcf-mb-1 dcf-lh-3 dcf-uppercase unl-ls-2">Additional info (if&nbsp;available)<span class="dcf-sr-only">: </span></span>
                <a href="${web}">${web}</a>
                </div></footer>`;
            unlalertContent.insertAdjacentHTML('beforeend', alertContentHTML);
        }

        // Add a visibility toggle tab
        if (!alertToggle) {
            // Create the toggle button and its content
            const alertToggleSpan = document.createElement('span');
            alertToggleSpan.id = 'unlalert_action';
            alertToggleSpan.className = 'dcf-ml-2 dcf-txt-sm';
            alertToggleSpan.textContent = 'Show emergency alert';

            alertToggle = document.createElement('button');
            alertToggle.className = 'dcf-btn dcf-btn-tertiary dcf-txt-decor-none dcf-d-flex dcf-ai-center dcf-jc-center dcf-txt-base';
            alertToggle.id = 'unlalert_toggle';
            alertToggle.insertAdjacentHTML('beforeend', alertIconSvg);
            alertToggle.appendChild(alertToggleSpan);

            const alertContentParent = unlalertContent.parentElement;
            if (alertContentParent) {
                alertContentParent.appendChild(alertToggle);
            }
            alertToggle.addEventListener('click', () => this.#toggleAlert());
        }

        if (!alertAcknowledgmentStatus) {
            // Only trigger when alertContent is hidden, otherwise an active, unacknowledged alert will be hidden.
            if (!unlalertDivWrapper.classList.contains('show')) {
                alertToggle.click();
            }
        } else {
            // If the alert is acknowledged, retrieve SVG elements from alertToggle to display the warning icon instead of the close icon.
            const alertIconClose = alertToggle.querySelector('#unlalert_icon_close');
            const alertIconWarning = alertToggle.querySelector('#unlalert_icon_warning');

            if (alertIconClose) {
                alertIconClose.setAttribute('hidden', 'true');
            }
            if (alertIconWarning) {
                alertIconWarning.removeAttribute('hidden');
            }
        }
    };

    #noAlert = function() {
        this.#setActiveAlertCookie(false);
        // Remove alert div if no alert data exists
        const unlalertDivWrapper = document.getElementById('unlalert');
        if (unlalertDivWrapper) {
            unlalertDivWrapper.remove();
        }
    };


    async #fetchAlertData() {
        try {

            const cacheBuster = `cb=${Date.now()}`;
            const urlWithCacheBuster = `${this.alertDataUrl}?${cacheBuster}`;
            await loadJS(urlWithCacheBuster);
            const unlAlertsData = window.unlAlerts.data;

            // Check if alert data exists and the page is not in an iframe, then alert the user.
            if (unlAlertsData && unlAlertsData.alert &&  window.top === window && unlAlertsData.alert && unlAlertsData.alert.info) {
                // 
                this.#alertUser(unlAlertsData.alert);
            } else {
                this.#noAlert();
            }
            clearTimeout(this.serverCallTimeoutID);

            this.serverCallTimeoutID = setTimeout(() => this.#checkIfFetchCallNeeded(),
                this.serverCallExecutionDelayTwo,
            );
        } catch {
            console.error('An unexpected error occurred while fetching the alert data.');
        }
    }
}
