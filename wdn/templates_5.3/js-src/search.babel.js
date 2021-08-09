define(['wdn', 'dcf-modal'], function(WDN, modalModule) {
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

      const searchModalId = 'dcf-search-results';
      const modal = new modalModule.DCFModal([]);

      // Get Search links and buttons
      const domDesktopSearchLink = document.getElementById('dcf-search-toggle-link');
      const domDesktopSearchBtns= document.getElementsByClassName('dcf-search-toggle-button');
      const domMobileSearchLink = document.getElementById('dcf-mobile-search-link');
      const domMobileSearchBtns = document.getElementsByClassName('dcf-mobile-search-button');

      // Disable links and Enable buttons
      let mobileSearchBtn = null;
      if (domMobileSearchLink && domMobileSearchBtns && domMobileSearchBtns.length) {
        domMobileSearchLink.setAttribute('hidden', '');
        for (let i = 0; i < domMobileSearchBtns.length; i++) {
          let searchBtn = domMobileSearchBtns[i];
          searchBtn.removeAttribute('hidden');
          searchBtn.setAttribute('aria-expanded', 'false');
          searchBtn.setAttribute('aria-label', 'Open search');
          searchBtn.innerHTML = domMobileSearchLink.innerHTML;
          mobileSearchBtn = searchBtn;
        }
      }

      if (domDesktopSearchLink && domDesktopSearchBtns && domDesktopSearchBtns.length) {
        domDesktopSearchLink.setAttribute('hidden', '');
        domDesktopSearchLink.setAttribute('aria-hidden', true);
        for (let i = 0; i < domDesktopSearchBtns.length; i++) {
          let searchBtn = domDesktopSearchBtns[i];
          searchBtn.removeAttribute('hidden');
          searchBtn.setAttribute('aria-expanded', 'false');
          searchBtn.setAttribute('aria-label', 'Open search');
          searchBtn.innerHTML = domDesktopSearchLink.innerHTML;

          // Toggle mobile nav state on desktop open click
          searchBtn.addEventListener('click', function(e) {
            // Update search toggle nav button to search/open state when search is closed
            if (mobileSearchBtn) {
              modal.setNavToggleBtnState(mobileSearchBtn, 'close');
            }
          }, false);
        }
      }

      let domSearchResultWrapper = document.getElementById('dcf-search-results-wrapper'),
        domQ = document.getElementById('dcf-search_query'),
        domSearchForm = document.getElementById('dcf-search-form'),
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

      let closeSearch = function() {
        modal.closeModal(searchModalId);
      };

      // Actions to take when search modal is opened
      let onOpenSearchModalEvent= function() {

        // Hide other mobile toggles
        document.dispatchEvent(closeNavEvent);
        document.dispatchEvent(closeIDMOptionsEvent);

        // Put focus on search text input
        domQ.focus();
      };

      // Add an event listener for search modal open event
      const openSearchModelEvent = 'ModalOpenEvent_' + searchModalId;
      document.addEventListener(openSearchModelEvent, function(e) {
        onOpenSearchModalEvent();
      });

      // Actions to take when search modal is closed
      let onCloseSearchModalEvent= function() {

        // Update search toggle nav button to search/open state when search is closed
        if (mobileSearchBtn) {
          modal.setNavToggleBtnState(mobileSearchBtn, 'open');
        }

        clearTimeout(autoSubmitTimeout);
        domQ.value = '';
        domSearchForm.parentElement.classList.remove('active');
        domSearchForm.reset();

        // Clear results
        if ($unlSearch) {
          $unlSearch = null;
          domSearchResultWrapper.innerHTML = '';
        }
      };

      // Add an event listener for search modal close event
      const closeSearchModalEvent = 'ModalCloseEvent_' + searchModalId;
      document.addEventListener(closeSearchModalEvent, function(e) {
        onCloseSearchModalEvent();
      });

      // Add an event listener for closeSearchEvent
      document.addEventListener('closeSearch', function(e) {
        closeSearch();
      });

      // Add an event listener for close search from search iframe
      window.addEventListener("message", function(e) {
        if (e.data === 'wdn.search.close') {
          closeSearch();
        }
      }, false);

      // Add an event listener to support the iframe rendering
      domQ.addEventListener('keyup', function(e) {
        let keyCode = e.keyCode;

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
    }
  };
});
