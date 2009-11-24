WDN.idm = function() {
	return {
		
		/**
		 * If populated, the public directory details for the logged in user
		 * 
		 * @var object
		 */
		user : false,
		
		/**
		 * Initialize the IdM related scripts
		 * 
		 * @return void
		 */
		initialize : function() {
			if (WDN.idm.isLoggedIn()) {
				WDN.idm.displayNotice(WDN.idm.getUserID());
			}
			// Any time a link is clicked, unset the user data
			WDN.jQuery('#wdn_identity_management a').click(WDN.idm.logout);
		},
		
		logout : function() {
			WDN.setCookie('sso', '0', -1);
			WDN.idm.user = false;
		},
			
		
		/**
		 * Checks if the user is logged in
		 * 
		 * @return bool
		 */
		isLoggedIn : function() {
			var user = WDN.getCookie('sso');
			if (user != null) {
				return true;
			}
			return false;
		},
		
		/**
		 * Returns the uid of the logged in user.
		 * 
		 * @return string
		 */
		getUserID : function() {
			var user = WDN.getCookie('sso');
			return user;
		},
		
		/**
		 * Update the SSO tab and display user info
		 * 
		 * @param string uid
		 * 
		 * @return void
		 */
		displayNotice : function(uid) {
			if (WDN.jQuery('#wdn_identity_management').length == 0) {
				WDN.jQuery('#header').append('<div id="wdn_identity_management"></div>');
			}
			
			if (WDN.jQuery('#wdn_search').length > 0) {
				// search box is being displayed, adjust the positioning
				WDN.jQuery('#wdn_identity_management').css({right:'362px'});
			}
			
			WDN.jQuery('#wdn_identity_management').html('<div class="explanation"><p><span class="username">'+uid+'</span> <a href="https://login.unl.edu/cas/logout?url='+escape(window.location)+'">Logout</a></p></div>');
			WDN.idm.getFriendlyName(uid);
		},
		
		/**
		 * Retrieves user info and updates the name.
		 * 
		 * @param string uid
		 */
		getFriendlyName : function(uid) {
			WDN.idm.setUser(uid, function(){WDN.jQuery('#wdn_identity_management .username').html(WDN.idm.user.cn);});
		},
		
		/**
		 * Sets the user details
		 * 
		 * @param string   uid
		 * @param function callback
		 * 
		 * @return void
		 */
		setUser : function(uid, callback) {
			WDN.setCookie('sso', uid, 10800);
			WDN.get('http://peoplefinder.unl.edu/service.php?format=json&uid='+uid, null, function(data, textStatus){
				if (textStatus == 'success') {
					eval('WDN.idm.user='+data);
					if (callback) callback();
				}
			});
		}
	};
}();