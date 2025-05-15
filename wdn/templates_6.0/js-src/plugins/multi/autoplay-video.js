import autoplayVideosCssUrl from '@scss/components-js/_autoplay-videos.scss?url';
import { loadStyleSheet } from '@js-src/lib/wdn-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?WDNAutoplayVideoToggle} WDNAutoplayVideoToggle
 */
let WDNAutoplayVideoToggle = null;

// Query Selector for the datepicker toggle component
const querySelector = '.dcf-autoplay-video';

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
 * @returns { Promise<WDNAutoplayVideoToggle> }
 */
export async function initialize() {
    if (isInitialized) { return WDNAutoplayVideoToggle; }
    isInitialized = true;

    const autoplayVideoContainer = await import('@js-src/components/wdn-autoplay-video.js');
    WDNAutoplayVideoToggle = autoplayVideoContainer.default;
    await loadStyleSheet(autoplayVideosCssUrl);

    return WDNAutoplayVideoToggle;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNAutoplayVideoToggle> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    return new WDNAutoplayVideoToggle(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNAutoplayVideoToggle[]> }
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
 * @returns { Promise<WDNAutoplayVideoToggle[]> }
 */
export async function loadElementsOnPage(options) {
    const allAutoplayVideoContainers = document.querySelectorAll(querySelector);
    return await loadElements(allAutoplayVideoContainers, options);
}
