/**
 * This handles the toolbar at the top of the template page.
 * 
 * Tools that wish to be shown within the toolbar modal dialog must follow
 * this basic structure:
 * 
 *
WDN.toolbar_mytoolname = function() {
    return {
        initialize : function() {
			// This is called when the tool is initialized before it is shown
        },
        setupToolContent : function() {
        	// This is where your tool's content resides
        	return '<div class="col">mytool content</div>';
        },
        display : function() {
    		// this will be called when the tool is displayed
        }
    };
}();

 * To register a tool - you must call:
 * WDN.toolbar.registerTool('mytoolname', 'My Tool Title', width, height);
 * 
 */
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
        	WDN.toolbar.registerTool('feeds', 'RSS Feeds', 1002, 500);
        	WDN.toolbar.registerTool('weather', 'Weather', 1002, 500);
        	WDN.toolbar.registerTool('events', 'Events', 1002, 550);
        	WDN.toolbar.registerTool('peoplefinder', 'Peoplefinder', 1002, 550);
        	WDN.toolbar.registerTool('webcams', 'Webcams', 1002, 400);
        //	WDN.toolbar.registerTool('tourmaps', 'Tour/Maps', 1042, 800);
        },
        setMaskHeight : function(toolName, height) {
        	if(toolName=='feeds')  // this shortens the feed heights so we can get the message about feeds at the bottom
        		maskheight = (height-257)+'px';
        	else if(toolName=='peoplefinder')  // this shortens the feed heights so we can get the message about feeds at the bottom
        		maskheight = (height-172)+'px';
        	else
        		maskheight = (height-121)+'px';
        	jQuery('#toolbar_'+toolName+' div.toolbarMask').height(maskheight);
        	jQuery('#toolbar_'+toolName+' div.toolbarMask').css({overflow:"auto", padding:"0 3px 0 0"});
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
        	jQuery("a."+plugin_name).click(function(){WDN.toolbar.switchToolFocus(plugin_name, pheight);});
        },
        setToolContent : function(plugin_name, content) {
        	jQuery("#toolbarcontent").append('<div id="toolbar_'+plugin_name+'" class="toolbar_plugin">'+content+'</div>');
        },
        getContent : function(type, height) { 
        	eval('WDN.toolbar_'+type+'.display();');
        //	jQuery("#cboxTitle").css({height:'0px'}); //Hide the cboxTitle at the bottom
        	WDN.toolbar.setMaskHeight(type, height); //Now that content is loaded, add the scroll bars
        },
        /**
         * Switches focus to a different tool.
         * 
         * @param string selected The tool to select
         */
        switchToolFocus : function(selected, height) {
        	jQuery('#toolbarcontent .toolbar_plugin').hide();
        	WDN.initializePlugin('toolbar_'+selected,
        			function(){
        				if (!WDN.toolbar.tools[selected]) {
	        				eval('var content = WDN.toolbar_'+selected+'.setupToolContent();'); 
	        				WDN.toolbar.setToolContent(selected, content);
	        				WDN.toolbar.tools[selected] = true;
        				}
		        		eval('WDN.toolbar_'+selected+'.initialize();');
		        		WDN.toolbar.getContent(selected, height);
		        		jQuery('#toolbar_'+selected).show();
	    			});
        	if ( jQuery("#tooltabs li").hasClass("current") ){
        		jQuery("#tooltabs li").removeClass("current");        		
        	}
        	jQuery('#tooltabs li.'+selected+'').addClass("current");
        }
    };
}();