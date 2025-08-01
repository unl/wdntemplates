import popupsCssUrl from '@scss/components-js/_popups.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?UNLPopup} UNLPopup
 */
let UNLPopup = null;

// Query Selector for the tabs component
const querySelector = '.dcf-popup:not(.dcf-popup-initialized)';

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
 * @returns { Promise<void> }
 */
export async function initialize() {
    if (isInitialized) { return UNLPopup; }
    isInitialized = true;

    const popupComponent = await import('@js-src/components/unl-popup.js');
    UNLPopup = popupComponent.default;
    await loadStyleSheet(popupsCssUrl);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: UNLPopup,
            styleSheetsLoaded: [
                popupsCssUrl,
            ],
        },
    }));

    return UNLPopup;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<UNLPopup> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    const loadedElement = new UNLPopup(element, options);
    document.dispatchEvent(new CustomEvent('UNLPluginLoadedElement', {
        detail: {
            loadedElement: loadedElement,
        },
    }));

    return loadedElement;
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<UNLPopup[]> }
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
 * @returns { Promise<UNLPopup[]> }
 */
export async function loadElementsOnPage(options) {
    const allPopups = document.querySelectorAll(querySelector);
    return await loadElements(allPopups, options);
}
