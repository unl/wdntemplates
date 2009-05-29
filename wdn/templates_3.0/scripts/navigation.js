
var WDN_Navigation = function() {
	return {
		timeout : false,
		initialize : function() {
			jQuery('#wdn_navigation_wrapper,#breadcrumbs').hover(WDN_Navigation.startExpandDelay,
													WDN_Navigation.startCollapseDelay);
			WDN_Navigation.collapse();
		},
		expand : function() {
			jQuery('#navigation ul:first').css({overflow:'visible'});
			jQuery('#navigation ul:first').animate({height:'200px',overflow:'visible'});
			jQuery('#navigation ul ul').show(300);
		},
		collapse : function() {
			jQuery('#navigation ul:first').css({overflow:'hidden'});
			jQuery('#navigation ul:first').animate({height:'40px',overflow:'hidden'});
			jQuery('#navigation ul ul').hide();
		},
		startExpandDelay : function () {
			clearTimeout(WDN_Navigation.timeout);
			WDN_Navigation.timeout = setTimeout(WDN_Navigation.expand, 50);
		},
		startCollapseDelay : function() {
			clearTimeout(WDN_Navigation.timeout);
			WDN_Navigation.timeout = setTimeout(WDN_Navigation.collapse, 50);
		}
	};
}();

WDN_Navigation.initialize();
