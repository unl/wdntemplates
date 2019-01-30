'use strict';

/* globals define: false */
define(['wdn', 'ready', 'dropdown-widget', 'require'], function (WDN, ready, DropDownWidget, require) {
	"use strict";

	var getLinkByRel = function getLinkByRel(name) {
		return document.querySelector('link[rel=' + name + ']');
	},
	getLocalIdmSettings = function getLocalIdmSettings() {
		var loginLink = getLinkByRel('login'),
		    logoutLink = getLinkByRel('logout');

		if (loginLink) {
			WDN.setPluginParam('idm', 'login', loginLink.getAttribute('href'));
		}
		if (logoutLink) {
			WDN.setPluginParam('idm', 'logout', logoutLink.getAttribute('href'));
		}

		return WDN.getPluginParam('idm') || {};
	},

	loginSrv = 'https://shib.unl.edu/',
	ssoCook = 'unl_sso',
	encLoc = encodeURIComponent(window.location),
	logoutURL = loginSrv + 'idp/profile/cas/logout?url=' + encLoc,
	loginURL = loginSrv + 'idp/profile/cas/login?service=' + encLoc,
	serviceURL = 'https://whoami.unl.edu/?id=',
	avatarService = 'https://directory.unl.edu/avatar/',
	planetRed = 'https://planetred.unl.edu/pg/',
	user = false;

	var getUserField = function getUserField(field) {
		if (!user || !user[field]) {
			return false;
		}

		return user[field][0];
	};

	var Plugin = {
		initialize: function initialize(callback) {
			var loginCheckFailure = function loginCheckFailure() {
				ready(function () {
					var localSettings = getLocalIdmSettings();
					if (localSettings.login) {
						Plugin.setLoginURL(localSettings.login);
					}

					Plugin.renderAsLoggedOut();
				});

				if (callback) {
					callback();
				}
			},
			    cookie = WDN.getCookie(ssoCook);

			if (cookie) {
				require([serviceURL + cookie], function () {
					// the whoami service injects into WDN.idm namespace
					if (WDN.idm.user) {
						Plugin.setUser(WDN.idm.user);
						delete WDN.idm.user;
					}

					if (Plugin.getUserId()) {
						if (callback) {
							callback();
						}
						ready(function () {
							Plugin.renderAsLoggedIn();
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

		/**
		 * Set the current user. The object should have fields as described by CAS
		 *
		 * @param newUser object|false
		 */
		setUser: function setUser(newUser) {
			user = newUser;
		},

		logout: function logout() {
			WDN.setCookie(ssoCook, '0', -1);
			user = false;
		},

		/**
		 * Checks if the user is logged in
		 *
		 * @return bool
		 */
		isLoggedIn: function isLoggedIn() {
			return !!Plugin.getUserId();
		},

		/**
		 * Returns the uid of the logged in user.
		 *
		 * @return string
		 */
		getUserId: function getUserId() {
			return user && user.uid;
		},

		/**
		 * Get the logged in user's display name (full name)
		 *
		 * @returns {string}
		 */
		getDisplayName: function getDisplayName() {
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

		/**
		 * Get the logged in user's last name only
		 *
		 * @returns {false|string}
		 */
		getFirstName: function getFirstName() {
			return getUserField('givenName');
		},

		/**
		 * Get the logged in user's first name only
		 *
		 * @returns {false|string}
		 */
		getLastName: function getLastName() {
			return getUserField('sn');
		},

		/**
		 * Get the logged in user's primary affiliation.  IE: staff or faculty
		 *
		 * @returns {false|string}
		 */
		getPrimaryAffiliation: function getPrimaryAffiliation() {
			return getUserField('eduPersonPrimaryAffiliation');
		},

		/**
		 * Get the logged in user's email address
		 *
		 * @returns {false|string}
		 */
		getEmailAddress: function getEmailAddress() {
			return getUserField('mail');
		},

		/**
		 * Get the logged in user's postal address
		 *
		 * @returns {false|string}
		 */
		getPostalAddress: function getPostalAddress() {
			return getUserField('postalAddress');
		},

		/**
   * Get the logged in user's telephone number
   *
   * @returns {false|string}
   */
		getTelephoneNumber: function getTelephoneNumber() {
			return getUserField('telephoneNumber');
		},

		/**
		 * Get the logged in user's title
		 *
		 * @returns {false|string}
		 */
		getTitle: function getTitle() {
			return getUserField('title');
		},

		/**
		 * Get the profile (planet red) URL
		 *
		 * @returns {string}
		 */
		getProfileURL: function getProfileURL() {
			if (!this.isLoggedIn()) {
				return false;
			}

			var uid = this.getUserId();

			// in planet red's use of CAS, staff usernames are converted like jdoe2 -> unl_jdoe2
			//  and student usernames are converted like s-jdoe3 -> unl_s_jdoe3
			var planetred_uid = 'unl_';
			if (uid.substring(2, 0) === 's-') {
				planetred_uid += uid.replace('-', '_');
			} else {
				planetred_uid += uid;
			}

			return planetRed + 'profile/' + planetred_uid;
		},

		/**
		 * Update the SSO tab and display user info
		 */
		renderAsLoggedIn: function renderAsLoggedIn() {
			// We need to set up multiples of these so that focus order is correct.
			let widgetContainers = document.querySelectorAll('.dcf-idm');
			let localSettings = getLocalIdmSettings();

			// Loop over each widget and create the needed elements
			// TODO: resolve differences between 'mobile' and 'desktop' layouts
			for (let i=0; i<widgetContainers.length; i++) {
				let button = document.createElement('BUTTON');
				button.classList.add('dcf-idm-login', 'dcf-d-flex', 'dcf-ai-center', 'dcf-jc-center', 'dcf-relative', 'dcf-h-100%', 'dcf-w-100%', 'dcf-p-0', 'dcf-b-0', 'dcf-bg-transparent', 'unl-font-sans', 'unl-scarlet');
				button.setAttribute('id', 'dcf-idm-toggle');
				button.setAttribute('aria-haspopup', 'true');
				button.setAttribute('aria-expanded', 'false');
				button.setAttribute('aria-controls', 'dcf-idm-options-'+i);
				button.setAttribute('aria-label', 'Account actions for ' + this.getDisplayName());

				let img = document.createElement('IMG');
				img.classList.add('dcf-idm-img', 'dcf-txt-sm', 'dcf-h-6', 'dcf-w-6', 'dcf-circle', 'unl-bg-cream');
				img.setAttribute('src', avatarService + this.getUserId());
				img.setAttribute('alt', '');
				button.appendChild(img);

				let displayName = document.createElement('SPAN');
				displayName.classList.add('dcf-idm-label', 'dcf-txt-2xs', 'dcf-truncate');
				displayName.innerText = this.getDisplayName();
				button.appendChild(displayName);

				//Set up the IDM options
				let optionsContainer = document.createElement('DIV');
				optionsContainer.classList.add('dcf-idm-options', 'dcf-absolute', 'dcf-pt-6', 'dcf-pr-5', 'dcf-pb-5', 'dcf-pl-5', 'dcf-z-1', 'dcf-bg-overlay-dark');
				optionsContainer.setAttribute('id', 'dcf-idm-options-'+i);
				optionsContainer.hidden = true;

				let navUL = document.createElement('UL');
				navUL.classList.add('dcf-list-bare', 'dcf-mb-0', 'dcf-txt-2xs', 'unl-font-sans');

				let profileLI = document.createElement('LI');
				let profileLink = document.createElement('A');
				profileLink.classList.add('unl-cream');
				profileLink.setAttribute('href', this.getProfileURL());
				profileLink.innerText = 'View Profile';
				profileLI.appendChild(profileLink);
				navUL.appendChild(profileLI);

				let logoutLI = document.createElement('LI');
				let logoutLink = document.createElement('A');
				logoutLink.classList.add('unl-cream');
				logoutLink.setAttribute('href', logoutURL);
				logoutLink.innerText = 'Logout';
				logoutLI.appendChild(logoutLink);
				navUL.appendChild(logoutLI);

				optionsContainer.appendChild(navUL);

				//clear any existing HTML
				let loggedOutContainer = widgetContainers[i].querySelector('.dcf-idm-status-logged-out');
				let loggedInContainer = widgetContainers[i].querySelector('.dcf-idm-status-logged-in');
				loggedInContainer.innerHTML = '';

				loggedInContainer.appendChild(button);
				loggedInContainer.appendChild(optionsContainer);

				//Initialize the dropdown nav
				let dropdownNav = new DropDownWidget(loggedInContainer, 'idm-logged-in');
				let closeNavEvent = new CustomEvent('closeNavigation');
				let closeSearchEvent = new CustomEvent('closeSearch');
				document.addEventListener('openDropDownWidget', function(e) {
					if (e.detail.type == 'idm-logged-in') {
						document.dispatchEvent(closeNavEvent);
						document.dispatchEvent(closeSearchEvent);
					}
				});

				//Show the contents
				loggedOutContainer.hidden = true;
				loggedInContainer.hidden = false;

				// Any time logout link is clicked, unset the user data
				logoutLink.removeEventListener('click', Plugin.logout);
				logoutLink.addEventListener('click', Plugin.logout);

				Plugin.setLogoutURL(localSettings.logout);
				logoutLink.setAttribute('href', logoutURL);
			}
		},

		renderAsLoggedOut: function renderAsLoggedOut() {
			if (Plugin.getUserId()) {
				//if the user is already logged in, we should not reset the login
				return;
			}

			let widgetContainers = document.querySelectorAll('.dcf-idm');

			for (let i=0; i<widgetContainers.length; i++) {
				let loggedOutContainer = widgetContainers[i].querySelector('.dcf-idm-status-logged-out');
				let loggedInContainer = widgetContainers[i].querySelector('.dcf-idm-status-logged-in');
				let loginLink = loggedOutContainer.querySelector('a');

				loginLink.setAttribute('href', loginURL);
				loggedInContainer.hidden = true;
				loggedOutContainer.hidden = false;
			}
		},

		/**
		 * Set the URL to send the user to when the logout link is clicked
		 */
		setLogoutURL: function setLogoutURL(url) {
			if (url) {
				logoutURL = url;
			}
		},

		/**
		 * Set the URL to send the user to when the login link is clicked
		 */
		setLoginURL: function setLoginURL(url) {
			if (url) {
				loginURL = url;
			}
		}
	};

	WDN.idm = {}; // must expose the WDN.idm namespace for the whoami service
	return Plugin;
});
