import collapsibleFieldsetsCssUrl from '@scss/components-js/_collapsible-fieldsets.scss?url';
import buttonToggleCssUrl from '@scss/components-js/_button-toggles.scss?url';
import { loadStyleSheet } from '@dcf/js/dcf-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?WDNCollapsibleFieldset} WDNCollapsibleFieldset
 */
let WDNCollapsibleFieldset = null;

// Query Selector for the collapsible fieldset component
const querySelector = '.dcf-collapsible-fieldset';

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

    const collapsibleFieldsetsComponent = await import('@js-src/components/wdn-collapsible-fieldset.js');
    WDNCollapsibleFieldset = collapsibleFieldsetsComponent.default;
    await loadStyleSheet(buttonToggleCssUrl);
    await loadStyleSheet(collapsibleFieldsetsCssUrl);
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNCollapsibleFieldset> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    return new WDNCollapsibleFieldset(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNCollapsibleFieldset[]> }
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
 * @returns { Promise<WDNCollapsibleFieldset[]> }
 */
export async function loadElementsOnPage(options) {
    const allFieldsets = document.querySelectorAll(querySelector);
    return await loadElements(allFieldsets, options);
}
