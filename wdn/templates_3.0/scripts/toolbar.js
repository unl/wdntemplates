WDN.toolbar = function() {
    var expandedHeight = 0;
    return {
    	tools : {},
    	
        initialize : function() {
            WDN.loadCSS('wdn/templates_3.0/css/header/colorbox.css');
            
            jQuery('#header').append('<div class="hidden"><div id="toolbarcontent"></div></div>');

            /*
            jQuery('#header').append('<div class="hidden"><div id="feedcontent"></div></div>');
        	
        	*/
        	WDN.loadJS('wdn/templates_3.0/scripts/plugins/colorbox/jquery.colorbox.js', WDN.toolbar.colorboxSetup);
        },
        toolTabsSetup : function() {
        	jQuery('#cboxWrapper').append('<div id="tooltabs"><ul></ul></div>');
        	WDN.toolbar.registerTool('weather', 'Weather', 1002, 510);
        	WDN.toolbar.registerTool('events', 'Events', 1002, 550);
        	WDN.toolbar.registerTool('peoplefinder', 'Peoplefinder', 1002, 550);
        	WDN.toolbar.registerTool('webcams', 'Webcams', 1002, 390);
        },
        colorboxSetup : function() {
            WDN.log('Setting up colorbox');
            WDN.toolbar.toolTabsSetup();
        },
        
        /**
         * Just register a tool so we know about it.
         * 
         * @param string plugin_name The JS file containing the tool.
         * @param string title       The title to display for the tool tab
         * @param int    pwidth      Width needed for the plugin
         * @param int    pheight     Height needed for the plugin
         */
        registerTool : function(plugin_name, title, pwidth, pheight) {
        	jQuery('#tooltabs ul').append('<li class="'+plugin_name+'"><a href="#" class="'+plugin_name+'">'+title+'</a></li>');
        	jQuery("a."+plugin_name).colorbox({width:pwidth, height:pheight, inline:true, href:"#toolbarcontent"});
        	jQuery("a."+plugin_name).click(function(){WDN.toolbar.switchToolFocus(plugin_name);});
        },
        setToolContent : function(plugin_name, content) {
        	jQuery("#toolbarcontent").append('<div id="toolbar_'+plugin_name+'" class="toolbar_plugin">'+content+'</div>');
        },
        getContent : function(type) { 
        	eval('WDN.toolbar_'+type+'.display();');
        	jQuery("#cboxTitle").css({color:'#f2f2f2'}); //Hide the cboxTitle at the bottom
        },
        /**
         * Switches focus to a different tool.
         * 
         * @param string selected The tool to select
         */
        switchToolFocus : function(selected) {
        	jQuery('#toolbarcontent .toolbar_plugin').hide();
        	WDN.initializePlugin('toolbar_'+selected,
        			function(){
        				if (!WDN.toolbar.tools[selected]) {
	        				eval('var content = WDN.toolbar_'+selected+'.setupToolContent();'); 
	        				WDN.toolbar.setToolContent(selected, content);
	        				WDN.toolbar.tools[selected] = true;
        				}
		        		eval('WDN.toolbar_'+selected+'.initialize();');
		        		WDN.toolbar.getContent(selected);
		        		jQuery('#toolbar_'+selected).show();
	    			});
        	if ( jQuery("#tooltabs li").hasClass("current") ){
        		jQuery("#tooltabs li").removeClass("current");        		
        	}
        	jQuery('#tooltabs li.'+selected+'').addClass("current");
        }
    };
}();