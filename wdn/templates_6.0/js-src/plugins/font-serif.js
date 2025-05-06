import fontSerifCssUrl from '@scss/components-js/_font-serif.scss?url';
import { loadStyleSheet } from '@js-src/lib/wdn-utility.js';

// Query Selector for the gallery component
const querySelector = '.unl-font-serif';

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
 * Returns if the plugin has been initialized yet
 * @returns { Boolean }
 */
export function getIsInitialized() {
    return isInitialized;
}

/**
 * Initializes plugin
 * @returns { Promise<void> }
 */
export async function initialize() {
    if (isInitialized) { return; }
    isInitialized = true;

    await loadStyleSheet(fontSerifCssUrl);
}

/**
 * Loads a single instance of the component
 * @returns { Promise<Void> }
 */
export async function loadElement() {
    if (!isInitialized) {
        await initialize();
    }
}

/**
 * Loads components from all elements passed in
 * @async
 * @returns { Promise<Void> }
 */
export async function loadElements() {
    if (!isInitialized) {
        await initialize();
    }
}

/**
 * Using the `query_selector` we will load all elements on the page
 * @async
 * @returns { Promise<Void> }
 */
export async function loadElementsOnPage() {
    if (!isInitialized) {
        await initialize();
    }
}
