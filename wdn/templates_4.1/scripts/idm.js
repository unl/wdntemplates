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
		idmContainerSel = idmSel + 'notice_container',
		userSel = idmSel + 'username',
		profileSel = idmSel + 'profile',
		logoutSel = idmSel + 'logout',
		toggleSel = idmSel + 'toggle_label',
		loginSrv = 'https://shib.unl.edu/',
		ssoCook = 'unl_sso',
		encLoc = encodeURIComponent(window.location),
		logoutURL = loginSrv + 'idp/profile/cas/logout?url=' + encLoc,
		loginURL = loginSrv + 'idp/profile/cas/login?service=' + encLoc,
		serviceURL = 'https://whoami.unl.edu/?id=',
		avatarService = 'https://directory.unl.edu/avatar/',
		planetRed = 'https://planetred.unl.edu/pg/',
		defaultLinkText,
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
			var disp_name = '';
			if (user.eduPersonNickname) {
				disp_name = user.eduPersonNickname[0];
			} else if (user.givenName) {
				disp_name = user.givenName[0];
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
			var loginCheckFailure = function() {
					$(function() {
						var localSettings = getLocalIdmSettings();
						defaultLinkText = $(userSel).html();
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

			// in planet red's use of CAS, staff usernames are converted like jdoe2 -> unl_jdoe2
			//  and student usernames are converted like s-jdoe3 -> unl_s_jdoe3
			var planetred_uid = 'unl_';
			if (uid.substring(2,0) === 's-') {
				planetred_uid += uid.replace('-','_');
			} else {
				planetred_uid += uid;
			}

			idm.addClass('loggedin');

			$(toggleSel).css('backgroundImage', 'url(' + avatarService + uid + ')')
                .html('<span class="wdn-text-hidden">Account actions for </span>'+displayName(uid));
            $(profileSel).attr('href', planetRed + 'profile/' + planetred_uid);

			$(idmContainerSel).removeClass('hidden');

            // Hide login anchor
            $(userSel).hide();

			// Any time logout link is clicked, unset the user data
			var logoutLink = $(logoutSel);
			logoutLink.off('click').click(Plugin.logout);
			Plugin.setLogoutURL(localSettings.logout);
		},

		displayLogin : function() {
			if (Plugin.getUserId()) {
				//if the user is already logged in, we should not reset the login
				return;
			}

			var idm = $(mainSel),
				loginLink = $(userSel);

			idm.removeClass('loggedin');
			loginLink.css('backgroundImage', null)
				.attr('href', loginURL)
				.html(defaultLinkText);

            // Show login anchor
            $(userSel).show();
		},

		/**
		 * Set the URL to send the user to when the logout link is clicked
		 */
		setLogoutURL : function(url) {
			var logoutLink = $(logoutSel);
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
