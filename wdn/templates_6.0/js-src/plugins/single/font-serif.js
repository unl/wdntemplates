import fontSerifCssUrl from '@scss/components-js/_font-serif.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

// Query Selector for the gallery component
const querySelector = '.unl-font-serif';

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
 * @returns { Promise<Null> }
 */
export async function initialize() {
    if (isInitialized) { return null; }
    isInitialized = true;

    await loadStyleSheet(fontSerifCssUrl);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: null,
            styleSheetsLoaded: [
                fontSerifCssUrl,
            ],
        },
    }));

    return null;
}
