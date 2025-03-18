import pagination_css_url from '@scss/components-js/_pagination.scss?url';
import { loadStyleSheet } from '@dcf/js/dcf-utility.js';

// This is where the imported class will go
let wdn_pagination = null;

// Query Selector for the tabs component
const query_selector = ".dcf-pagination";

// Storing the state whether the plugin is initialized or not
let is_initialized = false;

/**
 * Gets the query selector which is used for this plugin's component
 * @returns { String }
 */
export function get_query_selector() {
    return query_selector;
}

/**
 * Returns if the plugin has been initialized yet
 * @returns { Boolean }
 */
export function get_is_initialized() {
    return is_initialized;
}

/**
 * Initializes plugin
 * @returns { Promise<void> }
 */
export async function initialize() {
    if (is_initialized) { return; }
    is_initialized = true;

    const pagination_component = await import('@js-src/components/wdn_pagination.js');
    wdn_pagination = pagination_component.default;
    await loadStyleSheet(pagination_css_url);
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNPagination> }
 */
export async function load_element(element, options) {
    if (!is_initialized) {
        await initialize();
    }

    return new wdn_pagination(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNPagination[]> }
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
 * @returns { Promise<WDNPagination[]> }
 */
export async function load_elements_on_page(options) {
    let all_pagination = document.querySelectorAll(query_selector);
    return await load_elements(all_pagination, options);
}
