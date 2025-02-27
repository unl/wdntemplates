// import tabs_css_url from '@scss/components/_components.tabs.scss?url';
import { DCFUtility } from '@dcf/js/dcf-utility.js';

// This is where the imported class will go
let wdn_tabs = null;

// Query Selector for the tabs component
export const query_selector = ".dcf-tabs";

// Storing the state whether the plugin is initialized or not
export let is_initialized = false;

/**
 * Initializes plugin
 * @returns { void }
 */
export async function initialize() {
    if (is_initialized) { return; }
    is_initialized = true;

    wdn_tabs = await import('@js-src/components/wdn_tab.js');
    await DCFUtility.loadStyleSheet(tabs_css_url);
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { WDN_Tabs }
 */
export function load_element(element, options) {
    if (!is_initialized) {
        initialize();
    }

    return new wdn_tabs(element, options);
}
