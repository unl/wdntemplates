import { getCookie, loadJS, isValidateEmail } from '@js-src/lib/unl-utility.js';

export default class UNLIdm {

    idmContainer = null;

    ssoUrl = 'https://shib.unl.edu/';

    ssoCookie = 'unl_sso';

    ssoCookieData = null;

    locationEncoded = encodeURIComponent(window.location);

    whoamiUrl = 'https://whoami.unl.edu/?id=';

    userLookupUrl = 'https://directory.unl.edu/people/';

    directoryURL = 'https://directory.unl.edu/';

    emailToUidURL = 'https://directory.unl.edu/api/v1/emailToUID?email=';

    avatarUrl = 'https://directory.unl.edu/avatar/';

    localStorageKey = 'UNL_IDM';

    clientSideUser = null;

    failedToLoadClientSideUser = false;

    serverSideUser = null;

    logInUrl = null;

    logOutUrl = null;

    #isReadyToRender = false;

    constructor(options={}) {
        this.logInUrl = `${this.ssoUrl}idp/profile/cas/login?service=${this.locationEncoded}`;
        this.logOutUrl = `${this.ssoUrl}idp/profile/cas/logout?service=${this.locationEncoded}`;
        this.#checkForAuthLinks();

        // Sets up window.WDN.idm for whoami
        window.WDN = window.WDN || {};
        window.WDN.idm = window.WDN.idm || {};

        // Set up window.UNL.idm.config if not defined yet
        window.UNL = window.UNL || {};
        window.UNL.idm = window.UNL.idm || {};
        window.UNL.idm.config = window.UNL.idm.config || {};

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes['dcf-idm'] = this;
        this.idmContainer = document.getElementById('dcf-idm');
        this.idmContainer.dispatchEvent(new Event('UNLClassReady'));

        if ('loginRoute' in window.UNL.idm.config && typeof window.UNL.idm.config.loginRoute === 'string' && window.UNL.idm.config.loginRoute !== '') {
            this.setLoginRoute(window.UNL.idm.config.loginRoute);
        } else if ('loginRoute' in options && typeof options.loginRoute === 'string' && options.loginRoute !== '') {
            this.setLoginRoute(options.loginRoute);
        }
        if ('logoutRoute' in window.UNL.idm.config && typeof window.UNL.idm.config.logoutRoute === 'string' && window.UNL.idm.config.logoutRoute !== '') {
            this.setLogoutRoute(window.UNL.idm.config.logoutRoute);
        } else if ('logoutRoute' in options && typeof options.logoutRoute === 'string' && options.logoutRoute !== '') {
            this.setLogoutRoute(options.logoutRoute);
        }
        if ('serverUser' in window.UNL.idm.config && typeof window.UNL.idm.config.serverUser === 'string' && window.UNL.idm.config.serverUser !== '') {
            this.setServerUser(window.UNL.idm.config.serverUser);
        } else if ('serverUser' in options && typeof options.serverUser === 'string' && options.serverUser !== '') {
            this.setServerUser(options.serverUser);
        }

        window.UNL.idm.pushConfig = (configProp, configValue) => {
            if (configValue !== '') {
                return;
            }
            switch (configProp) {
            case 'loginRoute':
                this.setLoginRoute(configValue);
                break;
            case 'logoutRoute':
                this.setLogoutRoute(configValue);
                break;
            case 'serverUser':
                this.setServerUser(configValue);
                break;
            }
        };

        this.ssoCookieData = getCookie(this.ssoCookie);
        this.#isReadyToRender = true;
        if (this.ssoCookieData !== null) {
            this.#loadClientUser();
        } else {
            this.failedToLoadClientSideUser = true;
            this.#loadServerUser();
        }

        const unInitContainers = Array.from(document.querySelectorAll('.unl-idm-uninitialized'));
        unInitContainers.forEach((singleContainer) => {
            singleContainer.setAttribute('hidden', 'hidden');
        });
        const initContainers = Array.from(document.querySelectorAll('.unl-idm-initialized'));
        initContainers.forEach((singleContainer) => {
            singleContainer.removeAttribute('hidden');
        });

        window.UNL.idm.getPrimaryAffiliation = () => {
            return this.getPrimaryAffiliation();
        };
        window.UNL.idm.getDisplayName = () => {
            return this.getDisplayName();
        };
        window.UNL.idm.getEmailAddress = () => {
            return this.getEmailAddress();
        };

        // Clear out the queue and delete it's key-value pair since it is no longer needed
        if ('loadCallbackQueue' in window.UNL.idm && Array.isArray(window.UNL.idm.loadCallbackQueue)) {
            window.UNL.idm.loadCallbackQueue.forEach((singleCallback) => {
                singleCallback();
            });
            delete window.UNL.idm.loadCallbackQueue;
        }
        // Redefine onload to just call the callback since we have loaded
        window.UNL.idm.onLoad = (callbackFunc) => {
            callbackFunc();
        };

        window.UNL.idm.loaded = true;

        document.dispatchEvent(new CustomEvent(UNLIdm.events('UNLIdmReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            UNLIdmReady: 'UNLIdmReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    /**
     * Checks the page for links with the `rel` attribute set
     * to login or logout
     *
     * If it finds any it will set the logInUrl or logOutUrl
     * @return { Void }
     */
    #checkForAuthLinks() {
        const loginLink = this.#getLinkByRel('login');
        const logoutLink = this.#getLinkByRel('logout');
        if (loginLink !== null) {
            this.logInUrl = loginLink.getAttribute('href');
        }
        if (logoutLink !== null) {
            this.logOutUrl = logoutLink.getAttribute('href');
        }
    }

    /**
     * Gets the links on the page with a specific `rel` attribute value
     *
     * @param { String } name
     * @returns { HTMLElement|null }
     */
    #getLinkByRel(name) {
        return document.querySelector(`link[rel='${name}']`);
    }


    /**
     * Loads the client user based on the ssoCookieData
     *
     * @async
     * @return { Promise<Void> }
     */
    async #loadClientUser() {
        // Try loading user from local storage (this will have been stored from the last successful load)
        let user = this.#fetchClientUserDataFromLocalStorage();
        if (user === null) {
            // If the user is not in local storage then we will check with whoami
            user = await this.#fetchClientUserDataFromWhoami();
        }

        // If the user was loaded correctly
        // then we will save their data in local storage and render the component
        if (user !== null) {
            this.clientSideUser = user;
            this.#syncLocalStorage();
            if (this.#isReadyToRender === true) {
                this.#render();
            }
        } else {
            // If we did not load the user correctly
            // then we will check if we can load the server user
            this.failedToLoadClientSideUser = true;
            await this.#loadServerUser();
        }
    }

    /**
     * Loads the user data from local storage as long as the ssoCookieData matches
     *
     * @returns { Object|null}
     */
    #fetchClientUserDataFromLocalStorage() {
        const storageData = localStorage.getItem(this.localStorageKey);
        if (storageData === null) {
            return null;
        }

        let formattedData = null;
        try {
            formattedData = JSON.parse(storageData);
        } catch {
            this.#eraseLocalStorage();
            return null;
        }

        if (!('cookieId' in formattedData) || !('clientSideUser' in formattedData)) {
            this.#eraseLocalStorage();
            return null;
        }

        if (formattedData.cookieId !== this.ssoCookieData) {
            this.#eraseLocalStorage();
            return null;
        }

        return formattedData.clientSideUser;
    }

    /**
     * Fetches user data from whoami using the ssoCookieData
     *
     * @async
     * @returns { Promise<Object|null> }
     */
    async #fetchClientUserDataFromWhoami() {
        try {
            await loadJS(`${this.whoamiUrl}${this.ssoCookieData}`);
            if (window.WDN.idm.user) {
                const user = window.WDN.idm.user;
                delete window.WDN.idm.user;
                if ('uid' in user && typeof user.uid === 'string') {
                    return user;
                }
                return null;
            }
            return null;
        } catch(err) {
            console.error(err);
            return null;
        }
    }

    /**
     * Saves the current clientSideUser to local storage so we don't need
     * to fetch from whoami again
     *
     * @returns { Void }
     */
    #syncLocalStorage() {
        if (this.clientSideUser === null) {
            this.#eraseLocalStorage();
            return;
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify({
            cookieId: this.ssoCookieData,
            clientSideUser: this.clientSideUser,
        }));
    }

    /**
     * Erases the local storage data in case things got out of sync or old
     *
     * @returns { Void }
     */
    #eraseLocalStorage() {
        localStorage.removeItem(this.localStorageKey);
    }

    /**
     * Sets the logInUrl and re-renders the component
     *
     * @param { String } loginRouteIn
     * @returns { Void }
     */
    setLoginRoute(loginRouteIn) {
        this.logInUrl = loginRouteIn;
        if (this.#isReadyToRender === true) {
            this.#render();
        }
    }

    /**
     * Sets the logOutUrl and re-renders the component
     *
     * @param { String } logoutRouteIn
     * @returns { Void }
     */
    setLogoutRoute(logoutRouteIn) {
        this.logOutUrl = logoutRouteIn;
        if (this.#isReadyToRender === true) {
            this.#render();
        }
    }

    /**
     * Sets up initial serverSideUser data
     *
     * @param { String } serverUserInput
     * @returns { Void }
     */
    async setServerUser(serverUserInput) {
        if (isValidateEmail(serverUserInput)) {
            this.serverSideUser = {
                inputType: 'email',
                email: serverUserInput,
                uid: null,
                data: null,
            };
        } else {
            this.serverSideUser = {
                inputType: 'uid',
                email: null,
                uid: serverUserInput,
                data: null,
            };
        }

        await this.#loadServerUser();
    }

    /**
     * If we failed to load the clientSideUser then we will fetch the serverSideUser data
     *
     * @async
     * @returns { Promise<Void> }
     */
    async #loadServerUser() {
        if (this.serverSideUser === null) {
            this.#render();
            return;
        }

        if (this.failedToLoadClientSideUser) {
            if ('inputType' in this.serverSideUser && this.serverSideUser.inputType === 'email') {
                // get their uid from email
                const uid = await this.#fetchUIDFromEmail();
                this.serverSideUser.uid = uid;
            }

            const userData = await this.#fetchServerUserDataFromDirectory();
            this.serverSideUser.data = userData;
        }
        if (this.#isReadyToRender === true) {
            this.#render();
        }
    }

    /**
     * Using directory we will convert the serverSideUser's email to their UID
     *
     * @async
     * @returns { Promise<String|null> } User's uid or null if failed
     */
    async #fetchUIDFromEmail() {
        if (!('email' in this.serverSideUser)) {
            return null;
        }
        try {
            const response = await fetch(`${this.emailToUidURL}${this.serverSideUser.email}`);
            if (!response.ok) {
                return null;
            }
            const jsonData = await response.json();
            if (!('status' in jsonData) || !(jsonData.status === 200)) {
                return null;
            }
            if (!('message' in jsonData) || !('data' in jsonData.message) || !Array.isArray(jsonData.message.data)) {
                return null;
            }
            return jsonData.message.data[0];
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    /**
     * Using directory we will get the serverSideUser's data from their UID
     *
     * @async
     * @returns { Promise<Object|null> } user's data or null if failed
     */
    async #fetchServerUserDataFromDirectory() {
        if (!('uid' in this.serverSideUser)) {
            return null;
        }
        try {
            const response = await fetch(`${this.userLookupUrl}${this.serverSideUser.uid}?format=json`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    /**
     * Gets the best display name for the clientSideUser based on available data
     *
     * @returns { String|null } ClientSideUser's display name or null if failed
     */
    #getClientUserDisplayName() {
        if (this.clientSideUser === null) {
            return null;
        }

        if ('eduPersonNickname' in this.clientSideUser && this.clientSideUser.eduPersonNickname !== null) {
            return this.clientSideUser.eduPersonNickname[0];
        } else if ('givenName' in this.clientSideUser && this.clientSideUser.givenName !== null) {
            return this.clientSideUser.givenName[0];
        } else if ('displayName' in this.clientSideUser && this.clientSideUser.displayName !== null) {
            return this.clientSideUser.displayName[0];
        }

        return null;
    }

    /**
     * Gets the best full name for the clientSideUser based on available data
     *
     * @returns { String|null } ClientSideUser's full name or null if failed
     */
    #getClientUserFullName() {
        if (this.clientSideUser === null) {
            return null;
        }

        if ('displayName' in this.clientSideUser && this.clientSideUser.displayName !== null) {
            return this.clientSideUser.displayName[0];
        }

        return null;
    }

    /**
     * Gets the best display name for the serverSideUser based on available data
     *
     * @returns { String|null } ServerSideUser's display name or null if failed
     */
    #getServerUserDisplayName() {
        if (this.serverSideUser === null) {
            return null;
        }

        if ('data' in this.serverSideUser && this.serverSideUser.data !== null) {
            if ('eduPersonNickname' in this.serverSideUser.data && this.serverSideUser.data.eduPersonNickname !== null) {
                return this.serverSideUser.data.eduPersonNickname[0];
            } else if ('givenName' in this.serverSideUser.data && this.serverSideUser.data.givenName !== null) {
                return this.serverSideUser.data.givenName[0];
            } else if ('displayName' in this.serverSideUser && this.serverSideUser.data.displayName !== null) {
                return this.serverSideUser.data.displayName[0];
            }
        } else if ('uid' in this.serverSideUser && this.serverSideUser.uid !== null) {
            return this.serverSideUser.uid;
        } else if ('email' in this.serverSideUser && this.serverSideUser.email !== null) {
            return this.serverSideUser.email;
        }

        return null;
    }

    /**
     * Gets the serverSideUser's full name based on available data
     *
     * @returns { String|null } User's full name or null if failed
     */
    #getServerUserFullName() {
        if (this.serverSideUser === null) {
            return null;
        }

        if ('data' in this.serverSideUser && this.serverSideUser.data !== null) {
            if ('displayName' in this.serverSideUser.data && this.serverSideUser.data.displayName !== null) {
                return this.serverSideUser.data.displayName[0];
            }
        } else if ('uid' in this.serverSideUser && this.serverSideUser.uid !== null) {
            return this.serverSideUser.uid;
        }

        return null;
    }

    /**
     * Gets the serverSideUser's avatar Url based on available data
     *
     * @returns { String|null } Avatar URL or null if failed
     */
    #getServerUserAvatarUrl() {
        if (this.serverSideUser === null) {
            return null;
        }

        if ('data' in this.serverSideUser && this.serverSideUser.data !== null) {
            if ('uid' in this.serverSideUser.data && this.serverSideUser.data.uid !== null) {
                return `${this.avatarUrl}${this.serverSideUser.data.uid}`;
            }
        } else if ('uid' in this.serverSideUser && this.serverSideUser.uid !== null) {
            return `${this.avatarUrl}${this.serverSideUser.uid}`;
        } else if ('email' in this.serverSideUser && this.serverSideUser.email !== null) {
            return `${this.avatarUrl}${this.serverSideUser.email}`;
        }

        return null;
    }

    /**
     * Gets the current user's primary affiliation
     * @returns { String } User's primary affiliation or 'None';
     */
    getPrimaryAffiliation() {
        if (this.clientSideUser !== null) {
            return this.clientSideUser?.eduPersonPrimaryAffiliation?.[0] || 'None';
        } else if (this.serverSideUser !== null) {
            return this.serverSideUser?.data?.eduPersonPrimaryAffiliation?.[0] || 'None';
        }

        return 'None';
    }

    /**
     * Gets the current user's nick name or first name
     * @returns { String } User's nick name or first name or empty string
     */
    getDisplayName() {
        if (this.clientSideUser !== null) {
            return this.#getClientUserDisplayName() || '';
        } else if (this.serverSideUser !== null) {
            return this.#getServerUserDisplayName()  || '';
        }
        return '';
    }

    /**
     * Gets the current user's full name
     * @returns { String } User's Full Name or empty string
     */
    getFullName() {
        if (this.clientSideUser !== null) {
            return this.#getClientUserFullName()  || '';
        } else if (this.serverSideUser !== null) {
            return this.#getServerUserFullName()  || '';
        }
        return '';
    }

    /**
     * Gets the current user's email address
     * @returns { String } User's email address or empty string
     */
    getEmailAddress() {
        if (this.clientSideUser !== null) {
            return this.clientSideUser?.mail?.[0] || 'None';
        } else if (this.serverSideUser !== null) {
            return this.serverSideUser?.data?.mail?.[0] || 'None';
        }
        return '';
    }

    /**
     * Gets the current user's directory profile url
     * @returns { String } Directory profile URL or directory home page url
     */
    getProfileUrl() {
        if (this.clientSideUser !== null) {
            return `${this.userLookupUrl}${this.clientSideUser.uid}`;
        } else if (this.serverSideUser !== null) {
            return `${this.userLookupUrl}${this.serverSideUser.uid}`;
        }
        return this.directoryURL;
    }

    /**
     * Renders the component based on if we have clientSideUser data and
     * if we have serverSideUser data
     *
     * @returns { Void }
     */
    #render() {
        if (this.clientSideUser === null && this.serverSideUser === null) {
            // Display Logged Out State
            this.renderLoggedOutState();
        } else if (this.clientSideUser !== null && this.serverSideUser === null) {
            // Display Quasi-Logged In State
            const userDisplayName = this.getDisplayName();
            const userAvatarUrl = `${this.avatarUrl}${this.clientSideUser.uid}`;
            this.renderQuasiLoggedInState(userDisplayName, userAvatarUrl);
        } else if (this.clientSideUser === null && this.serverSideUser !== null) {
            // Display Logged In State
            // Using server side user data
            const userDisplayName = this.#getServerUserDisplayName();
            const userAvatarUrl = this.#getServerUserAvatarUrl();
            this.renderLoggedInState(userDisplayName, userAvatarUrl);
        } else {
            // Display Logged In State
            const userDisplayName = this.#getClientUserDisplayName();
            const userAvatarUrl = `${this.avatarUrl}${this.clientSideUser.uid}`;
            this.renderLoggedInState(userDisplayName, userAvatarUrl);
        }
    }

    /**
     * Renders the component in its logged out state
     *
     * @return { Void }
     */
    renderLoggedOutState() {
        const labels = Array.from(document.querySelectorAll('.unl-idm-label'));
        labels.forEach((singleLabel) => {
            singleLabel.innerHTML = 'My UNL';
        });

        const bigLabels = Array.from(document.querySelectorAll('.unl-idm-btn-log-in'));
        bigLabels.forEach((singleLabel) => {
            singleLabel.classList.add('dcf-m-auto');
        });

        const imgs = Array.from(document.querySelectorAll('.unl-idm-img'));
        imgs.forEach((singleImg) => {
            singleImg.classList.remove('unl-idm-status-quasi');
            singleImg.innerHTML = `<svg class="dcf-h-100% dcf-w-100% dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24">
    <path d="M12 0C5.383 0 0 5.383 0 12c0 3.18 1.232 6.177 3.469 8.438l.001.001A11.92 11.92 0 0 0 12 24c3.234 0 6.268-1.27 8.542-3.573A11.93 11.93 0 0 0 24 12c0-6.617-5.383-12-12-12zm8.095 19.428c-1.055-.626-5.165-2.116-5.595-2.275v-1.848c.502-.309 1.384-1.107 1.49-2.935.386-.226.63-.727.63-1.37 0-.578-.197-1.043-.52-1.294.242-.757.681-2.145.385-3.327C16.138 4.992 14.256 4.5 12.75 4.5c-1.342 0-2.982.391-3.569 1.456-.704-.034-1.096.273-1.29.531-.635.838-.216 2.368.02 3.21-.329.249-.531.718-.531 1.303 0 .643.244 1.144.63 1.37.106 1.828.989 2.626 1.49 2.935v1.848c-.385.144-4.464 1.625-5.583 2.288A10.92 10.92 0 0 1 1 12C1 5.935 5.935 1 12 1s11 4.935 11 11a10.92 10.92 0 0 1-2.905 7.428z"></path></svg>`;
        });

        const avatarContainer = Array.from(document.querySelectorAll('.unl-idm-avatar-container'));
        avatarContainer.forEach((singleLink) => {
            singleLink.classList.add('dcf-d-none');
        });

        const firstnameLastname = Array.from(document.querySelectorAll('.unl-idm-firstname-lastname'));
        firstnameLastname.forEach((singleLabel) => {
            singleLabel.classList.add('dcf-d-none');
        });

        const viewProfileLinks = Array.from(document.querySelectorAll('.unl-idm-view-profile'));
        viewProfileLinks.forEach((singleLink) => {
            singleLink.classList.add('dcf-d-none');
        });

        const logOutLinks = Array.from(document.querySelectorAll('.unl-idm-btn-log-out'));
        logOutLinks.forEach((singleLink) => {
            singleLink.classList.add('dcf-d-none');
        });

        window.dispatchEvent(new Event('idmStateSet'));
    }

    /**
     * Renders the component in its quasi logged in state
     * This is when the server says the user is not logged in but the client says they are
     *
     * @param { String } userAvatarUrl
     * @return { Void }
     */
    renderQuasiLoggedInState(userDisplayName, userAvatarUrl) {
        const labels = Array.from(document.querySelectorAll('.unl-idm-label'));
        labels.forEach((singleLabel) => {
            singleLabel.innerHTML = 'Log in to this site';
        });

        const loginLinks = Array.from(document.querySelectorAll('.unl-idm-btn-log-in'));
        loginLinks.forEach((singleLink) => {
            singleLink.classList.remove('dcf-d-none');
            singleLink.innerHTML = `Log in to this site as ${this.getFullName()}`;
        });

        const avatarContainer = Array.from(document.querySelectorAll('.unl-idm-avatar-container'));
        avatarContainer.forEach((singleLink) => {
            singleLink.classList.remove('dcf-d-none');
        });

        const firstnameLastname = Array.from(document.querySelectorAll('.unl-idm-firstname-lastname'));
        firstnameLastname.forEach((singleLabel) => {
            singleLabel.classList.add('dcf-d-none');
        });

        const imgs = Array.from(document.querySelectorAll('.unl-idm-img'));
        imgs.forEach((singleImg) => {
            singleImg.classList.add('unl-idm-status-quasi');
            singleImg.innerHTML = `<img class="dcf-h-100% dcf-w-100%" src="${userAvatarUrl}" alt="Avatar for ${this.getFullName()}">`;
        });

        const bigImgs = Array.from(document.querySelectorAll('.unl-idm-avatar'));
        bigImgs.forEach((singleImg) => {
            singleImg.classList.add('unl-idm-status-quasi');
            singleImg.innerHTML = `<img class="dcf-h-100% dcf-w-100%" src="${userAvatarUrl}" alt="Avatar for ${this.getFullName()}">`;
        });

        const viewProfileLinks = Array.from(document.querySelectorAll('.unl-idm-view-profile'));
        viewProfileLinks.forEach((singleLink) => {
            singleLink.classList.add('dcf-d-none');
        });

        const logOutLinks = Array.from(document.querySelectorAll('.unl-idm-btn-log-out'));
        logOutLinks.forEach((singleLink) => {
            singleLink.classList.remove('dcf-d-none');
            singleLink.setAttribute('href', this.logOutUrl);
        });

        window.dispatchEvent(new Event('idmStateSet'));
    }

    /**
     * Renders the component in its logged in state
     *
     * @param { String } userAvatarUrl
     * @param { String } userDisplayName
     * @return { Void }
     */
    renderLoggedInState(userDisplayName, userAvatarUrl) {
        const labels = Array.from(document.querySelectorAll('.unl-idm-label'));
        labels.forEach((singleLabel) => {
            singleLabel.innerHTML = userDisplayName;
        });

        const bigLabels = Array.from(document.querySelectorAll('.unl-idm-firstname-lastname'));
        bigLabels.forEach((singleLabel) => {
            singleLabel.innerHTML = this.getFullName();
        });

        const imgs = Array.from(document.querySelectorAll('.unl-idm-img'));
        imgs.forEach((singleImg) => {
            singleImg.classList.remove('unl-idm-status-quasi');
            singleImg.innerHTML = `<img class="dcf-h-100% dcf-w-100%" src="${userAvatarUrl}" alt="Avatar for ${this.getFullName()}">`;
        });

        const avatarContainer = Array.from(document.querySelectorAll('.unl-idm-avatar-container'));
        avatarContainer.forEach((singleLink) => {
            singleLink.classList.remove('dcf-d-none');
        });

        const bigImgs = Array.from(document.querySelectorAll('.unl-idm-avatar'));
        bigImgs.forEach((singleImg) => {
            singleImg.classList.remove('unl-idm-status-quasi');
            singleImg.innerHTML = `<img class="dcf-h-100% dcf-w-100%" src="${userAvatarUrl}" alt="Avatar for ${this.getFullName()}">`;
        });

        const viewProfileLinks = Array.from(document.querySelectorAll('.unl-idm-view-profile'));
        viewProfileLinks.forEach((singleLink) => {
            singleLink.classList.remove('dcf-d-none');
            singleLink.classList.add('dcf-d-block');
            singleLink.setAttribute('href', this.getProfileUrl());
        });

        const loginLinks = Array.from(document.querySelectorAll('.unl-idm-btn-log-in'));
        loginLinks.forEach((singleLink) => {
            singleLink.classList.add('dcf-d-none');
        });

        const logOutLinks = Array.from(document.querySelectorAll('.unl-idm-btn-log-out'));
        logOutLinks.forEach((singleLink) => {
            singleLink.classList.remove('dcf-d-none');
            singleLink.setAttribute('href', this.logOutUrl);
        });

        window.dispatchEvent(new Event('idmStateSet'));
    }
}
