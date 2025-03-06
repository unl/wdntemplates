import tabs_css_url from '@scss/components-js/_tabs.scss?url';
import { loadStyleSheet } from '@dcf/js/dcf-utility.js';

// This is where the imported class will go
let wdn_tabs = null;

// Query Selector for the tabs component
export const query_selector = ".dcf-tabs";

// Storing the state whether the plugin is initialized or not
export let is_initialized = false;

/**
 * Initializes plugin
 * @returns { Promise<void> }
 */
export async function initialize() {
    if (is_initialized) { return; }
    is_initialized = true;

    const tabs_component = await import('@js-src/components/wdn_tab.js');
    wdn_tabs = tabs_component.default;
    await loadStyleSheet(tabs_css_url);
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNTabs> }
 */
export async function load_element(element, options) {
    if (!is_initialized) {
        await initialize();
    }

    return new wdn_tabs(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNTabs[]> }
 */
export async function load_elements(elements, options) {
    let output_elements = []
    for (const single_element of elements) {
        output_elements.push(await load_element(single_element, options));
    }
    return output_elements;
}

/**
 * Using the `query_selector` we will load all elements on the page
 * @async
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNTabs[]> }
 */
export async function load_elements_on_page(options) {
    let all_tabs = document.querySelectorAll(query_selector);
    return await load_elements(all_tabs, options);
}
