WDN.idm = function() {
	return {
		
		user : false,
		
		initialize : function() {
			if (WDN.idm.isLoggedIn()) {
				WDN.idm.displayNotice(WDN.idm.getUserID());
			}
		},
		
		isLoggedIn : function() {
			var user = WDN.getCookie('sso');
			if (user != null) {
				return true;
			}
			return false;
		},
		
		getUserID : function() {
			var user = WDN.getCookie('sso');
			return user;
		},
		
		displayNotice : function(uid) {
			if (WDN.jQuery('#wdn_identity_management').length == 0) {
				WDN.jQuery('#header').append('<div id="wdn_identity_management"></div>');
			}
			
			WDN.jQuery('#wdn_identity_management').html('<div class="explanation"><p><span class="username">'+uid+'</span></p></div>');
			WDN.idm.getFriendlyName(uid);
		},
		
		getFriendlyName : function(uid) {
			WDN.get('http://peoplefinder.unl.edu/service.php?format=json&uid='+uid, null, function(data, textStatus){
				if (textStatus == 'success') {
					eval('WDN.idm.user='+data);
					WDN.jQuery('#wdn_identity_management .username').html(WDN.idm.user.cn);
				}
				
			});
		}
	};
}();