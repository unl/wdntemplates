define(['wdn', 'require'], function(WDN, require) {
	var pluginPath = './plugins/colorbox/', initd = false;
	
    return {
        initialize : function(callback) {
            // Colorbox CSS MUST load before the plugin script
        	var ready = function() {
        		initd = true;
        		
            	WDN.loadJQuery(function() {
            		var min = '', body = document.getElementsByTagName('body');
        			if (!body.length || !body[0].className.match(/(^|\s)debug(\s|$)/)) {
        				min = '-min';
        			}
            		require([pluginPath + 'jquery.colorbox' + min], callback);
            	});
            };
            
            if (!initd) {
            	WDN.loadCSS(require.toUrl(pluginPath + 'css/colorbox.css'), ready);
            } else {
            	ready();
            }
        }
    };
});
