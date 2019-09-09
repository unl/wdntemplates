define(['wdn', 'require', 'plugins/body-scroll-lock'], function(WDN, require, bodyScrollLock) {
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

      // Change search links to button and set button attributes
      let domDesktopSearchLink = document.getElementById('dcf-search-toggle-link'),
        domDesktopSearchBtn = document.createElement('button');
      domDesktopSearchLink.replaceWith(domDesktopSearchBtn);
      domDesktopSearchBtn.classList.add('dcf-nav-toggle-btn', 'dcf-nav-toggle-btn-search', 'dcf-search-toggle', 'dcf-d-flex', 'dcf-ai-center', 'dcf-jc-between', 'dcf-w-100%', 'dcf-p-0', 'dcf-txt-2xs', 'dcf-bg-transparent', 'dcf-b-1', 'dcf-b-solid', 'unl-b-scarlet', 'unl-font-sans', 'unl-scarlet');
      domDesktopSearchBtn.setAttribute('id', 'dcf-search-toggle');
      domDesktopSearchBtn.setAttribute('type', 'button');
      domDesktopSearchBtn.setAttribute('aria-expanded', 'false');
      domDesktopSearchBtn.setAttribute('aria-label', 'Open search');
      domDesktopSearchBtn.innerHTML = '<span class="dcf-search-toggle-label dcf-flex-grow-1 dcf-txt-left">Search</span><span class="dcf-d-flex dcf-ai-center dcf-jc-center dcf-w-8 dcf-pt-3 dcf-pb-3 unl-bg-scarlet unl-cream"><svg class="dcf-h-4 dcf-w-4 dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 48 48"><path d="M18 36a17.9 17.9 0 0 0 11.27-4l15.31 15.41a2 2 0 0 0 2.84-2.82L32.08 29.18A18 18 0 1 0 18 36zm0-32A14 14 0 1 1 4 18 14 14 0 0 1 18 4z"/></svg></span>';

      let domMobileSearchLink = document.getElementById('dcf-mobile-search-link'),
        domMobileSearchBtn = document.createElement('button');
      domMobileSearchLink.replaceWith(domMobileSearchBtn);
      domMobileSearchBtn.classList.add('dcf-nav-toggle-btn', 'dcf-nav-toggle-btn-search', 'dcf-d-flex', 'dcf-flex-col', 'dcf-ai-center', 'dcf-jc-center', 'dcf-flex-grow-1', 'dcf-h-9', 'dcf-p-0', 'dcf-b-0', 'dcf-bg-transparent', 'unl-scarlet');
      domMobileSearchBtn.setAttribute('id', 'dcf-mobile-toggle-search');
      domMobileSearchBtn.setAttribute('type', 'button');
      domMobileSearchBtn.setAttribute('aria-expanded', 'false');
      domMobileSearchBtn.setAttribute('aria-label', 'Open search');
      domMobileSearchBtn.innerHTML = '<svg class="dcf-txt-sm dcf-h-6 dcf-w-6 dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24"><g id="dcf-nav-toggle-icon-open-search" class=""><path d="M22.5 21.8L15 14.3c1.2-1.4 2-3.3 2-5.3 0-4.4-3.6-8-8-8S1 4.6 1 9s3.6 8 8 8c2 0 3.9-.8 5.3-2l7.5 7.5c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zM9 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"></path></g><g id="dcf-nav-toggle-icon-close-search" class="dcf-d-none"><path d="M20.5 4.2L4.2 20.5c-.2.2-.5.2-.7 0-.2-.2-.2-.5 0-.7L19.8 3.5c.2-.2.5-.2.7 0 .2.2.2.5 0 .7z"></path><path d="M3.5 4.2l16.3 16.3c.2.2.5.2.7 0s.2-.5 0-.7L4.2 3.5c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7z"></path></g></svg><span class="dcf-nav-toggle-label-search dcf-mt-1 dcf-txt-2xs">Search</span>';

      let domDialog = document.getElementById('dcf-search-results'),
        domSearchResultWrapper = document.getElementById('dcf-search-results-wrapper'),
        domQ = document.getElementById('dcf-search_query'),
        domSearchForm = document.getElementById('dcf-search-form'),
        domToggleButtons = document.querySelectorAll('.dcf-nav-toggle-btn-search'),
        domToggleIconOpen = document.getElementById('dcf-nav-toggle-icon-open-search'),
        domToggleIconClose = document.getElementById('dcf-nav-toggle-icon-close-search'),
        domToggleLabel = document.querySelector('.dcf-nav-toggle-label-search'),
        domClose = document.getElementById('dcf-close-search'),
        skipNav = document.getElementById('dcf-skip-nav'),
        institutionTitle = document.getElementById('dcf-institution-title'),
        idm = document.getElementById('dcf-idm'),
        logo = document.getElementById('dcf-logo-lockup'),
        nav = document.getElementById('dcf-navigation'),
        main = document.querySelector('main'),
        footer = document.getElementById('dcf-footer'),
        tabFocusEls = domDialog.querySelectorAll('button:not([hidden]):not([disabled]), ' +
          '[href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), ' +
          'select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), ' +
          '[tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), ' +
          '[contenteditable]:not([hidden]), audio[controls]:not([hidden]), ' +
          'video[controls]:not([hidden])'),
        firstTabFocusEl = tabFocusEls[0],
        lastTabFocusEl = tabFocusEls[tabFocusEls.length - 1],
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

      // Give up if the search form has been unexpectedly removed
      if (!domSearchForm) {
        return;
      }

      // Check if search modal has `hidden` attribute
      if (domDialog.hasAttribute('hidden')) {
        // Remove `hidden` attribute
        domDialog.removeAttribute('hidden');
        // Replace with these classes
        domDialog.classList.add('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
      }

      function modalTransition(event) {
        domDialog.removeEventListener('transitionend', modalTransition);
        if (!domDialog.classList.contains('dcf-invisible')) {
          domDialog.classList.add('dcf-invisible');
        }
      }

      var domToggleButtonOnClick = function(e) {

        if (domDialog.classList.contains('dcf-invisible')) {

          // Search is currently closed, so open it.
          for (let i = 0; i < domToggleButtons.length; i++) {
            domToggleButtons[i].setAttribute('aria-expanded', 'true');
            domToggleButtons[i].setAttribute('aria-label', 'Close search');
          }
          domToggleIconOpen.classList.add('dcf-d-none');
          domToggleIconClose.classList.remove('dcf-d-none');
          domToggleLabel.textContent = 'Close';
          skipNav.setAttribute('aria-hidden', 'true');
          institutionTitle.setAttribute('aria-hidden', 'true');
          idm.setAttribute('aria-hidden', 'true');
          logo.setAttribute('aria-hidden', 'true');
          nav.setAttribute('aria-hidden', 'true');
          main.setAttribute('aria-hidden', 'true');
          footer.setAttribute('aria-hidden', 'true');
          domDialog.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
          domDialog.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');
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
          // Search is currently open, so close it.
          closeSearch();
        }
      };

      for (let i = 0; i < domToggleButtons.length; i++) {
        domToggleButtons[i].addEventListener('click', domToggleButtonOnClick);
      }

      domClose.addEventListener('click', function() {
        closeSearch();
      });

      // Ensure the default action is the UNL Search app
      if (domSearchForm.action !== searchAction) {
        domSearchForm.setAttribute('action', searchAction);
      }

      if (localSearch && localSearch.indexOf(searchAction + '?') === 0) {
        // Attempt to parse the allowed UNL Search parameter overrides allowed
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
        // Otherwise default to adding a local param for this site's homepage (but not UNL top)
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'u';
        input.value = siteHomepage;
        domSearchForm.appendChild(input);
        searchFrameAction += '&u=' + encodeURIComponent(siteHomepage);
      }

      // Create a loading indicator
      $progress = document.createElement('progress');
      $progress.id = 'wdn_search_progress';
      $progress.innerText = 'Loading...';

      // Add an input to the form to let the search application know that we want the embedded format
      domEmbed = document.createElement('input');
      domEmbed.type = 'hidden';
      domEmbed.name = 'embed';
      domEmbed.value = searchEmbedVersion; // Specify which theme version for search

      // Add a parameter for triggering the iframe compatible rendering
      domSearchForm.appendChild(domEmbed);

      let createSearchFrame = function() {
        // Lazy create the search iframe
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
        if (domDialog.classList.contains('dcf-invisible')) {
          // Search is already closed.
          return;
        }

        clearTimeout(autoSubmitTimeout);
        domQ.value = '';
        domSearchForm.parentElement.classList.remove('active');
        skipNav.setAttribute('aria-hidden', 'false');
        institutionTitle.setAttribute('aria-hidden', 'false');
        idm.setAttribute('aria-hidden', 'false');
        logo.setAttribute('aria-hidden', 'false');
        nav.setAttribute('aria-hidden', 'false');
        main.setAttribute('aria-hidden', 'false');
        footer.setAttribute('aria-hidden', 'false');
        domDialog.addEventListener('transitionend', modalTransition);
        domDialog.classList.remove('dcf-opacity-100', 'dcf-pointer-events-auto');
        domDialog.classList.add('dcf-opacity-0', 'dcf-pointer-events-none');
        domDialog.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < domToggleButtons.length; i++) {
          domToggleButtons[i].setAttribute('aria-expanded', 'false');
          domToggleButtons[i].setAttribute('aria-label', 'Open search');
        }
        domToggleIconOpen.classList.remove('dcf-d-none');
        domToggleIconClose.classList.add('dcf-d-none');
        domToggleLabel.textContent = 'Search';
        domSearchForm.reset();

        // Allow body scroll when search is closed
        enableBodyScroll(domSearchResultWrapper);

        // Clear results
        if ($unlSearch) {
          $unlSearch = null;
          domSearchResultWrapper.innerHTML = '';
        }

        if (returnFocus) {
          // Send focus back to the toggle
          domActiveToggleButton.focus();
        }
      };

      // Trap focus inside the search modal
      domDialog.addEventListener('keydown', function(e) {

        const keycodeTab = 9;

        let isTabPressed = e.key === 'Tab' || e.keyCode === keycodeTab;

        if (!isTabPressed) {
          return;
        }

        if (e.key === 'Tab' || e.keyCode === keycodeTab) {
          if ( e.shiftKey ) { // Tab backwards (shift + tab)
            if (document.activeElement === firstTabFocusEl) {
              e.preventDefault();
              lastTabFocusEl.focus();
            }
          } else { // Tab forwards
            if (document.activeElement === lastTabFocusEl) {
              e.preventDefault();
              firstTabFocusEl.focus();
            }
          }
        }
      });

      // Add an event listener for closeSearchEvent
      document.addEventListener('closeSearch', function(e) {
        closeSearch();
      });

      // Add an event listener to support the iframe rendering
      domQ.addEventListener('keyup', function(e) {
        let keyCode = e.keyCode;

        if (keyCode === 27) {
          // Close on escape
          closeSearch(true);
          return;
        }

        // Ignore non-printable keys (blacklist)
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
          // Activate search UI
          createSearchFrame();
          activateSearch();

          // Debounce auto-submit
          autoSubmitTimeout = setTimeout(function() {
            let event = new CustomEvent('submit', {'detail': 'auto'});
            domSearchForm.dispatchEvent(event);
          }, autoSearchDebounceDelay);
        }
      });

      domSearchForm.addEventListener('submit', function(e, source) {
        // Enable the iframe search params
        createSearchFrame();
        activateSearch();
        domEmbed.disabled = false;
        this.target = 'unlsearch';

        if (!e.detail || e.detail !== 'auto') {
          // a11y: send focus to the results if manually submitted
          $unlSearch.focus();
        }

        // Support sending messages to iframe without reload
        if (postReady) {
          e.preventDefault();
          postSearchMessage(domQ.value);
        }
      });

      // Close search on escape while the iframe has focus
      window.addEventListener('message', function(e) {
        if ('wdn.search.close' !== e.data) {
          //Make sure this is our event
          return;
        }

        if (searchOrigin !== e.origin) {
          // Verify the origin
          return;
        }

        closeSearch(true);
      });

      // Close search on escape
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) {
          // Close on escape
          closeSearch(true);
        }
      });

      // Listen for clicks on the document and hide the iframe if they didn't come from search interface
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
