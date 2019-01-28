define(['wdn', 'require', 'plugins/body-scroll-lock', 'mustard/inert-polyfill'], function(WDN, require, bodyScrollLock) {
  const disableBodyScroll = bodyScrollLock.disableBodyScroll;
  const enableBodyScroll = bodyScrollLock.enableBodyScroll;
	let autoSearchDebounceDelay = 1000;
	let searchEmbedVersion = '5.0';

	function getLocalSearch() {
		let link = document.querySelector('link[rel="search"]');
		if (link && link.type !== 'application/opensearchdescription+xml') {
			return link.href;
		}

		return false;
	}

	let initd = false;

	return {
		initialize : function() {
			if (initd) {
				return;
			}
			initd = true;

			let domQ = document.getElementById('dcf-search_query'),
				domSearchForm = document.getElementById('dcf-search-form'),
				domSearchResultWrapper = document.getElementById('dcf-search-results-wrapper'),
				domDialog = document.getElementById('dcf-search-results'),
				domToggleButtons = document.querySelectorAll('.dcf-nav-toggle-btn-search'),
				domToggleIconOpen = document.getElementById('dcf-nav-toggle-icon-open-search'),
				domToggleIconClose = document.getElementById('dcf-nav-toggle-icon-close-search'),
				domToggleLabel = document.querySelector('.dcf-nav-toggle-label-search'),
				domClose = document.getElementById('dcf-close-search'),
        main = document.querySelector('main'),
        footer = document.getElementById('dcf-footer'),
				domActiveToggleButton,
				domEmbed,
				$unlSearch,
				$progress,
				submitted = false,
				postReady = false,
				autoSubmitTimeout,
				searchHost = 'search.unl.edu', // domain of UNL Search app
				searchPath = '/', // path to UNL Search app
				searchOrigin = 'https://' + searchHost,
				searchAction = searchOrigin + searchPath,
				searchFrameAction = searchAction + '?embed=' + searchEmbedVersion,
				allowSearchParams = ['u', 'cx'],  // QS Params allowed by UNL Search app
				siteHomepage = location.protocol + '//' + location.host + '/',
				closeNavEvent = new CustomEvent('closeNavigation'),
				closeIDMOptionsEvent = new CustomEvent('closeDropDownWidget', {detail: {type: 'idm-logged-in'}}),
				localSearch = getLocalSearch();

			// give up if the search form has been unexpectedly removed
			if (!domSearchForm) {
				return;
			}

			var domToggleButtonOnClick = function(e) {

          if (!domDialog.classList.contains('dcf-modal-open')) {

					//Search is currently closed, so open it.
					for (let i = 0; i < domToggleButtons.length; i++) {
						domToggleButtons[i].setAttribute('aria-expanded', 'true');
						domToggleButtons[i].setAttribute('aria-label', 'close search');
					}
					domToggleIconOpen.classList.add('dcf-d-none');
					domToggleIconClose.classList.remove('dcf-d-none');
          domToggleLabel.textContent = 'Close';
          main.setAttribute('inert', '');
          footer.setAttribute('inert', '');
					domDialog.classList.add('dcf-modal-open');
          domDialog.setAttribute('aria-hidden', 'false');
					domActiveToggleButton = this;

          // Prevent body scroll when search is open
          disableBodyScroll(domSearchResultWrapper);

          // Hide other mobile toggles
          document.dispatchEvent(closeNavEvent);
          document.dispatchEvent(closeIDMOptionsEvent);

					setTimeout(function(){
						domQ.focus();
					}, 200);

				} else {
					//Search is currently open, so close it.
					closeSearch();
				}
			};

			for (let i = 0; i < domToggleButtons.length; i++) {
				domToggleButtons[i].addEventListener('click', domToggleButtonOnClick);
			}

			domClose.addEventListener('click', function() {
				closeSearch();
			});

			// ensure the default action is the UNL Search app
			if (domSearchForm.action !== searchAction) {
				domSearchForm.setAttribute('action', searchAction);
			}

			if (localSearch && localSearch.indexOf(searchAction + '?') === 0) {
				// attempt to parse the allowed UNL Search parameter overrides allowed
				let localSearchParams;
				let i;
				try {
					if (window.URLSearchParams) {
						localSearchParams = new URLSearchParams(localSearch.slice(localSearch.indexOf('?') + 1));

						for (i = 0; i < allowSearchParams.length; i++) {
							if (localSearchParams.has(allowSearchParams[i])) {
								let input = document.createElement('input');
								input.type = 'hidden';
								input.name = allowSearchParams[i];
								input.value = localSearchParams.get(allowSearchParams[i]);
								domSearchForm.appendChild(input);
							}
						}
					} else {
						let paramPair;
						localSearchParams = localSearch.slice(localSearch.indexOf('?') + 1).split('&');
						for (i = 0; i < localSearchParams.length; i++) {
							paramPair = localSearchParams[i].split('=');
							if (allowSearchParams.indexOf(paramPair[0]) >= 0) {
								let input = document.createElement('input');
								input.type = 'hidden';
								input.name = paramPair[0];
								input.value = decodeURIComponent(paramPair[1]);
								domSearchForm.appendChild(input);
							}
						}
					}
				} catch (ex){
					WDN.log(ex);
				}
			} else if (siteHomepage && !(/^https?:\/\/www\.unl\.edu\/$/.test(siteHomepage))) {
				// otherwise default to adding a local param for this site's homepage (but not UNL top)
				let input = document.createElement('input');
				input.type = 'hidden';
				input.name = 'u';
				input.value = siteHomepage;
				domSearchForm.appendChild(input);
				searchFrameAction += '&u=' + encodeURIComponent(siteHomepage);
			}

			// create a loading indicator
			$progress = document.createElement('progress');
			$progress.id = 'wdn_search_progress';
			$progress.innerText = 'Loading...';

			// add an input to the form to let the search application know that we want the embedded format
			domEmbed = document.createElement('input');
			domEmbed.type = 'hidden';
			domEmbed.name = 'embed';
			domEmbed.value = searchEmbedVersion; // Specify which theme version for search

			// add a parameter for triggering the iframe compatible rendering
			domSearchForm.appendChild(domEmbed);

			let createSearchFrame = function() {
				// lazy create the search iframe
				if (!$unlSearch) {
					$unlSearch = document.createElement('iframe');
					$unlSearch.name = 'unlsearch';
					$unlSearch.id = 'wdn_search_frame';
					$unlSearch.title = 'Search';
					$unlSearch.className = 'dcf-b-0 dcf-w-100% dcf-h-100%';
					$unlSearch.src = searchFrameAction;

					domSearchResultWrapper.appendChild($progress);
					domSearchResultWrapper.appendChild($unlSearch);

					$unlSearch.addEventListener('load', function() {
						postReady = true; // iframe should be ready to post messages to
					});
				}
			};

			let activateSearch = function() {
				domSearchForm.parentElement.classList.add('active');
				$progress.hidden = false;
			};

			let postSearchMessage = function(query) {
				$unlSearch.contentWindow.postMessage(query, searchOrigin);
				$progress.hidden = true;
			};

			let closeSearch = function(returnFocus = false) {
				if (!domDialog.classList.contains('dcf-modal-open')) {
					//Search is already closed.
					return;
				}

				clearTimeout(autoSubmitTimeout);
				domQ.value = '';
				domSearchForm.parentElement.classList.remove('active');
        main.removeAttribute('inert');
        footer.removeAttribute('inert');
				domDialog.classList.remove('dcf-modal-open');
        domDialog.setAttribute('aria-hidden', 'true');
				for (let i = 0; i < domToggleButtons.length; i++) {
					domToggleButtons[i].setAttribute('aria-expanded', 'false');
						domToggleButtons[i].setAttribute('aria-label', 'open search');
				}
				domToggleIconOpen.classList.remove('dcf-d-none');
				domToggleIconClose.classList.add('dcf-d-none');
        domToggleLabel.textContent = 'Search';
				domSearchForm.reset();

        // Allow body scroll when search is closed
        enableBodyScroll(domSearchResultWrapper);

				// clear results
				if ($unlSearch) {
					$unlSearch = null;
					domSearchResultWrapper.innerHTML = '';
				}

				if (returnFocus) {
					//Send focus back to the toggle
					domActiveToggleButton.focus();
				}
			};

			// add an event listener for closeSearchEvent
			document.addEventListener('closeSearch', function(e) {
				closeSearch();
			});

			// add an event listener to support the iframe rendering
			  domQ.addEventListener('keyup', function(e) {
				let keyCode = e.keyCode;

				if (keyCode === 27) {
					//Close on escape
					closeSearch(true);
					return;
				}

				// ignore non-printable keys (blacklist)
				if ((keyCode !== 32 && keyCode < 48) ||
					(keyCode > 90 && keyCode < 96) ||
					(keyCode > 111 && keyCode < 186 && keyCode !== 173) ||
					(keyCode > 192 && keyCode < 219) ||
					(keyCode > 222)
				) {
					return;
				}

				clearTimeout(autoSubmitTimeout);

				if (this.value) {
					// activate search UI
					createSearchFrame();
					activateSearch();

					// debounce auto-submit
					autoSubmitTimeout = setTimeout(function() {
						let event = new CustomEvent('submit', {'detail': 'auto'});
						domSearchForm.dispatchEvent(event);
					}, autoSearchDebounceDelay);
				}
			});

			domSearchForm.addEventListener('submit', function(e, source) {
				// enable the iframe search params
				createSearchFrame();
				activateSearch();
				domEmbed.disabled = false;
				this.target = 'unlsearch';

				if (!e.detail || e.detail !== 'auto') {
					//a11y: send focus to the results if manually submitted
					$unlSearch.focus();
				}

				// support sending messages to iframe without reload
				if (postReady) {
					e.preventDefault();
					postSearchMessage(domQ.value);
				}
			});

			//Close search on escape while the iframe has focus
			window.addEventListener('message', function(e) {
				if ('wdn.search.close' !== e.data) {
					//Make sure this is our event
					return;
				}

				if (searchOrigin !== e.origin) {
					//Verify the origin
					return;
				}

				closeSearch(true);
			});

			//Close search on escape
			document.addEventListener('keydown', function(e) {
				if (e.keyCode === 27) {
					//Close on escape
					closeSearch(true);
				}
			});

			// listen for clicks on the document and hide the iframe if they didn't come from search interface
			document.addEventListener('click', function(e) {
				if (domDialog.contains(e.target)) {
					return;
				}

				if (domActiveToggleButton && domActiveToggleButton.contains(e.target)) {
					return;
				}

				closeSearch();
			});
		}
	};
});
