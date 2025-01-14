export const query_selector = ".dcf-tabs";

export let is_initialized = false;
export async function initialize() {
    if (is_initialized) { return; }
    is_initialized = true;

    const wdn_tabs = await import('@js-src/components/wdn-tab.js');
    wdn_tabs.initialize();
}