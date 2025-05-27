import datepickerCssUrl from '@scss/components-js/_datepickers.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?UNLDatepicker} UNLDatepicker
 */
let UNLDatepicker = null;

// Query Selector for the datepicker toggle component
const querySelector = '.dcf-datepicker';

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
 * @returns { Promise<UNLDatepicker> }
 */
export async function initialize() {
    if (isInitialized) { return UNLDatepicker; }
    isInitialized = true;

    const datepickerComponent = await import('@js-src/components/unl-datepicker.js');
    UNLDatepicker = datepickerComponent.default;
    await loadStyleSheet(datepickerCssUrl);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: UNLDatepicker,
            styleSheetsLoaded: [
                datepickerCssUrl,
            ],
        },
    }));

    return UNLDatepicker;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<UNLDatepicker> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    const loadedElement = new UNLDatepicker(element, options);
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
 * @returns { Promise<UNLDatepicker[]> }
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
 * @returns { Promise<UNLDatepicker[]> }
 */
export async function loadElementsOnPage(options) {
    const allDatepickers = document.querySelectorAll(querySelector);
    return await loadElements(allDatepickers, options);
}
