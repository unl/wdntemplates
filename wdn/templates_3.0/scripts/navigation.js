
WDN.navigation = function() {
	var expandedHeight = 0;
	return {
		
		preferredState : 0,
		
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
		
		/**
		 * Initialize the navigation, and determine what the correct state
		 * should be (expanded/collapsed).
		 * @todo determine what it should be
		 */
		initialize : function() {
			jQuery('#navigation').append('<div id="navigation-close"></div>');
			jQuery('#navigation').append('<div id="navigation-expand-collapse"><span></span></div>');
			jQuery('#navigation-expand-collapse').click(WDN.navigation.setPreferredState);
			jQuery('#navigation-close').click(WDN.navigation.collapse);
			jQuery('#breadcrumbs ul li a').click(WDN.navigation.changeNavContents);
			WDN.navigation.determineSelectedBreadcrumb();
			if (WDN.getCookie('n')!=1) {
				WDN.navigation.preferred_state = 1;
			}
			WDN.navigation.initializePreferredState();
		},
		
		/**
		 * This function should determine which breadcrumb should be selected.
		 */
		determineSelectedBreadcrumb : function() {
			// Right now, stupidly select the second element.
			jQuery('#breadcrumbs ul li:nth-child(2)').addClass('selected');
			if (jQuery('#breadcrumbs ul li.selected').find('a')) {
				// Found the homepage url in the breadcrumbs
				WDN.navigation.siteHomepage = jQuery('#breadcrumbs ul li.selected').find('a').attr('href');
			} else {
				// Assume it's the current page
				WDN.navigation.siteHomepage = window.location;
			}
			// Store the nav in case it gets changed --- maybe we should do this the first time a change is requested?
			jQuery('#breadcumbs li.selected').append('<div class="storednav">'+jQuery('#navigation ul:first-child').contents()+'</div>');
		},
		
		/**
		 * Expand the navigation section.
		 */
		expand : function() {
			/**
			 * Because we don't know the height, slowly expand to a set height
			 * then snap the rest of the way.
			 */
			jQuery('#navigation ul').animate({height:'198px'},60,0,function(){
					jQuery('#navigation ul').css({height:'auto'});
				});
			jQuery('#navigation ul ul li').show(10);
			jQuery('#navigation ul ul').show(300, function() {
				if (WDN.navigation.preferred_state == 1) {
					jQuery('#navigation-expand-collapse span').text('click to always hide full navigation');
				} else {
					jQuery('#navigation-expand-collapse span').text('click to always show full navigation');
				}
				jQuery('#navigation-expand-collapse span').addClass('expanded');
			});
			jQuery('#navigation-close').fadeIn();
			;
		},
		
		/**
		 * Collapse the navigation
		 */
		collapse : function(animate) {
			if (expandedHeight == 0) {
				//expandedHeight = jQuery('#navigation').height();
			}
			jQuery('#navigation-close').fadeOut( function() {
				jQuery('#navigation-expand-collapse span').text('roll over for full navigation');
				jQuery('#navigation-expand-collapse span').removeClass('expanded');
			});
			jQuery('#navigation ul').css({overflow:'hidden'});
			jQuery('#navigation ul').animate({height:'50px'});
			jQuery('#navigation ul ul li:not(:first-child)').hide(10);
		},
		
		/**
		 * Set a delay for expanding the navigation.
		 */
		startExpandDelay : function () {
			clearTimeout(WDN.navigation.timeout);
			WDN.navigation.timeout = setTimeout(WDN.navigation.expand, WDN.navigation.expandDelay);
		},
		
		/**
		 * Set a delay for collapsing the navigation.
		 */
		startCollapseDelay : function() {
			clearTimeout(WDN.navigation.timeout);
			WDN.navigation.timeout = setTimeout(WDN.navigation.collapse, WDN.navigation.collapseDelay);
		},
		
		setPreferredState : function() {
			if (WDN.getCookie('n')!=1) {
				WDN.log('Setting preferred navigation state OPEN');
				jQuery('#wdn_navigation_wrapper,#breadcrumbs ul li').hover();
				WDN.setCookie('n',1,5000);
				jQuery('#wdn_navigation_bar').css({position:'relative'});
				WDN.navigation.preferred_state = 1;
			} else {
				WDN.log('Setting preferred navigation state CLOSED');
				WDN.setCookie('n',0,-100);
				WDN.navigation.preferred_state = 0;
			}
			WDN.navigation.initializePreferredState();
		},
		
		
		initializePreferredState : function() {
			if (WDN.navigation.preferred_state==1) {
				WDN.navigation.expand();
				jQuery('#wdn_navigation_bar').css({position:'relative'});
				var mouseout = null;
			} else {
				jQuery('#navigation ul:first li:nth-child(6) a:visible:first').css({width:'95%'});
				WDN.navigation.collapse();
				var mouseout = WDN.navigation.startCollapseDelay;
			}
			jQuery('#wdn_navigation_wrapper,#breadcrumbs ul li').hover(
					WDN.navigation.startExpandDelay,
					mouseout);
		},
		
		changeNavContents : function(breadcrumb) {
			console.log(breadcrumb.currentTarget.href);
			var xreq = new WDN.proxy_xmlhttp();
			xreq.open("GET", 'http://www.unl.edu/ucomm/sharedcode/navigation.html', true);
			xreq.onreadystatechange = function() 
			{
				try {
					if (xreq.readyState == 4) {
						if (xreq.status == 200) {
							jQuery('#breadcrumbs ul li a[href="'+breadcrumb.currentTarget.href+'"').append('<div class="storednav">'+xreq.responseText+'</div>');
							jQuery('#navigation ul:first-child').replaceWith(xreq.responseText);
						} else {
							if (undefined == err) {
								document.getElementById(id).innerHTML = 'Error loading results.';
							} else {
								document.getElementById(id).innerHTML = err;
							}
						}
					}
					xreq = new WDN.proxy_xmlhttp();
				} catch(e) {}
			}
			xreq.send(null);
			return false;
		}
	};
}();

