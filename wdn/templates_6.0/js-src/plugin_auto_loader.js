import * as wdn_tabs from "@js-src/plugins/tabs.js";
import * as wdn_toggle_button from "@js-src/plugins/toggle_buttons.js";
import * as wdn_collapsible_fieldset from "@js-src/plugins/collapsible_fieldsets.js";
import * as wdn_figcaption_toggle from "@js-src/plugins/figcaption_toggles.js";
import * as wdn_notice from "@js-src/plugins/notice.js";

// Main WDN plugins
const plugin_map = {
    "wdn_tabs": wdn_tabs,
    "wdn_toggle_button": wdn_toggle_button,
    "wdn_collapsible_fieldset": wdn_collapsible_fieldset,
    "wdn_figcaption_toggle": wdn_figcaption_toggle,
    "wdn_notice": wdn_notice,
};

// Loads all elements that are already on the page
for (const single_plugin_name in plugin_map) {
    if (!plugin_map.hasOwnProperty(single_plugin_name)) { continue; }
    const plugin = plugin_map[single_plugin_name];
    if (typeof plugin.load_elements_on_page !== 'function') {
        throw new Error(`Invalid load_elements_on_page function in plugin: ${single_plugin_name}`);
    }
    plugin.load_elements_on_page();
}

// Loads all elements that are added to the page
const mutationCallback = function(mutationList){
    mutationList.forEach((mutationRecord) => {
        mutationRecord.addedNodes.forEach((nodeAdded) => {
            if (nodeAdded instanceof Element) {
                for (const single_plugin_name in plugin_map) {
                    if (!plugin_map.hasOwnProperty(single_plugin_name)) { continue; }
                    const plugin = plugin_map[single_plugin_name];
                    if (typeof plugin.get_query_selector !== 'function') {
                        throw new Error(`Invalid get_query_selector function in plugin: ${single_plugin_name}`);
                    }
                    if (typeof plugin.load_element !== 'function') {
                        throw new Error(`Invalid load_element function in plugin: ${single_plugin_name}`);
                    }
                    if (nodeAdded.matches(plugin.get_query_selector())) {
                        plugin.load_element(nodeAdded);
                    }
                }
            }
        })
    });
}

const observer = new MutationObserver(mutationCallback)
const observerConfig = {
    subtree: true,
    childList: true,
}
observer.observe(document.body, observerConfig);
