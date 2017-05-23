(function() {
    var WDNLoadDeferredStyles = function() {
        var sheet = document.createElement('link');
        sheet.rel = 'stylesheet';
        sheet.href = 'https://unlcms.unl.edu/wdn/templates_4.1/css/all.css?dep=$DEP_VERSION$';
        document.getElementsByTagName('head')[0].appendChild(sheet);
    };

    var WDNRemoveCriticalStyles = function() {
        document.getElementById('wdn-critical-styles').remove();
    };

    if (sessionStorage.getItem('wdn-css-is-cached')) {
        WDNLoadDeferredStyles();
        setTimeout(function() {
            WDNRemoveCriticalStyles();
        }, 1000);
    } else {
        var deferredStyles = loadCSS('https://unlcms.unl.edu/wdn/templates_4.1/css/all.css?dep=$DEP_VERSION$');
        onloadCSS(deferredStyles, function() {
            sessionStorage.setItem('wdn-css-is-cached', true);
            WDNRemoveCriticalStyles();
        });
    }
})();
