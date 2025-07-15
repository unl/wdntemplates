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

// Setting default values for the autoloader config
const globalOptInSelector = window.UNL.autoLoader.config.globalOptInSelector ?? null;
const globalOptOutSelector = window.UNL.autoLoader.config.globalOptOutSelector ?? null;
const configPluginList = window.UNL.autoLoader.config.plugins ?? {};
const enabled = window.UNL.autoLoader.config.enabled ?? true;
const watch = window.UNL.autoLoader.config.watch ?? true;

// This is the list of plugins we will check with when elements are added to the page
const watchList = [];

if (enabled) {
    window.UNL.autoLoader.plugins = {};
    for (const [pluginName, pluginConfig] of Object.entries(configPluginList)) {
        if (!('url' in pluginConfig)) {
            console.error(`Missing URL in autoloader plugin config: ${pluginName}`);
            continue;
        }
        let pluginModule = null;
        try {
            pluginModule = await import(pluginConfig.url);
        } catch(err) {
            console.error(`Error loading plugin: ${pluginName}`);
            console.error(err);
            continue;
        }
        if (typeof pluginModule.getPluginType !== 'function') {
            console.error(`Plugin missing export: getPluginType (function): ${pluginName}`);
            continue;
        }
        if (typeof pluginModule.initialize !== 'function') {
            console.error(`Plugin missing export: initialize (function): ${pluginName}`);
            continue;
        }
        if (typeof pluginModule.getQuerySelector !== 'function') {
            console.error(`Plugin missing export: getQuerySelector (function): ${pluginName}`);
            continue;
        }
        if (pluginModule.getPluginType() === 'single') {
            if (typeof pluginModule.isOnPage !== 'function') {
                console.error(`Plugin missing export: isOnPage (function): ${pluginName}`);
                continue;
            }
        } else if (pluginModule.getPluginType() === 'multi') {
            if (typeof pluginModule.loadElement !== 'function') {
                console.error(`Plugin missing export: loadElement (function): ${pluginName}`);
                continue;
            }
            if (typeof pluginModule.loadElements !== 'function') {
                console.error(`Plugin missing export: loadElements (function): ${pluginName}`);
                continue;
            }
        }

        window.UNL.autoLoader.plugins[pluginName] = {
            optInSelector: pluginConfig?.optInSelector ?? null,
            optOutSelector: pluginConfig?.optOutSelector ?? null,
            customConfig: pluginConfig?.customConfig ?? {},
            onPluginInitialized: pluginConfig?.onPluginInitialized ?? null,
            onPluginLoadedElement: pluginConfig?.onPluginLoadedElement ?? null,
            module: pluginModule,
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

        // If the single plugins target is not on the page then we will add it to the watch list
        //   if it is on the page when we will initialize the plugin
        if (pluginModule.getPluginType() === 'single') {
            if (pluginModule.isOnPage()) {
                const element = await pluginModule.initialize(pluginData.customConfig);
                if (element !== null) {
                    pluginData.elements.push(element);
                    if (typeof pluginData.onPluginLoadedElement === 'function') {
                        pluginData.onPluginLoadedElement({
                            loadedElement: element,
                        });
                    }
                }
            } else {
                watchList.push(singlePluginName);
            }

        } else if (pluginModule.getPluginType() === 'multi') {
            watchList.push(singlePluginName);

            let matchingElements = Array.from(document.querySelectorAll(pluginModule.getQuerySelector()));
            // Filter out opt out
            if (globalOptOutSelector !== null) {
                matchingElements = matchingElements.filter((matchingElement) => {
                    return !(matchingElement.matches(globalOptOutSelector));
                });
            }
            if (pluginData.optOutSelector !== null) {
                matchingElements = matchingElements.filter((matchingElement) => {
                    return !(matchingElement.matches(pluginData.optOutSelector));
                });
            }

            // Filter out non-opt in
            if (globalOptInSelector !== null) {
                matchingElements = matchingElements.filter((matchingElement) => {
                    return matchingElement.matches(globalOptInSelector);
                });
            }
            if (pluginData.optInSelector !== null) {
                matchingElements = matchingElements.filter((matchingElement) => {
                    return matchingElement.matches(pluginData.optInSelector);
                });
            }

            // load the rest of the elements and add the plugin to the watch list
            const elements = await pluginModule.loadElements(matchingElements, pluginData.customConfig);
            pluginData.elements = pluginData.elements.concat(elements);
            if (typeof pluginData.onPluginLoadedElement === 'function') {
                elements.forEach((singleElement) => {
                    pluginData.onPluginLoadedElement({
                        loadedElement: singleElement,
                    });
                });
            }
        }
    }
}

if (enabled && watch) {
    // Loads all elements that are added to the page
    const mutationCallback = async(mutationList) => {
        for (const mutationRecord of mutationList) {
            // Loop through each node added and make sure it is an element
            for (const nodeAdded of mutationRecord.addedNodes) {
                if (nodeAdded instanceof Element) {
                    // Loop through each plugin and check to see if this new element matches it
                    for (const singlePluginName of watchList) {
                        const pluginData = window.UNL.autoLoader.plugins[singlePluginName];
                        const pluginModule = pluginData.module;

                        let foundElements = [];
                        if (nodeAdded.matches(pluginModule.getQuerySelector())) {
                            foundElements.push(nodeAdded);
                        }
                        foundElements = foundElements.concat(Array.from(nodeAdded.querySelectorAll(pluginModule.getQuerySelector())));

                        for (const singleFoundElement of foundElements) {
                            if (globalOptOutSelector !== null && singleFoundElement.matches(globalOptOutSelector)) {
                                return;
                            }
                            if (globalOptInSelector !== null && !singleFoundElement.matches(globalOptInSelector)) {
                                return;
                            }
                            if (pluginData.optInSelector !== null && !(singleFoundElement.matches(pluginData.optInSelector))) {
                                return;
                            }
                            if (pluginData.optOutSelector !== null && singleFoundElement.matches(pluginData.optOutSelector)) {
                                return;
                            }

                            if (pluginModule.getPluginType() === 'single') {
                                const element = await pluginModule.initialize(pluginData.customConfig);
                                if (element !== null) {
                                    pluginData.elements.push(element);
                                    if (typeof pluginData.onPluginLoadedElement === 'function') {
                                        pluginData.onPluginLoadedElement({
                                            loadedElement: element,
                                        });
                                    }
                                }
                                watchList.splice(watchList.indexOf(singlePluginName), 1);

                            } else if (pluginModule.getPluginType() === 'multi') {
                                const element = await pluginModule.loadElement(singleFoundElement, pluginData.customConfig);
                                pluginData.elements = pluginData.elements.concat(element);
                                if (typeof pluginData.onPluginLoadedElement === 'function') {
                                    pluginData.onPluginLoadedElement({
                                        loadedElement: element,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(mutationCallback);
    const observerConfig = {
        subtree: true,
        childList: true,
    };
    observer.observe(document.body, observerConfig);
}

window.UNL.autoLoader.loaded = true;

// Clear out the queue and delete it's key-value pair since it is no longer needed
if ('loadCallbackQueue' in window.UNL.autoLoader && Array.isArray(window.UNL.autoLoader.loadCallbackQueue)) {
    window.UNL.autoLoader.loadCallbackQueue.forEach((singleCallback) => {
        singleCallback();
    });
    delete window.UNL.autoLoader.loadCallbackQueue;
}
// Redefine onload to just call the callback since we have loaded
window.UNL.autoLoader.onLoad = (callbackFunc) => {
    callbackFunc();
};

document.dispatchEvent(new Event('autoLoaderPostLoad'));
