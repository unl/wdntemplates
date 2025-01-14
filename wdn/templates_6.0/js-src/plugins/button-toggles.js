export const query_selector = "wdn-toggle-button";

export let is_initialized = false;
export async function initialize() {
    if (is_initialized) { return; }
    is_initialized = true;

    const wdn_button_toggle = await import('@js-src/components/wdn-button-toggle.js');
    customElements.define('wdn-toggle-button', wdn_button_toggle.default);
}