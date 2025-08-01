import figcaptionToggleCssUrl from '@scss/components-js/_figcaption-toggles.scss?url';
import buttonToggleCssUrl from '@scss/components-js/_button-toggles.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?UNLFigcaptionToggle} UNLFigcaptionToggle
 */
let UNLFigcaptionToggle = null;

// Query Selector for the figcaption toggle component
const querySelector = '.dcf-figcaption-toggle:not(.dcf-figcaption-toggle-initialized)';

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
 * @returns { Promise<UNLFigcaptionToggle> }
 */
export async function initialize() {
    if (isInitialized) { return UNLFigcaptionToggle; }
    isInitialized = true;

    const figcaptionToggleComponent = await import('@js-src/components/unl-figcaption-toggle.js');
    UNLFigcaptionToggle = figcaptionToggleComponent.default;
    await loadStyleSheet(buttonToggleCssUrl);
    await loadStyleSheet(figcaptionToggleCssUrl);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: UNLFigcaptionToggle,
            styleSheetsLoaded: [
                buttonToggleCssUrl,
                figcaptionToggleCssUrl,
            ],
        },
    }));

    return UNLFigcaptionToggle;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<UNLFigcaptionToggle> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    const loadedElement = new UNLFigcaptionToggle(element, options);
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
 * @returns { Promise<UNLFigcaptionToggle[]> }
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
 * @returns { Promise<UNLFigcaptionToggle[]> }
 */
export async function loadElementsOnPage(options) {
    const allFigcaptionToggles = document.querySelectorAll(querySelector);
    return await loadElements(allFigcaptionToggles, options);
}
