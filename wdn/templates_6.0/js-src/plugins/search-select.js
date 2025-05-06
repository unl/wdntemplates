import searchSelectCssUrl from '@scss/components-js/_search-selects.scss?url';
import { loadStyleSheet } from '@js-src/lib/wdn-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?WDNSearchSelect} WDNSearchSelect
 */
let WDNSearchSelect = null;

// Query Selector for the tabs component
const querySelector = '.dcf-search-select';

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

    const searchSelectComponent = await import('@js-src/components/wdn-search-select.js');
    WDNSearchSelect = searchSelectComponent.default;
    await loadStyleSheet(searchSelectCssUrl);
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNSearchSelect> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    return new WDNSearchSelect(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNSearchSelect[]> }
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
 * @returns { Promise<WDNSearchSelect[]> }
 */
export async function loadElementsOnPage(options) {
    const allSearchSelects = document.querySelectorAll(querySelector);
    return await loadElements(allSearchSelects, options);
}
