WDN.toolbar = function() {
    var expandedHeight = 0;
    return {
        initialize : function() {
            WDN.loadCSS('wdn/templates_3.0/scripts/plugins/colorbox/colorbox.css');
            if (jQuery.browser.ie) {
                WDN.loadCSS('wdn/templates_3.0/scripts/plugins/colorbox/colorbox-ie.css');
            }
            WDN.loadJS('wdn/templates_3.0/scripts/plugins/colorbox/jquery.colorbox.js', WDN.toolbar.colorboxSetup);
        },
        colorboxSetup : function() {
            WDN.log('Setting up colorbox');
            jQuery("#wdn_tool_links li a.camera").colorbox({width:"100%", height:"80%", iframe:true});
            
        },
        getContent : function(url) {
            
        }    
    };
}();
