import collapsibleFieldsetsCssUrl from '@scss/components-js/_collapsible-fieldsets.scss?url';
import buttonToggleCssUrl from '@scss/components-js/_button-toggles.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?UNLImageCropper} UNLImageCropper
 */
let UNLImageCropper = null;

// Query Selector for the image cropper element
const querySelector = '.dcf-image-cropper:not(.dcf-image-cropper-initialized)';

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
 * @returns { Promise<UNLImageCropper> }
 */
export async function initialize() {
    if (isInitialized) { return UNLImageCropper; }
    isInitialized = true;

    const imageCropperComponent = await import('@js-src/components/unl-image-cropper.js');
    UNLImageCropper = imageCropperComponent.default;

    await loadStyleSheet(buttonToggleCssUrl);
    await loadStyleSheet(collapsibleFieldsetsCssUrl);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: UNLImageCropper,
            styleSheetsLoaded: [
            ],
        },
    }));

    return UNLImageCropper;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<UNLImageCropper> }
 */
export async function loadElement(element, options) {
    if (!isInitialized) {
        await initialize();
    }

    const loadedElement = new UNLImageCropper(element, options);
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
 * @returns { Promise<UNLImageCropper[]> }
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
 * @returns { Promise<UNLImageCropper[]> }
 */
export async function loadElementsOnPage(options) {
    const allImageCroppers = document.querySelectorAll(querySelector);
    return await loadElements(allImageCroppers, options);
}
