import slideshowCssUrl from '@scss/components-js/_slideshows.scss?url';
import figcaptionToggleCssUrl from '@scss/components-js/_figcaption-toggles.scss?url';
import buttonToggleCssUrl from '@scss/components-js/_button-toggles.scss?url';
import { loadStyleSheet } from '@dcf/js/dcf-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?WDNSlideshow} WDNSlideshow
 */
let WDNSlideshow = null;

// Query Selector for the tabs component
const querySelector = '.dcf-slideshow';

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

    const slideshowComponent = await import('@js-src/components/wdn-slideshow.js');
    WDNSlideshow = slideshowComponent.default;
    await loadStyleSheet(slideshowCssUrl);
    await loadStyleSheet(figcaptionToggleCssUrl);
    await loadStyleSheet(buttonToggleCssUrl);
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNSlideshow> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    return new WDNSlideshow(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNSlideshow[]> }
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
 * @returns { Promise<WDNSlideshow[]> }
 */
export async function loadElementsOnPage(options) {
    const allSlideshows = document.querySelectorAll(querySelector);
    return await loadElements(allSlideshows, options);
}
