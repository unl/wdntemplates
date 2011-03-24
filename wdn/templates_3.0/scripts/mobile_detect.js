WDN.mobile_detect = function() {
	
	return {
		
		message : 'Welcome, mobile user! This page is available in a mobile-friendly view. Would you like to see it?',
		
		mobilesite : 'http://m.unl.edu/?view=proxy&u=',
		
		initialize : function() {
			WDN.log('starting mobile detect');
			if (!WDN.mobile_detect.wantsMobile()){
				return true;
			}
			if (!WDN.mobile_detect.isMobile()) {
				return true;
			}
			WDN.loadCSS('/wdn/templates_3.0/css/header/mobile_detect.css');
			WDN.mobile_detect.showMessage();
		},
		
		isMobile : function() {
			var agent = navigator.userAgent.toLowerCase();
			if (agent.match(/(iPhone|iPod|blackberry|android|htc|kindle|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|sonyericsson|symbian|treo mini)/i)) {
				if (!agent.match(/(iPad)/i)) {
					return true;
				}
			}
			return false;
		},
		
		wantsMobile : function() {
			c = WDN.getCookie('wdn_mobile');
			if (c=='no'){
				return false;
			}
			return true;
		},
		
		setMobileCookie : function() { //user wants mobile, so set the cookie to yes mobile
			WDN.log('setting mobile cookie');
			WDN.setCookie('wdn_mobile', 'yes', 86400);
		},
		
		removeMobileCookie : function() { //user doesn't want mobile, so set expire the cookie to no mobile
			WDN.log('removing mobile cookie');
			WDN.setCookie('wdn_mobile', 'no', 86400);
			
		},
		
		showMessage : function() {
			WDN.jQuery('#wdn_wrapper').before('<div id="wdn_mobileMessage">'+WDN.mobile_detect.message+' <a id="wdn_mobileYes" href="'+WDN.mobile_detect.mobilesite+encodeURI(window.location.href)+'" title="View mobile version">Yes</a><a id="wdn_mobileNo" href="#">No</a></div>');
			WDN.jQuery('#wdn_mobileYes').click(function(){
				WDN.mobile_detect.setMobileCookie();
			});
			WDN.jQuery('#wdn_mobileNo').click(function(){
				WDN.mobile_detect.removeMobileCookie();
				WDN.mobile_detect.hideMessage();
				return false;
			});
		},
		
		hideMessage : function() {
			WDN.jQuery('#wdn_mobileMessage').hide();
		}
	};
}();