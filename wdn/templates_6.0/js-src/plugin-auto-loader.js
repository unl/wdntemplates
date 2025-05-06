import * as WDNTab from '@js-src/plugins/tab.js';
import * as WDNToggleButton from '@js-src/plugins/toggle-button.js';
import * as WDNCollapsibleFieldset from '@js-src/plugins/collapsible-fieldset.js';
import * as WDNFigcaptionToggle from '@js-src/plugins/figcaption-toggle.js';
import * as WDNNotice from '@js-src/plugins/notice.js';
import * as WDNDatepicker from '@js-src/plugins/datepicker.js';
import * as WDNAutoplayVideo from '@js-src/plugins/autoplay-video.js';
import * as WDNPagination from '@js-src/plugins/pagination.js';
import * as WDNSlideshow from '@js-src/plugins/slideshow.js';
import * as WDNSearchSelect from '@js-src/plugins/search-select.js';
import * as WDNPopup from '@js-src/plugins/popup.js';
import * as WDNDialog from '@js-src/plugins/dialog.js';
import * as WDNGallery from '@js-src/plugins/gallery.js';
import * as WDNIDM from '@js-src/plugins/idm.js';
import * as WDNSearch from '@js-src/plugins/search.js';

// Main WDN plugins
const pluginMap = {
    'wdn_tab': WDNTab,
    'wdn_toggle_button': WDNToggleButton,
    'wdn_collapsible_fieldset': WDNCollapsibleFieldset,
    'wdn_figcaption_toggle': WDNFigcaptionToggle,
    'wdn_notice': WDNNotice,
    'wdn_datepicker': WDNDatepicker,
    'wdn_autoplay_video': WDNAutoplayVideo,
    'wdn_pagination': WDNPagination,
    'wdn_slideshow': WDNSlideshow,
    'wdn_search_select': WDNSearchSelect,
    'wdn_popup': WDNPopup,
    'wdn_dialog': WDNDialog,
    'wdn_gallery': WDNGallery,
    'wdn_idm': WDNIDM,
    'wdn_search': WDNSearch,
};

// Loads all elements that are already on the page
for (const singlePluginName in pluginMap) {
    if (!Object.hasOwn(pluginMap, singlePluginName)) { continue; }
    const plugin = pluginMap[singlePluginName];
    if (typeof plugin.loadElementsOnPage !== 'function') {
        throw new Error(`Invalid loadElementsOnPage function in plugin: ${singlePluginName}`);
    }
    plugin.loadElementsOnPage();
}

// Loads all elements that are added to the page
const mutationCallback = function(mutationList) {
    mutationList.forEach((mutationRecord) => {
        mutationRecord.addedNodes.forEach((nodeAdded) => {
            if (nodeAdded instanceof Element) {
                for (const singlePluginName in pluginMap) {
                    if (!Object.hasOwn(pluginMap, singlePluginName)) { continue; }
                    const plugin = pluginMap[singlePluginName];
                    if (typeof plugin.getQuerySelector !== 'function') {
                        throw new Error(`Invalid getQuerySelector function in plugin: ${singlePluginName}`);
                    }
                    if (typeof plugin.loadElement !== 'function') {
                        throw new Error(`Invalid loadElement function in plugin: ${singlePluginName}`);
                    }
                    if (nodeAdded.matches(plugin.getQuerySelector())) {
                        plugin.loadElement(nodeAdded);
                    }
                }
            }
        });
    });
};

const observer = new MutationObserver(mutationCallback);
const observerConfig = {
    subtree: true,
    childList: true,
};
observer.observe(document.body, observerConfig);
