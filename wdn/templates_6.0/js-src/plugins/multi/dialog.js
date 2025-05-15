import dialogsCssUrl from '@scss/components-js/_dialogs.scss?url';
import { loadStyleSheet } from '@js-src/lib/wdn-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?WDNDialog} WDNDialog
 */
let WDNDialog = null;

// Query Selector for the tabs component
const querySelector = '.dcf-dialog:not(.dcf-dialog-initialized)';

// Type of plugin
const pluginType = 'multi';

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

/**
 * Initializes plugin
 * @returns { Promise<WDNDialog> }
 */
export async function initialize() {
    if (isInitialized) { return WDNDialog; }
    isInitialized = true;

    const dialogComponent = await import('@js-src/components/wdn-dialog.js');
    WDNDialog = dialogComponent.default;
    await loadStyleSheet(dialogsCssUrl);

    return WDNDialog;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNDialog> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    return new WDNDialog(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNDialog[]> }
 */
export async function loadElements(elements, options) {
    const outputElements = [];
    for (const singleElement of elements) {
        outputElements.push(await loadElement(singleElement, options));
    }
    return outputElements;
}

/**
 * Using the `querySelector` we will load all elements on the page
 * @async
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNDialog[]> }
 */
export async function loadElementsOnPage(options) {
    const allDialogs = document.querySelectorAll(querySelector);
    return await loadElements(allDialogs, options);
}
