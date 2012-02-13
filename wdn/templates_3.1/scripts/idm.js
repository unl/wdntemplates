WDN.idm = function() {
	return {
		
		/**
		 * The URL to direct the end user to when the logout link is clicked.
		 */
		logoutURL : 'https://login.unl.edu/cas/logout?url='+escape(window.location),
		
		/**
		 * The URL to direct the end user to when the login link is clicked.
		 */
		loginURL : 'https://login.unl.edu/cas/login?service='+escape(window.location),
		
		/**
		 * If populated, the public directory details for the logged in user
		 * 
		 * @var object
		 */
		user : false,
		
		
		/**
		 * The URL from which the LDAP information is available
		 */
		serviceURL : 'https://login.unl.edu/services/whoami/?id=',
		
		/**
		 * Initialize the IdM related scripts
		 * 
		 * @return void
		 */
		initialize : function(callback) {
			if (WDN.idm.isLoggedIn()) {
				WDN.loadJS(WDN.idm.serviceURL + WDN.getCookie('unl_sso'), function() {
					if (WDN.idm.getUserId()) {
						if (WDN.idm.user.eduPersonPrimaryAffiliation[0] != undefined) {
							_gaq.push(['wdn._setCustomVar', 1, 'Primary Affiliation', WDN.idm.user.eduPersonPrimaryAffiliation[0], 1]);
							WDN.log("Tracking primary affiliation: "+WDN.idm.user.eduPersonPrimaryAffiliation[0]);
							if (callback) {
								callback();
							}
						};
						WDN.idm.displayNotice(WDN.idm.getUserId());
					}
				});
			} else {
				if (WDN.jQuery('link[rel=login]').length) {
					WDN.idm.setLoginURL(WDN.jQuery('link[rel=login]').attr('href'));
				} else if (WDN.jQuery('link[rel=logout]').length) {
					WDN.idm.displayLogin();
				}
				if (callback) {
					callback();
				}
			}
		},
		
		logout : function() {
			WDN.setCookie('unl_sso', '0', -1);
			WDN.idm.user = false;
		},
			
		
		/**
		 * Checks if the user is logged in
		 * 
		 * @return bool
		 */
		isLoggedIn : function() {
			var user = WDN.getCookie('unl_sso');
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
		getUserId : function() {
			return WDN.idm.user.uid;
		},
		
		/**
		 * Function to parse the correct display name.
		 *
		 * @return string
		 */
		displayName : function(){
		    var disp_name;
		    if (WDN.idm.user.cn) {
		    	for (var i in WDN.idm.user.cn) {
		    		if (!disp_name || WDN.idm.user.cn[i].length < disp_name.length) {
		    			disp_name = WDN.idm.user.cn[i];
		    		}
		    	}
		    } else {
		    	disp_name = uid;
		    }
		    return disp_name;
		},
		
		/**
		 * Update the SSO tab and display user info
		 * 
		 * @param {string} uid
		 */
		displayNotice : function(uid) {
			if (WDN.jQuery('#wdn_identity_management').hasClass('hidden')) {
				WDN.jQuery('#wdn_identity_management').removeClass('hidden').addClass('loggedin');
			}
			
			var icon = '';
			// in planet red's use of CAS, staff usernames are converted like jdoe2 -> unl_jdoe2
			//  and student usernames are converted like s-jdoe3 -> unl_s_jdoe3
			var planetred_uid;
			if (uid.substring(2,0) == 's-') {
				planetred_uid = 'unl_' + uid.replace('-','_');
			} else {
				planetred_uid = 'unl_' + uid;
			}
			WDN.jQuery('.wdn_idm_user_profile').attr('href', 'http://planetred.unl.edu/pg/profile/'+planetred_uid);
			WDN.jQuery('#wdn_idm_userpic').attr('src', '//planetred.unl.edu/pg/icon/'+planetred_uid+'/topbar/');
			WDN.jQuery('#wdn_idm_username').text(WDN.idm.displayName());
			WDN.jQuery('#wdn_identity_management').addClass('loggedin');
			
			// Any time logout link is clicked, unset the user data
			WDN.jQuery('#wdn_idm_logout a').click(WDN.idm.logout);
			
			if (WDN.jQuery('link[rel=logout]').length) {
				WDN.idm.setLogoutURL(WDN.jQuery('link[rel=logout]').attr('href'));
			}
			WDN.idm.updateCommentForm();
		},
		
		displayLogin : function()
		{
			if (WDN.jQuery('#wdn_identity_management').hasClass('hidden')) {
				WDN.jQuery('#wdn_identity_management').removeClass('hidden');
			}
			WDN.jQuery('#wdn_idm_login a').attr('href', WDN.idm.loginURL);
		},
		
		/**
		 * Add user details to the comment form
		 */
		updateCommentForm : function () {
		    WDN.jQuery('#wdn_comment_name').val(WDN.idm.displayName());
		    if (WDN.idm.user.mail) {
		        WDN.jQuery('#wdn_comment_email').val(WDN.idm.user.mail[0]);
		    }
		},
		
		/**
		 * Set the URL to send the user to when the logout link is clicked
		 */
		setLogoutURL : function(url) {
			WDN.jQuery('#wdn_idm_logout a').attr('href', url);
			WDN.idm.logoutURL = url;
		},
		
		
		/**
		 * Set the URL to send the user to when the login link is clicked
		 */
		setLoginURL : function(url) {
			if (url) {
				WDN.idm.loginURL = url;
			}
			WDN.idm.displayLogin();
		}
	};
}();