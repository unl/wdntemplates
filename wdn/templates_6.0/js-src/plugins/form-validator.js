import formValidatorCssUrl from '@scss/components-js/_form-validator.scss?url';
import { loadStyleSheet } from '@dcf/js/dcf-utility.js';

// Storing the state whether the plugin is initialized or not
let isInitialized = false;

/**
 * Returns if the plugin has been initialized yet
 * @returns { Boolean }
 */
export function getIsInitialized() {
    return isInitialized;
}

export async function initialize() {
    if (isInitialized) { return window.jQuery; }
    isInitialized = true;

    await loadStyleSheet(formValidatorCssUrl);
    const { default: jQuery } = await import('@js-src/lib/jquery.js');

    // Save old define
    const oldDefine = window.define;
    window.define = (deps, factory) => {
        factory(jQuery);
    };
    window.define.amd = true;

    // Import which should use the fake define we set up
    await import('@js-src/lib/jquery-validator.js');

    // Restore old define
    window.define = oldDefine;

    return jQuery;
}
