
var WDN_Navigation = function() {
	var expandedHeight = 0;
	return {
		timeout : false,
		expandDelay : 125,
		collapseDelay : 60,
		initialize : function() {
			jQuery('#wdn_navigation_bar').hover(WDN_Navigation.startExpandDelay,
												WDN_Navigation.startCollapseDelay);
			//WDN_Navigation.collapse();
		},
		expand : function() {
			jQuery('#navigation ul').animate({height:'198px'},60,0,function(){
					jQuery('#navigation ul').css({height:'auto'});
				});
			jQuery('#navigation ul ul li').show();
			jQuery('#navigation ul ul').show(300);
			
		},
		collapse : function(animate) {
			if (expandedHeight == 0) {
				//expandedHeight = jQuery('#navigation').height();
			}
			
			jQuery('#navigation ul').css({overflow:'hidden'});
			jQuery('#navigation ul').animate({height:'50px'});
			jQuery('#navigation ul ul li:not(:first-child)').hide(10);
		},
		startExpandDelay : function () {
			clearTimeout(WDN_Navigation.timeout);
			WDN_Navigation.timeout = setTimeout(WDN_Navigation.expand, WDN_Navigation.expandDelay);
		},
		startCollapseDelay : function() {
			clearTimeout(WDN_Navigation.timeout);
			WDN_Navigation.timeout = setTimeout(WDN_Navigation.collapse, WDN_Navigation.collapseDelay);
		}
	};
}();

WDN_Navigation.initialize();
