(function() {
    var WDNRemoveCriticalStyles = function() {
        document.getElementById('wdn-critical-styles').remove();
    };

    var deferredStyles = loadCSS('https://unlcms.unl.edu/wdn/templates_4.1/css/all.css?dep=$DEP_VERSION$');
    onloadCSS(deferredStyles, function() {
        WDNRemoveCriticalStyles();
    });

})();
