'use strict';

/* globals define: false */
define(['wdn', 'ready', 'require', 'dcf-modal', 'mustard/inert-polyfill'], function (WDN, ready, require) {
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
		departmentLookup = 'https://directory.unl.edu/departments/',
		userLookup = 'https://directory.unl.edu/people/',
		planetRed = 'https://planetred.unl.edu/pg/',
		domToggleButtons = document.querySelectorAll('.dcf-idm'),
		closeNavEvent = new CustomEvent('closeNavigation'),
		idmModalID = 'idm-dashboard-modal',
		modal = new DCFModal([]),
		openIDMModalEvent = 'ModalOpenEvent_' + idmModalID,
		closeIDMModalEvent = 'ModalCloseEvent_' + idmModalID,
		user = false,
		sessionUser = false;

	var getUserField = function getUserField(field) {
		if (!user || !user[field]) {
			return false;
		}

		return user[field][0];
	};

	var getUser = function getUser(uid) {
		return new Promise(function (resolve, reject) {
			var xhrUser = false;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', userLookup + uid + '.json');
			xhr.send(null);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState === XMLHttpRequest.DONE) {
			    if (xhr.status === 200) {
			        resolve(JSON.parse(xhr.responseText));
			    }else if (xhr.status === 404) {
			        resolve({});
			    } else {
			        reject(Error(xhr.status));
			    }
			  }
			};
		});
	};

	var appendUserDepartment = function appendUserDepartment(user) {
		return new Promise(function (resolve, reject) {
			var org_unit = user && 'unlHROrgUnitNumber' in user && user['unlHROrgUnitNumber'] && user['unlHROrgUnitNumber'].length > 0 ? user['unlHROrgUnitNumber'][0] : false;

			if (org_unit) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', departmentLookup + org_unit + '?format=json');
				xhr.send(null);

				xhr.onreadystatechange = function() {
				  if (xhr.readyState === XMLHttpRequest.DONE) {
				    if (xhr.status === 200) {
				    	user['department'] = JSON.parse(xhr.responseText);
				        resolve(user);
				    } else {
				    	resolve(user);
				    }
				  }
				};
			} else {
				resolve(user);
			}
		});
	};

	var getUserData = function getUserData(uid, extras, callback) {
		return new Promise(function(resolve, reject) {
		  var user = getUser(uid);
		  resolve(user);
		}).then(function(user) {
			return new Promise(function(resolve, reject) {
				if (extras && extras.department === true) {
					user = appendUserDepartment(user);
				}
				resolve(user);
			}).then(function(user) {
				callback(Plugin.formatUser(user));
			});
		});
	};

	var getSessionUserData = function getSessionUserData(user, extras, callback) {
		return new Promise(function(resolve, reject) {
			if (extras && extras.department === true) {
					user = appendUserDepartment(user);
			}
			resolve(user);
		}).then(function(user) {
			callback(Plugin.formatUser(user));
		});
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
						Plugin.setSessionUser(WDN.idm.user);
						delete WDN.idm.user;
					}

					if (Plugin.isLoggedIn()) {
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

			// add an event listener to close IDM Info
			document.addEventListener('closeIDMInfo', function(e) {
				Plugin.closeIDMInfo();
			});

			// Close idm info on escape
			document.addEventListener('keydown', function(e) {
				if (e.keyCode === 27) {
					// Close on escape
					Plugin.closeIDMInfo();
				}
			});

			// Add an event listener for idm modal open event
			document.addEventListener(openIDMModalEvent, function(e) {
				Plugin.onOpenIDMModalEvent();
			});

			// Add an event listener for idm modal close event
			document.addEventListener(closeIDMModalEvent, function(e) {
				Plugin.onCloseIDMModalEvent();
			});
		},

		closeIDMInfo: function closeIDMInfo() {
			modal.closeModal(idmModalID);
		},

		/**
		 * Set the current user. The object should have fields as described by CAS
		 *
		 * @param newUser object|false
		 */
		setSessionUser: function setSessionUser(newUser) {
			sessionUser = newUser;
			user = newUser;
		},

		/**
		 * Set the current user. The object should have fields as described by CAS
		 *
		 * @param newUser object|false
		 */
		setUser: function setUser(newUser) {
			user = newUser;
		},

		formatUser: function formatUser(userinfo) {
			let data = {};

			// Set user to passed user
			Plugin.setUser(userinfo);

			if (user) {
				data.unlID = Plugin.getUserId();
				data.firstName = Plugin.getFirstName();
				data.lastName = Plugin.getLastName();
				data.fullName = getUserField('displayName');
				data.displayName = Plugin.getDisplayName();
				data.emailAddress = Plugin.getEmailAddress();
				data.postalAddress = Plugin.getPostalAddress();
				data.phoneNumber = Plugin.getTelephoneNumber();
				data.title = Plugin.getTitle();
				data.orgUnitNumber = Plugin.getPrimaryHROrgUnitNumber();
				data.orgUnitName = getUserField('unlHRPrimaryDepartment');
				data.primaryAffiliation = Plugin.getPrimaryAffiliation();
				data.avatar = user.imageURL;
				data.profileUrl = Plugin.getProfileURL();

				if ('department' in userinfo) {
					data.department = userinfo['department'];
				}
			}

			// Unset user
			Plugin.setUser(false);

			return data;
		},

		getSessionUser: function getSessionUser() {
			return sessionUser;
		},

		getSessionUserExtras: function getSessionUserExtras(extras, callback) {
			getSessionUserData(sessionUser, extras, callback);
		},

		getUser: function getUser(uid, extras, callback) {
			getUserData(uid, extras, callback);
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
			return !!sessionUser && sessionUser && sessionUser.uid;
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
		 * Get the logged in user's primary hr org unit number
		 *
		 * @returns {false|string}
		 */
		getPrimaryHROrgUnitNumber: function getPrimaryHROrgUnitNumber() {
			return getUserField('unlHROrgUnitNumber');
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

			// Loop over each domToggleButtons and update the needed elements
			for (let i=0; i<domToggleButtons.length; i++) {
				// Get loggedout/in containers
				let loggedOutContainer = domToggleButtons[i].querySelector('.dcf-idm-status-logged-out');
				let loggedInContainer = domToggleButtons[i].querySelector('.dcf-idm-status-logged-in');

				let button = loggedInContainer.querySelector('.dcf-nav-toggle-btn-idm');
				button.innerHTML = "";
				button.classList.add('dcf-idm-login', 'dcf-d-flex', 'dcf-ai-center', 'dcf-jc-center', 'dcf-relative', 'dcf-h-100%', 'dcf-w-100%', 'dcf-p-0', 'dcf-b-0', 'dcf-bg-transparent', 'unl-scarlet');
				button.setAttribute('aria-haspopup', 'true');
				button.setAttribute('aria-expanded', 'false');
				button.setAttribute('aria-controls', 'dcf-idm-options-'+i);
				button.setAttribute('aria-label', 'Account actions for ' + this.getDisplayName());
				button.removeAttribute('hidden');

				let img = document.createElement('IMG');
				img.classList.add('dcf-idm-img', 'dcf-txt-sm', 'dcf-h-6', 'dcf-w-6', 'dcf-circle', 'unl-bg-cream');
				img.setAttribute('src', avatarService + this.getUserId());
				img.setAttribute('alt', '');
				button.appendChild(img);

				let displayName = document.createElement('SPAN');
				displayName.classList.add('dcf-idm-label', 'dcf-txt-2xs', 'dcf-truncate');
				displayName.innerText = this.getDisplayName();
				button.appendChild(displayName);

				let notificationBadge = document.createElement('SPAN');
				notificationBadge.classList.add('dcf-idm-badge', 'dcf-badge', 'dcf-badge-pill', 'unl-bg-scarlet', 'dcf-txt-2xs', 'dcf-truncate', 'dcf-invisible');
				notificationBadge.innerText = 0;
				button.appendChild(notificationBadge);
				//Show the contents
				loggedOutContainer.hidden = true;
				loggedInContainer.hidden = false;

				// Any time logout link is clicked, unset the user data
				let logoutLink = document.getElementById('idm-logout-link');
				logoutLink.removeEventListener('click', Plugin.logout);
				logoutLink.addEventListener('click', Plugin.logout);

				Plugin.setLogoutURL(localSettings.logout);
				logoutLink.setAttribute('href', logoutURL);
			}

			// Trigger idm is ready
			window.dispatchEvent(new Event('idmStateSet'));
		},

		// Actions to take when idm modal is opened
		onOpenIDMModalEvent: function onOpenIDMModalEvent() {
			console.log('opened idm');
			// Hide other mobile toggles (non modal)
			document.dispatchEvent(closeNavEvent);
		},

		// Actions to take when idm modal is closed
		onCloseIDMModalEvent:  function onCloseIDMModalEvent() {
			console.log('closed idm');
		},

		renderAsLoggedOut: function renderAsLoggedOut() {
			if (Plugin.isLoggedIn()) {
				//if the user is already logged in, we should not reset the login
				return;
			}

			for (let i=0; i<domToggleButtons.length; i++) {
				let loggedOutContainer = domToggleButtons[i].querySelector('.dcf-idm-status-logged-out');
				let loggedInContainer = domToggleButtons[i].querySelector('.dcf-idm-status-logged-in');
				let loginLink = loggedOutContainer.querySelector('a');

				loginLink.setAttribute('href', loginURL);
				loggedInContainer.hidden = true;
				loggedOutContainer.hidden = false;
			}

			// Trigger idm is ready
			window.dispatchEvent(new Event('idmStateSet'));

			// Set href for idm view profile link
			document.getElementById('idm-view-profile-link').setAttribute('href', this.getProfileURL());
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
