WDN.mobile_detect = function() {
	
	return {
		
		message : 'Welcome, mobile user! This page is available in a mobile-friendly view. Would you like to see it?',
		
		initialize : function() {
			if (WDN.mobile_detect.isMobile()) {
				WDN.loadCSS('/wdn/templates_3.0/css/header/mobile_detect.css');
				WDN.mobile_detect.showMessage();
			} else {
				return false;
			}
		},
		
		isMobile : function() {
			var agent = navigator.userAgent.toLowerCase();
			if (agent.match(/(iPhone|iPod|blackberry|android|htc|kindle|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|sonyericsson|symbian|treo mini)/i)) {
				return true;
			} else {
				return false;
			}
		},
		
		showMessage : function() {
			WDN.jQuery('#wdn_wrapper').before('<div id="wdn_mobileMessage">'+WDN.mobile_detect.message+' <a id="wdn_mobileYes" href="http://m.unl.edu/?view=proxy&u='+encodeURI(window.location.href)+'" title="View mobile version">Yes</a><a id="wdn_mobileNo" href="#">No</a></div>');
		}
	};
}();