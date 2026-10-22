// Forward these from dcf utility
export { uuidv4, loadStyleSheet, loadStyleSheets, stringToDom } from '@dcf/js/dcf-utility.js';

/**
 * Converts a relative link to an absolute link
 * 
 * @param {string} link The relative link
 * @param {string} base_url The base to use
 * @returns {string|null} null if link is invalid or string of absolute link
 */
export function toAbs(link, baseUrl) {
    try {
        const parsedUrl = new URL(link, baseUrl);
        return parsedUrl.toString();
    } catch(error) {
        console.error(error);
        return null;
    }
}

/**
 * Sets a cookie to be stored
 * 
 * @param {string} name Name of the cookie
 * @param {string} value Value of the cookie
 * @param {number} seconds The number of seconds until it expires
 * @param {string} path The path to which the cookie is scoped
 * @param {string} domain The host to which the cookie is scoped
 * @param {string} samesite Samesite attribute ('lax', 'strict', 'none')
 * @param {bool} secure Specified if the cookie should be only transmitted over a secure protocol
 * @returns {void}
 */
export function setCookie(name, value, seconds, path, domain, samesite, secure) {
    let expires = '';
    if (seconds) {
        const date = new Date();
        date.setTime(date.getTime() + seconds * 1000);
        expires = `;expires=${date.toUTCString()}`;
    }
    if (!path) {
        path = '/';
    } else if (path.charAt(0) !== '/') {
        path = toAbs(path, window.location.pathname);
    }
    if (!domain) {
        domain = '.unl.edu';
    }
    if (!samesite) {
        samesite = 'lax';
    }

    let cookieString = `${name}=${value}${expires};path=${path};domain=${domain};samesite=${samesite}`;

    // Add secure if set or not set with samesite=none
    if (secure || !secure && samesite.toLowerCase() === 'none') {
        cookieString = `${cookieString};secure`;
    }

    document.cookie = cookieString;
}

/**
 * Get's cookie's value based on name
 * 
 * @param {string} name Name of the cookie
 * @returns {string|null} Null if no cookie found or string of cookie value
 */
export function getCookie(name) {
    const nameEQ = `${name}=`;
    const allCookies = document.cookie.split(';');
    for(let index = 0; index < allCookies.length; index++) {
        const currentCookie = allCookies[index].trimStart();
        if (currentCookie.indexOf(nameEQ) === 0) {
            return currentCookie.substring(nameEQ.length, currentCookie.length);
        }
    }
    return null;
}

/**
 * Gets item from session storage
 * @param { string } key
 * @returns { string | null} value
 */
export function getSessionStorage(key) {
    return sessionStorage.getItem(key);
}

/**
 * Sets item from session storage
 * @param { string } key
 * @param { string } value
 * @returns { void }
 */
export function setSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
}

/**
 * Removes item from session storage
 * @param { string } key
 * @returns { void }
 */
export function removeSessionStorage(key) {
    sessionStorage.removeItem(key);
}

/**
 * Checks if a string is a URL or not
 * @param { string } stringToCheck 
 * @returns { bool } Whether string is a URL or not
 */
export function isValidHttpUrl(stringToCheck) {
    let url;

    try {
        url = new URL(stringToCheck);
    } catch {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
}

/**
 * Checks if a string is an email or not
 * @param { String } email 
 * @returns { Boolean }
 */
export function isValidateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

/**
 * Loads a stylesheet
 * Avoids loading the same stylesheet twice
 * @param {string} jsSrc
 * @returns {Promise<void>}
 */
export function loadJS(jsSrc, module=false) {
    return new Promise((resolve, reject) => {
        const scriptAlreadyThere = document.querySelector(`script[src="${jsSrc}"]`);
        if (scriptAlreadyThere !== null) {
            resolve();
            return;
        }

        // If the stylesheet is not already there then load it
        const newScript = document.createElement('script');
        newScript.src = jsSrc;
        if (module) {
            newScript.setAttribute('type', 'module');
        }

        // Handle load and error events
        newScript.addEventListener('load', () => {
            resolve();
        });
        newScript.addEventListener('error', () => {
            reject(new Error(`Failed to load script: ${jsSrc}`));
        });

        document.head.appendChild(newScript);
    });
}

/**
 * Wraps parent elements content in wrapper element
 * @param { HTMLElement } parent 
 * @param { String|HTMLElement } wrapper 
 */
export function wrapInner(parent, wrapper) {
    // wrapper can be an HTML string or an element
    if (typeof wrapper === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = wrapper;
        wrapper = temp.firstElementChild;
    }

    // Move all children of parent into the wrapper
    while (parent.firstChild) {
        wrapper.appendChild(parent.firstChild);
    }

    // Append the wrapper (now containing all children) back into parent
    parent.appendChild(wrapper);
}

/**
 * Gets the initialized JS component class instance based on the element's id
 * @param { String } elementID 
 * @returns { Promise<Object> }
 */
export function getClassInstance(elementID) {
    return new Promise((resolve) => {
        if (elementID in window.UNL.classes) {
            resolve(window.UNL.classes[elementID]);
            return;
        }

        const element = document.getElementById(elementID);
        element.addEventListener('UNLClassReady', () => {
            resolve(window.UNL.classes[elementID]);
        });
    });
}

/**
 * Allows the user to track the state of a promise in synchronous code
 * @param { Promise } promise 
 * @returns { Object }
 */
export function trackablePromise(promise) {
    const state = { pending: true, value: null };
    promise.then(value => {
        state.pending = false;
        state.value = value;
    });
    return state;
}

/**
 * Escapes HTML special characters in a string so it can be safely
 * inserted as text content inside HTML markup.
 *
 * @param { string } str
 * @returns { string }
 */
export function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Unescapes HTML entities back into their literal characters.
 *
 * @param { string } str
 * @returns { string }
 */
export function unescapeHTML(str) {
    return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&amp;/g, '&');
}

/**
 * Removes the common leading whitespace from every line of a string,
 * while preserving the relative indentation between lines.
 *
 * @param { string } str
 * @returns { string }
 */
export function dedent(str) {
    const lines = str.replace(/\r\n/g, '\n').split('\n');

    // Ignore blank/whitespace-only lines when calculating the minimum indent
    const indents = lines
        .filter((line) => line.trim().length > 0)
        .map((line) => line.match(/^[ \t]*/)[0].length);

    const minIndent = indents.length ? Math.min(...indents) : 0;

    return lines
        .map((line) => line.slice(minIndent))
        .join('\n')
        .trim();
}
