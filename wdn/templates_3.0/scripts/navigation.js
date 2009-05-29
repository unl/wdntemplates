
var WDN_Navigation = function() {
	var expandedHeight = 0;
	return {
		timeout : false,
		initialize : function() {
			jQuery('#wdn_navigation_bar').hover(WDN_Navigation.startExpandDelay,
												WDN_Navigation.startCollapseDelay);
			//WDN_Navigation.collapse();
		},
		expand : function() {
			
			jQuery('#navigation').animate({height:'198px'},60,0,function(){
					jQuery('#navigation').css({height:'auto'});
				});
			jQuery('#navigation ul ul li').show();
			jQuery('#navigation ul ul').show(300);
			
		},
		collapse : function(animate) {
			if (expandedHeight == 0) {
				//expandedHeight = jQuery('#navigation').height();
			}
			
			jQuery('#navigation').css({overflow:'hidden'});
			jQuery('#navigation').animate({height:'40px'});
			jQuery('#navigation ul ul li:not(:first-child)').hide(10);
		},
		startExpandDelay : function () {
			clearTimeout(WDN_Navigation.timeout);
			WDN_Navigation.timeout = setTimeout(WDN_Navigation.expand, 60);
		},
		startCollapseDelay : function() {
			clearTimeout(WDN_Navigation.timeout);
			WDN_Navigation.timeout = setTimeout(WDN_Navigation.collapse, 30);
		}
	};
}();

WDN_Navigation.initialize();
