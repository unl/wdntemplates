
WDN.navigation = function() {
	var expandedHeight = 0;
	return {
		
		preferredState : 0,
		
		currentState : -1,
		
		navigation : Array(),
		
		siteHomepage : '',
		
		/**
		 * Stores an expand/collapse timout.
		 */
		timeout : false,
		
		/**
		 * The delay before expand occurs
		 */
		expandDelay : 250,
		
		/**
		 * The delay before collapse occurs
		 */
		collapseDelay : 60,
		
		changeSiteNavDelay : 250,
		
		/**
		 * Initialize the navigation, and determine what the correct state
		 * should be (expanded/collapsed).
		 * @todo determine what it should be
		 */
		initialize : function() {
			if (jQuery('body').hasClass('popup')
			    || jQuery('body').hasClass('document')) {
				return;
			}
			jQuery('#navigation').append('<div id="navigation-close"></div>');
			jQuery('#navigation').append('<div id="navigation-expand-collapse"><span></span></div>');
			jQuery('#navigation-expand-collapse').click(WDN.navigation.setPreferredState);
			jQuery('#navigation-close').click(WDN.navigation.collapse);
			WDN.navigation.determineSelectedBreadcrumb();
			jQuery('#breadcrumbs ul li a').hover(WDN.navigation.startChangeNavigationDelay);

			// Store the current state of the cookie
			if (WDN.getCookie('n') == 1) {
				WDN.navigation.preferredState = 1;
			}
			WDN.navigation.initializePreferredState();
		},
		
		/**
		 * This function should determine which breadcrumb should be selected.
		 */
		determineSelectedBreadcrumb : function() {
			// Right now, stupidly select the second element.
			jQuery('#breadcrumbs ul li:nth-child(2)').addClass('selected');
			if (jQuery('#breadcrumbs ul li.selected a').size()) {
				// Found the homepage url in the breadcrumbs
				WDN.navigation.siteHomepage = jQuery('#breadcrumbs ul li.selected').find('a').attr('href');
			} else {
				// Assume it's the current page
				WDN.navigation.siteHomepage = window.location;
				jQuery('#breadcrumbs ul li.selected').wrapInner('<a href="'+WDN.navigation.siteHomepage+'"></a>');
			}
		},
		
		/**
		 * Expand the navigation section.
		 */
		expand : function() {
			WDN.log('expand called');
			if (WDN.navigation.currentState == 1) {
				return;
			}
			/**
			 * Because we don't know the height, slowly expand to a set height
			 * then snap the rest of the way.
			 */
			jQuery('#navigation ul').animate({height:'198px'},200,function(){
					jQuery('#navigation ul').css({height:'auto'});
				});
			jQuery('#navigation ul ul li').show(100);
			jQuery('#navigation ul ul').show(300, WDN.navigation.updateHelperText);
			jQuery('#navigation-close').fadeIn();
			WDN.navigation.setWrapperClass('expanded');
			WDN.navigation.currentState = 1;
		},
		
		updateHelperText : function() {
			if (WDN.navigation.preferredState == 1) {
				jQuery('#navigation-expand-collapse span').text('click to always hide full navigation');
			} else {
				if (WDN.navigation.currentState == 0) {
					jQuery('#navigation-expand-collapse span').text('roll over for full navigation');
				} else {
					jQuery('#navigation-expand-collapse span').text('click to always show full navigation');
				}
			}
		},
		
		/**
		 * Collapse the navigation
		 */
		collapse : function(animate) {
			WDN.log('collapse called');
			if (WDN.navigation.currentState == 0) {
				return;
			}
			if (expandedHeight == 0) {
				//expandedHeight = jQuery('#navigation').height();
			}
			jQuery('#navigation-close').fadeOut( function() {
				jQuery('#navigation-expand-collapse span').text('roll over for full navigation');
				WDN.navigation.setWrapperClass('collapsed');
				WDN.navigation.currentState = 0;
			});
			jQuery('#navigation ul').css({overflow:'hidden'});
			jQuery('#navigation ul').animate({height:'50px'});
			jQuery('#navigation ul ul li:not(:first-child)').hide(10);
		},
		
		/**
		 * Set a delay for expanding the navigation.
		 */
		startExpandDelay : function (event) {
			WDN.log('start expand delay');
			if (WDN.navigation.currentState == 1) {
				return;
			}
			clearTimeout(WDN.navigation.timeout);
			WDN.navigation.timeout = setTimeout(WDN.navigation.expand, WDN.navigation.expandDelay);
		},
		
		/**
		 * Set a delay for collapsing the navigation.
		 */
		startCollapseDelay: function(event) {
			WDN.log('start collapse delay');
			if (WDN.navigation.currentState == 0) {
				return;
			}
			clearTimeout(WDN.navigation.timeout);
			if (WDN.navigation.preferredState == 1) {
				return;
			}
			
			WDN.navigation.timeout = setTimeout(WDN.navigation.collapse, WDN.navigation.collapseDelay);
		},
		
		startChangeNavigationDelay: function(breadcrumb) {
			
			WDN.navigation.timeout = setTimeout(function(){WDN.navigation.switchSiteNavigation(breadcrumb);}, WDN.navigation.changeSiteNavDelay);
		},
		
		setPreferredState : function(event) {
			WDN.log('set preferred state');
			if (WDN.getCookie('n')!=1) {
				WDN.log('Setting preferred navigation state OPEN');
				// Remove the hover function?
				//jQuery('#wdn_navigation_bar').hover();
				
				WDN.setCookie('n',1,5000);
				WDN.navigation.preferredState = 1;
			} else {
				WDN.log('Setting preferred navigation state CLOSED');
				WDN.setCookie('n',0,-100);
				WDN.navigation.preferredState = 0;
			}
			WDN.navigation.initializePreferredState();
		},
		
		/**
		 * This function determines the user's preference for navigation.
		 * There are two options, expanded or collapsed.
		 */
		initializePreferredState : function() {
			WDN.log('initializepreferredstate, current state is '+WDN.navigation.currentState);
			if (WDN.navigation.preferredState==1) {
				WDN.navigation.setWrapperClass('pinned');
				WDN.navigation.expand();
				var mouseout = null;
			} else {
				jQuery('#navigation ul:first li:nth-child(6) a:visible:first').css({width:'95%'});
				WDN.navigation.collapse();
				var mouseout = WDN.navigation.startCollapseDelay;
			}
			jQuery('#wdn_navigation_bar').hover(
					WDN.navigation.startExpandDelay,
					mouseout);
			WDN.navigation.updateHelperText();
		},
		
		switchSiteNavigation : function(breadcrumb) {
			WDN.log('Switch site nav called');
			
			if (jQuery(breadcrumb.target).parent().hasClass('selected')) {
				WDN.log('already showing this nav');
				return true;
			}

			// Store the current navigation
            jQuery('#breadcrumbs ul li.selected').append('<div class="storednav"><ul>'+jQuery('#navigation ul').html()+'</ul></div>');
            
            // Set the clicked breadcrumb link to selected
		    jQuery('#breadcrumbs ul li.selected').removeClass('selected');
		    jQuery(breadcrumb.target).parent().addClass('selected');

            // Check for stored navigation
            if (jQuery(breadcrumb.target).siblings('.storednav').length > 0) {
                // We've already grabbed the nav for this link
                WDN.navigation.setNavigationContents(jQuery(breadcrumb.target).siblings('.storednav').contents());
                return true;
            }

			var xreq = new WDN.proxy_xmlhttp();
			var nav_sniffer = 'http://www1.unl.edu/wdn/test/wdn/templates_3.0/scripts/navigationSniffer.php?u=';
			nav_sniffer = nav_sniffer+WDN.toAbs(breadcrumb.target.href, window.location);
			WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
			xreq.open("GET", nav_sniffer, true);
			xreq.onreadystatechange = function() {
				try {
					if (xreq.readyState == 4) {
						if (xreq.status == 200) {
							jQuery('#breadcrumbs ul li a[href="'+breadcrumb.currentTarget.href+'"').append('<div class="storednav">'+xreq.responseText+'</div>');
							WDN.navigation.setNavigationContents(xreq.responseText);
						} else {
							// Error message
							WDN.log('Incorrect status code returned remotely retrieving navigation.');
							WDN.log(xreq);
						}
					}
					xreq = new WDN.proxy_xmlhttp();
				} catch(e) {
					WDN.log('Caught error remotely retrieving navigation.');
					WDN.log(e);
				}
			};
			xreq.send(null);
			return false;
		},
		
		setNavigationContents : function(contents) {
			WDN.log('setNavigationContents called');
            jQuery('#navigation').html(contents);
            WDN.navigation.currentState = -1;
            WDN.navigation.expand();
		},
		
		setWrapperClass : function(css_class) {
			WDN.log('Adding class '+css_class);
			if (css_class=='collapsed') {
				jQuery('#wdn_wrapper').removeClass('nav_pinned');
				jQuery('#wdn_wrapper').removeClass('nav_expanded');
				jQuery('#wdn_wrapper').addClass('nav_'+css_class);
				return;
			}
			
			jQuery('#wdn_wrapper').removeClass('nav_collapsed');
			jQuery('#wdn_wrapper').addClass('nav_'+css_class);
			
		}
	};
}();

