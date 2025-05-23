import searchCssUrl from '@scss/components-js/_search.scss?url';
import dialogCssUrl from '@scss/components-js/_dialogs.scss?url';
import { loadStyleSheet } from '@js-src/lib/wdn-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?WDNSearch} WDNSearch
 */
let WDNSearch = null;

/**
 * @type {?WDNSearch} searchInstance
 */
let searchInstance = null;

// Query Selector for the search component
const querySelector = '.dcf-search';

// Type of plugin
const pluginType = 'single';

// Storing the state whether the plugin is initialized or not
let isInitialized = false;

/**
 * Gets the query selector which is used for this plugin's component
 * @returns { String }
 */
export function getQuerySelector() {
    return querySelector;
}

/**
 * Gets the plugin type
 * @returns { String }
 */
export function getPluginType() {
    return pluginType;
}

/**
 * Returns if the plugin has been initialized yet
 * @returns { Boolean }
 */
export function getIsInitialized() {
    return isInitialized;
}

export function isOnPage() {
    return document.querySelector(querySelector) !== null;
}

/**
 * Initializes plugin
 * @returns { Promise<WDNSearch|Null> }
 */
export async function initialize(options={}) {
    if (isInitialized) { return searchInstance; }
    isInitialized = true;

    const searchElement = document.querySelector(querySelector);
    if (searchElement === null) { return null; }

    const searchComponent = await import('@js-src/components/wdn-search.js');
    WDNSearch = searchComponent.default;
    await loadStyleSheet(dialogCssUrl);
    await loadStyleSheet(searchCssUrl);

    searchInstance = new WDNSearch(options);

    return searchInstance;
}
