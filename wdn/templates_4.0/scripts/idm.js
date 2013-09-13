/* globals define: false */
define(['wdn', 'jquery', 'require'], function(WDN, $, require) {
	"use strict";
	var getLinkByRel = function(name) {
			return $('link[rel=' + name + ']');
		},
		getLocalIdmSettings = function() {
			var loginLink = getLinkByRel('login'),
				logoutLink = getLinkByRel('logout');

			if (loginLink.length) {
				WDN.setPluginParam('idm', 'login', loginLink.attr('href'));
			}
			if (logoutLink.length) {
				WDN.setPluginParam('idm', 'logout', logoutLink.attr('href'));
			}

			return WDN.getPluginParam('idm') || {};
		},
		wdnSel = '#wdn_',
		mainSel = wdnSel + 'identity_management',
		idmSel = wdnSel + 'idm_',
		userSel = idmSel + 'username',
		logoutSel = idmSel + 'logout',
		loginSrv = 'https://login.unl.edu/',
		ssoCook = 'unl_sso',
		encLoc = encodeURIComponent(window.location),
		logoutURL = loginSrv + 'cas/logout?url=' + encLoc,
		loginURL = loginSrv + 'cas/login?service=' + encLoc,
		serviceURL = loginSrv + 'services/whoami/?id=',
		planetRed = '//planetred.unl.edu/pg/',
		loggedInTitle = 'Review and update your profile',
		loggedOutTitle = 'Log in to UNL',
		user = false;

	var displayName = function(uid) {
			var disp_name = uid;
			
			if (uid){
				if (user.uid && user.uid === uid) {
					return userDisplayName();
				}
			} else {
				return userDisplayName();
			}
	
			return disp_name;
		},
		
		userDisplayName = function() {
			var disp_name = '', i;
			if (user.cn) {
				for (i in user.cn) {
					if (!disp_name || user.cn[i].length < disp_name.length) {
						disp_name = user.cn[i];
					}
				}
			} else if (user.displayName) {
				disp_name = user.displayName[0];
			}
			
			return disp_name;
		},
		
		getUserField = function(field) {
			if (!user || !user[field]) {
				return false;
			}
			
			return user[field][0];
		};

	var Plugin = {
		initialize : function(callback) {
			var localSettings = getLocalIdmSettings(),
				loginCheckFailure = function() {
					$(function() {
						if (localSettings.login) {
							Plugin.setLoginURL(localSettings.login);
						} else {
							Plugin.displayLogin();
						}
					});

					if (callback) {
						callback();
					}
				},
				cookie = WDN.getCookie(ssoCook);

			if (cookie) {
				require([serviceURL + cookie], function() {
					// the whoami service injects into WDN.idm namespace
					if (WDN.idm.user) {
						user = WDN.idm.user;
						delete WDN.idm.user;
					}

					if (Plugin.getUserId()) {
						if (callback) {
							callback();
						}
						$(function() {
							Plugin.displayNotice(Plugin.getUserId());
						});
					} else {
						// User's CAS session is no longer active, kill cookie
						Plugin.logout();
						loginCheckFailure();
					}
				});
			} else {
				loginCheckFailure();
			}
		},

		logout : function() {
			WDN.setCookie(ssoCook, '0', -1);
			user = false;
		},

		/**
		 * Checks if the user is logged in
		 *
		 * @return bool
		 */
		isLoggedIn : function() {
			return !!Plugin.getUserId();
		},

		/**
		 * Returns the uid of the logged in user.
		 *
		 * @return string
		 */
		getUserId : function() {
			return user && user.uid;
		},

		/**
		 * Get the logged in user's display name (full name)
		 * 
		 * @returns {string}
		 */
		getDisplayName : function() {
			return userDisplayName();
		},

		/**
		 * Get the logged in user's last name only
		 *
		 * @returns {false|string}
		 */
		getFirstName : function() {
			return getUserField('givenName');
		},

		/**
		 * Get the logged in user's first name only
		 *
		 * @returns {false|string}
		 */
		getLastName : function() {
			return getUserField('sn');
		},

		/**
		 * Get the logged in user's primary affiliation.  IE: staff or faculty
		 *
		 * @returns {false|string}
		 */
		getPrimaryAffiliation : function() {
			return getUserField('eduPersonPrimaryAffiliation');
		},

		/**
		 * Get the logged in user's email address
		 *
		 * @returns {false|string}
		 */
		getEmailAddress : function() {
			return getUserField('mail');
		},

		/**
		 * Get the logged in user's postal address
		 *
		 * @returns {false|string}
		 */
		getPostalAddress : function() {
			return getUserField('postalAddress');
		},

		/**
		 * Get the logged in user's telephone number
		 *
		 * @returns {false|string}
		 */
		getTelephoneNumber : function() {
			return getUserField('telephoneNumber');
		},

		/**
		 * Get the logged in user's title
		 *
		 * @returns {false|string}
		 */
		getTitle : function() {
			return getUserField('title');
		},

		/**
		 * Update the SSO tab and display user info
		 *
		 * @param {string} uid
		 */
		displayNotice : function(uid) {
			var localSettings = getLocalIdmSettings(),
				idm = $(mainSel),
				username = $(userSel);

			idm.removeClass('hidden');

			// in planet red's use of CAS, staff usernames are converted like jdoe2 -> unl_jdoe2
			//  and student usernames are converted like s-jdoe3 -> unl_s_jdoe3
			var planetred_uid = 'unl_';
			if (uid.substring(2,0) === 's-') {
				planetred_uid += uid.replace('-','_');
			} else {
				planetred_uid += uid;
			}
			
			idm.addClass('loggedin');
			username.css('backgroundImage', "url(" + planetRed + "icon/" + planetred_uid + "/topbar/)")
				.attr('href', 'http:' + planetRed + 'profile/' + planetred_uid)
				.attr('title', loggedInTitle)
				.text(displayName(uid));

			// Any time logout link is clicked, unset the user data
			var logoutLink = $('a', logoutSel);
			logoutLink.off('click').click(Plugin.logout);
			Plugin.setLogoutURL(localSettings.logout);
		},

		displayLogin : function() {
			var idm = $(mainSel),
				loginLink = $(userSel);

			idm.removeClass('hidden loggedin');
			loginLink.css('backgroundImage', null)
				.attr('href', loginURL)
				.attr('title', loggedOutTitle)
				.text('Login');
		},

		/**
		 * Set the URL to send the user to when the logout link is clicked
		 */
		setLogoutURL : function(url) {
			var logoutLink = $('a', logoutSel);
			if (url) {
				logoutURL = url;
			}
			logoutLink.attr('href', logoutURL);
		},

		/**
		 * Set the URL to send the user to when the login link is clicked
		 */
		setLoginURL : function(url) {
			if (url) {
				loginURL = url;
			}
			Plugin.displayLogin();
		}
	};

	WDN.idm = {}; // must expose the WDN.idm namespace for the whoami service
	return Plugin;
});
