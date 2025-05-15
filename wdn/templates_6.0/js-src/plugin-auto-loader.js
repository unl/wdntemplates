if (
    !('UNL' in window) ||
    typeof window.UNL !== 'object' ||
    !('autoLoader' in window.UNL) ||
    typeof window.UNL.autoLoader !== 'object' ||
    !('config' in window.UNL.autoLoader) ||
    typeof window.UNL.autoLoader.config !== 'object'
) {
    // Load the head-2.js script if it wasn't loaded already
    await import('@js-src/head-2.js');
}

document.dispatchEvent(new Event('autoLoaderPreLoad'));

const configPluginList = window.UNL.autoLoader.config.plugins || {};
const enabled = window.UNL.autoLoader.config.enabled || true;
const watch = window.UNL.autoLoader.config.watch || true;

const watchList = [];

if (enabled) {
    window.UNL.autoLoader.plugins = {};
    for (const [pluginName, pluginPath] of Object.entries(configPluginList)) {
        window.UNL.autoLoader.plugins[pluginName] = {
            module: await import(pluginPath),
            elements: [],
        };
    }

    // Loads all elements that are already on the page
    for (const singlePluginName in window.UNL.autoLoader.plugins) {
        const pluginData = window.UNL.autoLoader.plugins[singlePluginName];
        const pluginModule = pluginData.module;

        if (typeof pluginModule.getPluginType !== 'function') {
            continue;
        }

        if (pluginModule.getPluginType() === 'single') {
            if (typeof pluginModule.isOnPage !== 'function') {
                throw new Error(`Invalid isOnPage function in plugin: ${singlePluginName}`);
            }
            if (typeof pluginModule.initialize !== 'function') {
                throw new Error(`Invalid initialize function in plugin: ${singlePluginName}`);
            }
            if (pluginModule.isOnPage()) {
                const element = await pluginModule.initialize();
                if (element !== null) {
                    pluginData.elements.push(element);
                }
            } else {
                watchList.push(singlePluginName);
            }

        } else if (pluginModule.getPluginType() === 'multi') {
            if (typeof pluginModule.loadElementsOnPage !== 'function') {
                throw new Error(`Invalid loadElementsOnPage function in plugin: ${singlePluginName}`);
            }
            const elements = await pluginModule.loadElementsOnPage();
            pluginData.elements = pluginData.elements.concat(elements);

            watchList.push(singlePluginName);
        }
    }
}

if (watch) {
    // Loads all elements that are added to the page
    const mutationCallback = function(mutationList) {
        mutationList.forEach((mutationRecord) => {
            // Loop through each node added and make sure it is an element
            mutationRecord.addedNodes.forEach(async(nodeAdded) => {
                if (nodeAdded instanceof Element) {
                    // Loop through each plugin and check to see if this new element matches it
                    for (const singlePluginName of watchList) {
                        const pluginData = window.UNL.autoLoader.plugins[singlePluginName];
                        const pluginModule = pluginData.module;

                        if (pluginModule.getPluginType() === 'single') {
                            if (typeof pluginModule.getQuerySelector !== 'function') {
                                throw new Error(`Invalid getQuerySelector function in plugin: ${singlePluginName}`);
                            }
                            if (nodeAdded.matches(pluginModule.getQuerySelector())) {
                                const element = await pluginModule.initialize();
                                if (element !== null) {
                                    pluginData.elements.push(element);
                                }
                                watchList.splice(watchList.indexOf(singlePluginName), 1);
                            }

                        } else if (pluginModule.getPluginType() === 'multi') {
                            if (typeof pluginModule.getQuerySelector !== 'function') {
                                throw new Error(`Invalid getQuerySelector function in plugin: ${singlePluginName}`);
                            }
                            if (typeof pluginModule.loadElement !== 'function') {
                                throw new Error(`Invalid loadElement function in plugin: ${singlePluginName}`);
                            }
                            if (nodeAdded.matches(pluginModule.getQuerySelector())) {
                                const element = await pluginModule.loadElement(nodeAdded);
                                pluginData.elements = pluginData.elements.concat(element);
                            }
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
}

window.UNL.autoLoader.loaded = true;

if ('loadCallbackQueue' in window.UNL.autoLoader && Array.isArray(window.UNL.autoLoader.loadCallbackQueue)) {
    window.UNL.autoLoader.loadCallbackQueue.forEach((singleCallback) => {
        singleCallback();
    });
    delete window.UNL.autoLoader.loadCallbackQueue;
}
window.UNL.autoLoader.onLoad = (callbackFunc) => {
    callbackFunc();
};

document.dispatchEvent(new Event('autoLoaderPostLoad'));
