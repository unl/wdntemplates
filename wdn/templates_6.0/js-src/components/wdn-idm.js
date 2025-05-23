import { getCookie, loadJS, subscribeToWindowParams, isValidateEmail } from '@js-src/lib/wdn-utility.js';

export default class WDNIDM {

    ssoUrl = 'https://shib.unl.edu/';

    ssoCookie = 'unl_sso';

    ssoCookieData = null;

    locationEncoded = encodeURIComponent(window.location);

    whoamiUrl = 'https://whoami.unl.edu/?id=';

    userLookupUrl = 'https://directory.unl.edu/people/';

    emailToUidURL = 'https://directory.unl.edu/api/v1/emailToUID?email=';

    avatarUrl = 'https://directory.unl.edu/avatar/';

    localStorageKey = 'UNL_IDM';

    clientSideUser = null;

    failedToLoadClientSideUser = false;

    serverSideUser = null;

    logInUrl = null;

    logOutUrl = null;

    constructor() {
        this.logInUrl = `${this.ssoUrl}idp/profile/cas/login?service=${this.locationEncoded}`;
        this.logOutUrl = `${this.ssoUrl}idp/profile/cas/logout?service=${this.locationEncoded}`;
        this.#checkForAuthLinks();

        // Sets up window.WDN.idm for whoami
        if (window.WDN === undefined) {
            window.WDN = {};
        }
        if (window.WDN.idm === undefined) {
            window.WDN.idm = {};
        }

        this.ssoCookieData = getCookie(this.ssoCookie);
        if (this.ssoCookieData !== null) {
            this.#loadClientUser();
        } else {
            this.failedToLoadClientSideUser = true;
            this.#loadServerUser();
        }

        subscribeToWindowParams('IDM', (data) => {
            if (data.length < 2) { return; }
            switch (data[0]) {
            case 'LoginRoute':
            case 'loginRoute':
                this.setLoginRoute(data[1]);
                break;
            case 'LogoutRoute':
            case 'logoutRoute':
                this.setLogoutRoute(data[1]);
                break;
            case 'ServerUser':
            case 'serverUser':
                this.setServerUser(data[1]);
                break;
            }
        });
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
            this.#render();
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
     * Erases the local storage data incase things got out of sync or old
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
        this.#render();
    }

    /**
     * Sets the logOutUrl and re-renders the component
     * 
     * @param { String } logoutRouteIn
     * @returns { Void }
     */
    setLogoutRoute(logoutRouteIn) {
        this.logOutUrl = logoutRouteIn;
        this.#render();
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
        this.#render();
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
            } else if ('displayName' in this.clientSideUser && this.serverSideUser.data.displayName !== null) {
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
            const userAvatarUrl = `${this.avatarUrl}${this.clientSideUser.uid}`;
            this.renderQuasiLoggedInState(userAvatarUrl);
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
     * Renders the component in it's logged out state
     * 
     * @return { Void }
     */
    renderLoggedOutState() {
        console.log('logged Out', this.logInUrl);
    }

    /**
     * Renders the component in it's quasi logged in state
     * This is when the server says the user is not logged in but the client says they are
     * 
     * @param { String } userAvatarUrl
     * @return { Void }
     */
    renderQuasiLoggedInState(userAvatarUrl) {
        console.log('quasi', userAvatarUrl, this.logInUrl);
    }

    /**
     * Renders the component in it's logged in out state
     * 
     * @param { String } userAvatarUrl
     * @param { String } userDisplayName 
     * @return { Void }
     */
    renderLoggedInState(userDisplayName, userAvatarUrl) {
        console.log('logged in', userDisplayName, userAvatarUrl, this.logOutUrl);
    }
}
