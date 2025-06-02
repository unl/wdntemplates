import jqueryUiCssUrl from '@scss/components-js/_jquery-ui-wdn.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

// Storing the state whether the plugin is initialized or not
let isInitialized = false;

// Type of plugin
const pluginType = 'other';

/**
 * Returns if the plugin has been initialized yet
 * @returns { Boolean }
 */
export function getIsInitialized() {
    return isInitialized;
}

/**
 * Gets the plugin type
 * @returns { String }
 */
export function getPluginType() {
    return pluginType;
}

export async function initialize(options = {}) {
    if ('jQuery' in options) {
        await loadStyleSheet(jqueryUiCssUrl);
        await fakeDefine(options.jQuery);
        return options.jQuery;
    }

    if (isInitialized) { return window.jQuery; }
    isInitialized = true;

    await loadStyleSheet(jqueryUiCssUrl);
    const { default: jQuery } = await import('@js-src/lib/jquery.js');

    await fakeDefine(jQuery);

    return jQuery;
}

async function fakeDefine(jQuery) {
    // Save old define
    const oldDefine = window.define;
    window.define = (deps, factory) => {
        factory(jQuery);
    };
    window.define.amd = true;

    // Import which should use the fake define we set up
    await import('@js-src/lib/jquery-ui.js');

    // Restore old define
    window.define = oldDefine;
}
