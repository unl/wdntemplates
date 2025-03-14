// This is where the imported class will go
let wdn_autoplay_video = null;

// Query Selector for the datepicker toggle component
const query_selector = ".dcf-autoplay-video";

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

    const autoplay_video_container = await import('@js-src/components/wdn_autoplay_video.js');
    wdn_autoplay_video = autoplay_video_container.default;
}

/**
 * Loads a single instance of the component
 * @param { HTMLElement } element The element to initialize
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNAutoplayVideoToggle> }
 */
export async function load_element(element, options) {
    if (!is_initialized) {
        await initialize();
    }

    return new wdn_autoplay_video(element, options);
}

/**
 * Loads components from all elements passed in
 * @async
 * @param { HTMLCollectionOf<HTMLElement> | HTMLElement[] } elements 
 * @param { Object } options optional parameters to pass in when loading the element
 * @returns { Promise<WDNAutoplayVideoToggle[]> }
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
 * @returns { Promise<WDNAutoplayVideoToggle[]> }
 */
export async function load_elements_on_page(options) {
    let all_autoplay_video_containers = document.querySelectorAll(query_selector);
    return await load_elements(all_autoplay_video_containers, options);
}
