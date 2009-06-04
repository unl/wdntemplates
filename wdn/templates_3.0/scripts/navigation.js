
WDN.navigation = function() {
	var expandedHeight = 0;
	return {
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
			jQuery('#wdn_navigation_wrapper,#breadcrumbs ul li').hover(WDN.navigation.startExpandDelay,
												WDN.navigation.startCollapseDelay);
			jQuery('#navigation ul:first li:nth-child(6) a:visible:first').css({width:'95%'});
			jQuery('#navigation').append('<div id="navigation-close"></div>');
			jQuery('#navigation').append('<div id="navigation-expand-collapse"><span></span></div>');
			jQuery('#navigation-close').click(WDN.navigation.collapse);
			WDN.navigation.determineSelectedBreadcrumb();
			WDN.navigation.collapse();
		},
		
		/**
		 * This function should determine which breadcrumb should be selected.
		 */
		determineSelectedBreadcrumb : function() {
			jQuery('#breadcrumbs ul li:nth-child(2)').addClass('selected');
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
				jQuery('#navigation-expand-collapse span').text('click to always show full navigation');
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
		}
	};
}();

