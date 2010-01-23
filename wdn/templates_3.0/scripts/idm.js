WDN.idm = function() {
	return {
		
		/**
		 * The URL to direct the end user to when the logout link is clicked.
		 */
		logoutURL : 'https://login.unl.edu/cas/logout?url='+escape(window.location),
		
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
			if (user !== null) {
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
			if (WDN.jQuery('#wdn_identity_management').length === 0) {
				WDN.jQuery('#header').append('<div id="wdn_identity_management" class="loggedin"></div>');
			}
			
			if (WDN.jQuery('#wdn_search').length > 0) {
				// search box is being displayed, adjust the positioning
				WDN.jQuery('#wdn_identity_management').css({right:'362px'});
			}
			
			var icon = '';
			
			if ("https:" != document.location.protocol) { 
				// in planet red's use of CAS, staff usernames are converted like jdoe2 -> unl_jdoe2
				//  and student usernames are converted like s-jdoe3 -> unl_s_jdoe3
				var planetred_uid;
				if (uid.substring(2,0) == 's-') {
					planetred_uid = 'unl_' + uid.replace('-','_');
				} else {
					planetred_uid = 'unl_' + uid;
				}
				icon = '<a href="http://planetred.unl.edu/pg/profile/'+planetred_uid+'" title="Your Planet Red Profile"><img src="http://planetred.unl.edu/mod/profile/icondirect.php?username='+planetred_uid+'&size=topbar" alt="Your Profile Pic" /></a>';
			}
			
			WDN.jQuery('#wdn_identity_management').html(icon+' <span class="username">'+uid+'</span> <a id="wdn_idm_logout" href="'+WDN.idm.logoutURL+'">Logout</a>');
			
			// Any time a link is clicked, unset the user data
			WDN.jQuery('#wdn_identity_management a').click(WDN.idm.logout);
			
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
			if ("https:" != document.location.protocol) {
				// Don't break authentication
				WDN.get('http://peoplefinder.unl.edu/service.php?format=json&uid='+uid, null, function(data, textStatus){
					if (textStatus == 'success') {
						eval('WDN.idm.user='+data);
						if (callback) {
							callback();
						}
					}
				});
			} else {
				WDN.idm.user={'uid':uid,'cn':uid};
			}
		},
		
		/**
		 * Set the URL to send the user to when the logout link is clicked
		 */
		setLogoutURL : function(url) {
			WDN.jQuery('#wdn_idm_logout').attr('href', url);
			WDN.idm.logoutURL = url;
		}
	};
}();