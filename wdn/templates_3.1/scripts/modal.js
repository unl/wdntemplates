WDN.modal = (function() {
    return {
        initialize : function(callback) {
            WDN.log("initialize modal");
            // Colorbox CSS MUST load before the plugin script
            WDN.loadCSS(WDN.getTemplateFilePath('css/header/colorbox.css'), function() {
            	WDN.loadJQuery(function() {
            		WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/colorbox/jquery.colorbox-min.js'), callback);
            	});
            });
        }
    };
})();
