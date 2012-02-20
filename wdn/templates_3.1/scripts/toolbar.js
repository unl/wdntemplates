/**
 * This handles the toolbar at the top of the template page.
 * 
 * Tools that wish to be shown within the toolbar modal dialog must follow
 * this basic structure:
 * 
 *
WDN.toolbar_mytoolname = function() {
    return {
        initialize : function(callback(content)) {
			// This is called when the tool is initialized before it is shown
			// Loads initial content, callback must provide content param
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
	return {
		
		initialize : function() {
			WDN.jQuery('#wdn_tool_links a').click(function(ev) {
				ev.preventDefault();
				WDN.jQuery('#wdn_tool_links a').unbind('click');
				WDN.jQuery('#header').append('<div class="hidden"><div id="toolbarcontent"></div></div>');
				var that = WDN.jQuery(this);
				WDN.initializePlugin('modal', [function() {
					WDN.toolbar.setup();
					WDN.jQuery(that).click();
				}]);
			});
		},
		
		setup : function() {
			WDN.loadCSS(WDN.getTemplateFilePath('css/header/tooltabs.css'));
			WDN.loadCSS(WDN.getTemplateFilePath('css/header/tools_content.css'));
			
			// The id #cboxWrapper is specified in jquery.colorbox.js 
			WDN.jQuery('#cboxWrapper').prepend('<div id="tooltabs"><ul></ul></div>');
			
			WDN.toolbar.registerTool('feeds', 'RSS Feeds', 1002, 500);
			WDN.toolbar.registerTool('weather', 'Weather', 1002, 500);
			WDN.toolbar.registerTool('events', 'Events', 1002, 550);
			WDN.toolbar.registerTool('directory', 'Directory', 1002, 550);
			WDN.toolbar.registerTool('webcams', 'Webcams', 1002, 350);
		},
        
        /**
         * Just register a tool so we know about it.
         * 
         * @param {string} plugin_name The JS file containing the tool.
         * @param {string} title       The title to display for the tool tab
         * @param {number} pwidth      Width needed for the plugin
         * @param {number} pheight     Height needed for the plugin
         */
        registerTool : function(plugin_name, title, pwidth, pheight) {
        	var $toolTabs = WDN.jQuery('#tooltabs ul');
        	$toolTabs.append('<li class="'+plugin_name+'"><a href="#" class="'+plugin_name+'"><span class="icon"></span>'+title+'</a></li>');
        	WDN.jQuery("a." + plugin_name, WDN.jQuery('#wdn_tool_links'))
        		.add("a." + plugin_name, $toolTabs)
		 		.click(function(ev) {
		 			ev.preventDefault();
		 			WDN.toolbar.switchToolFocus(plugin_name, pwidth, pheight);
		 			return false;
		 		});
        },
        
        /**
         * Switches focus to a different tool.
         * 
         * @param {string} plugin_name The tool to select
         * @param {number} width ColorBox width
         * @param {number} height ColorBox height
         */
        switchToolFocus : function(plugin_name, width, height) {
        	var toolContainer = '#toolbarcontent',
        		toolbarName = 'toolbar_' + plugin_name, 
        		$toolContent = WDN.jQuery('#' + toolbarName),
        		$tooltabs = WDN.jQuery('#tooltabs li');
        	
        	if ($toolContent.length && $toolContent.is(':visible')) {
        		return;
        	}
        	
        	WDN.jQuery(toolContainer + ' .toolbar_plugin').hide();
        	
        	var contentReady = function() {
        		$toolContent.show();
        		WDN[toolbarName].display();
        		WDN.jQuery.colorbox({
	    			width: width, 
	    			height: height, 
	    			inline: true, 
	    			href: toolContainer,
	    			onComplete: function() {
	    				$tooltabs.parents('#tooltabs').show();
	    				$tooltabs.filter('.' + plugin_name).find('a').focus();
	    			},
	    			onOpen: function() {
	    				WDN.jQuery("#colorbox").addClass('withTabs');
	    			},
	    			onClosed: function() {
	    				WDN.jQuery("#colorbox").removeClass('withTabs');
	    				WDN.jQuery("#tooltabs").hide();
	    			}
		 		});
        	};
        	
        	if (!$toolContent.length) {
        		WDN.initializePlugin('toolbar_' + plugin_name, [function(content) {
    				$toolContent = WDN.jQuery('<div id="' + toolbarName + '" class="toolbar_plugin" />')
    					.append(content).appendTo(toolContainer);
    				contentReady();
				}]);
        	} else {
        		contentReady();
        	}
        	
        	$tooltabs.removeClass('current').filter('.' + plugin_name).addClass('current');
        }
    };
}();