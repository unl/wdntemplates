require(['dcf-utility'], (utilityModule) => {
    // Trigger dcf-webp class processing
    utilityModule.DCFUtility.flagSupportsWebP();

    // Trigger dcf-no-js check
    utilityModule.DCFUtility.flagSupportsJavaScript();
});