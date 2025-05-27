/**
 * This is where the imported class will be stored
 * @type {?UNLQa} UNLQa
 */
let UNLQa = null;

/**
 * @type {?HTMLElement} qaInstance
 */
let qaInstance = null;

// Query Selector for the qa component
const querySelector = '#qa-test';

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
 * @returns { Promise<UNLQa|null> }
 */
export async function initialize(options={}) {
    if (isInitialized) { return qaInstance; }
    isInitialized = true;

    const qaElement = document.querySelector(querySelector);
    if (qaElement === null) { return null; }

    const qaComponent = await import('@js-src/components/unl-qa.js');
    UNLQa = qaComponent.default;

    qaInstance = new UNLQa(options);

    document.dispatchEvent(new CustomEvent('UNLPluginInitialized', {
        detail: {
            pluginType: pluginType,
            pluginComponent: UNLQa,
            classInstance: qaInstance,
            styleSheetsLoaded: [],
        },
    }));

    return qaInstance;
}
