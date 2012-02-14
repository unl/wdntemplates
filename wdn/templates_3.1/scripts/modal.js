WDN.modal = (function() {
    return {
        initialize : function(callback) {
            WDN.log("initialize modal");
            WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/colorbox/jquery.colorbox-min.js'), callback);
            WDN.modal.setup();
        },
        
        setup : function() {
            WDN.loadCSS(WDN.getTemplateFilePath('css/header/colorbox.css'));
        }
    };
})();
