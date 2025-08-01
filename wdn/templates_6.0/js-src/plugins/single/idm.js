import idmCssUrl from '@scss/components-js/_idm.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

/**
 * This is where the imported class will be stored
 * @type {?UNLIdm} UNLIdm
 */
let UNLIdm = null;

/**
 * The single instance of this element
 * @type {?UNLIdm} idmInstance
 */
let idmInstance = null;

// Query Selector for the tabs component
const querySelector = '.dcf-idm';

// Type of plugin
const pluginType = 'single';

// Storing the state whether the plugin is initialized or not
let isInitialized = false;

/**
 * Gets the query selector which is used for this plugin's component
 * @returns { String }
 */
export function getQuerySelector() {
    return querySelector;
}

/**
 * Gets the plugin type
 * @returns { String }
 */
export function getPluginType() {
    return pluginType;
}

/**
 * Returns if the plugin has been initialized yet
 * @returns { Boolean }
 */
export function getIsInitialized() {
    return isInitialized;
}

export function isOnPage() {
    return document.querySelector(querySelector) !== null;
}

/**
 * Initializes plugin
 * @returns { Promise<UNLIdm|Null> }
 */
export async function initialize(options={}) {
    if (isInitialized) { return idmInstance; }
    isInitialized = true;

    const idmElement = document.querySelector(querySelector);
    if (idmElement === null) { return null; }

    const idmComponent = await import('@js-src/components/unl-idm.js');
    UNLIdm = idmComponent.default;
    await loadStyleSheet(idmCssUrl);

    idmInstance = new UNLIdm(options);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: UNLIdm,
            classInstance: idmInstance,
            styleSheetsLoaded: [
                idmCssUrl,
            ],
        },
    }));

    return idmInstance;
}
