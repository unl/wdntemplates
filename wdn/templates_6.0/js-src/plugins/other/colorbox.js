import colorBoxCssUrl from '@scss/components-js/_jquery-colorbox.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

/**
 * This is where the imported jquery will go
 * @type {?jQuery} jQuery
 */
let jQuery = null;

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

/**
 * 
 * @returns { Promise<jQuery> }
 */
export async function initialize(options = {}) {
    if ('jQuery' in options) {
        await loadStyleSheet(colorBoxCssUrl);
        await fakeDefine(options.jQuery);
        return options.jQuery;
    }

    if (isInitialized) { return jQuery; }
    isInitialized = true;

    await loadStyleSheet(colorBoxCssUrl);
    const jQueryModule = await import('@js-src/lib/jquery.js');
    jQuery = jQueryModule.default;

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
    await import('@js-src/lib/jquery-colorbox.js');

    // Restore old define
    window.define = oldDefine;
}
