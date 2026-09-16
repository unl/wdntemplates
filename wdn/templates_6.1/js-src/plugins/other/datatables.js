import datatablesCssUrl from '@scss/components-js/_datatables.scss?url';
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
        await loadStyleSheet(datatablesCssUrl);
        await fakeDefine(options.jQuery);
        return options.jQuery;
    }

    if (isInitialized) { return window.jQuery; }
    isInitialized = true;

    await loadStyleSheet(datatablesCssUrl);
    const { default: jQuery } = await import('@js-src/lib/jquery.js');

    await fakeDefine(jQuery);

    return jQuery;
}

async function fakeDefine(jQuery) {
    const oldDefine = window.define;

    window.define = (deps, factory) => {
        if (typeof factory !== 'function') {
            return;
        }

        factory(jQuery);
    };
    window.define.amd = true;

    try {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const datatablesPath = '../lib/datatables.js';

            script.src = new URL(datatablesPath, import.meta.url).href;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    } finally {
        window.define = oldDefine;
    }
}
