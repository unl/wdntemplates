import * as wdn_toggle_buttons from "@js-src/plugins/button-toggles.js";
import * as wdn_tabs from "@js-src/plugins/tabs.js";

if (typeof window.unl_wdn === 'undefined' || typeof window.unl_wdn.plugin_map !== 'object') {
    window.unl_wdn = {};
}

if (typeof window.unl_wdn.plugin_map === 'undefined' || typeof window.unl_wdn.plugin_map !== 'object') {
    window.unl_wdn.plugin_map = {};
}

//TODO: This is a window variable so external plugins can be loaded in
window.unl_wdn.plugin_map.wdn_toggle_buttons = wdn_toggle_buttons;
window.unl_wdn.plugin_map.wdn_tabs = wdn_tabs;


test_plugin_map();


async function test_plugin_map() {
    console.log("Testing all plugins");
    for (const [plugin_name, plugin] of Object.entries(window.unl_wdn.plugin_map)) {
        console.log("Testing ", plugin_name);
        await test_and_initialize_plugin(plugin);
    }
}

async function test_and_initialize_plugin(plugin) {
    console.log("Testing for", plugin.query_selector);
    if (!plugin.is_initialize && document.querySelector(plugin.query_selector) !== null) {
        console.log("Found query selector and initializing");
        await plugin.initialize();
    } else {
        console.log("None Found for", plugin.query_selector);
    }
}


const mutationCallback = function(mutationList){
    mutationList.forEach((mutationRecord) => {
        mutationRecord.addedNodes.forEach((nodeAdded) => {
            if (nodeAdded instanceof Element) {
                test_plugin_map();
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

// // TODO: if the dom is changed and I find the selector in the new stuff then check if plugin is initialized and if not initialize it
