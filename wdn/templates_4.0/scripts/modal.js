define(['wdn', 'require', 'jquery'], function(WDN, require, $) {
	var pluginPath = 'plugins/colorbox/', initd = false;
	
    return {
        initialize : function(callback) {
            // Colorbox CSS MUST load before the plugin script
        	var ready = function() {
        		initd = true;
        		
        		require([pluginPath + 'jquery.colorbox'], function() {
        			$.colorbox.settings.className = 'wdn-main';
        			$(callback);
        		});
            };
            
            if (!initd) {
            	WDN.loadCSS(WDN.getTemplateFilePath('scripts/' + pluginPath + 'css/colorbox.css', true, true), ready);
            } else {
            	ready();
            }
        }
    };
});
