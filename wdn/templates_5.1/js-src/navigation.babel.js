define(['plugins/headroom', 'plugins/body-scroll-lock'], function(Headroom, bodyScrollLock) {

  const disableBodyScroll = bodyScrollLock.disableBodyScroll;
  const enableBodyScroll = bodyScrollLock.enableBodyScroll;

  let initialized = false;

  let Plugin = {
    initialize : function() {
      if (initialized) {
        return;
      }

      // grab an element
      let mobileActions = document.querySelectorAll('.hrjs');
      let skipNav = document.getElementById('dcf-skip-nav');
      let institutionTitle = document.getElementById('dcf-institution-title');
      let logo = document.getElementById('dcf-logo-lockup');
      let nav = document.getElementById('dcf-navigation');
      let main = document.querySelector('main');
      let footer = document.getElementById('dcf-footer');

      // construct an instance of Headroom, passing the element
      for (let i = 0; i < mobileActions.length; i++) {
        let headroom = new Headroom(mobileActions[i], {
          'tolerance' : {
            up : 5,
            down : 5
          }
        });
        headroom.init();
      }

      let toggleButtons = document.querySelectorAll('.dcf-nav-toggle-btn-menu');
      let toggleIconOpen = document.getElementById('dcf-nav-toggle-icon-open-menu');
      let toggleIconClose = document.getElementById('dcf-nav-toggle-icon-close-menu');
      let toggleLabel = document.querySelector('.dcf-nav-toggle-label-menu');
      let mobileNav = document.getElementById('dcf-navigation');
      let modalParent = document.querySelector('.dcf-nav-menu');
      let mobileNavMenu = document.getElementById('dcf-nav-menu-child');
      if (!mobileNavMenu) {
        mobileNavMenu = document.createElement('nav');
        mobileNavMenu.setAttribute('id', 'dcf-nav-menu-child');
      }
      let tabFocusEls = mobileNavMenu.querySelectorAll('[href]');
      let firstTabFocusEl = tabFocusEls[0];
      let lastTabFocusEl = tabFocusEls[tabFocusEls.length - 1];
      let closeSearchEvent = new CustomEvent('closeSearch');
      let closeIDMOptionsEvent = new CustomEvent('closeIDMInfo');

      // We need to keep track of the toggle button that activated the menu so that we can return focus to it when the menu is closed
      let activeToggleButton = null;

      function onKeyDown(e) {
        if (e.keyCode === 27) {
          closeNavModal();
        }

        const keycodeTab = 9;

        let isTabPressed = e.key === 'Tab' || e.keyCode === keycodeTab;

        if (!isTabPressed) {
          return;
        }

        // Trap focus inside the nav modal
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
      }

      function openNavModal() {

        // Hide other mobile toggles
        document.dispatchEvent(closeSearchEvent);
        document.dispatchEvent(closeIDMOptionsEvent);

        if (window.matchMedia("(max-width: 56.12em)").matches) {
          skipNav.setAttribute('aria-hidden', 'true');
          institutionTitle.setAttribute('aria-hidden', 'true');
          logo.setAttribute('aria-hidden', 'true');
          nav.setAttribute('aria-hidden', 'false');
          main.setAttribute('aria-hidden', 'true');
          footer.setAttribute('aria-hidden', 'true');
          disableBodyScroll(mobileNavMenu);
        }
        for (var i = 0; i < toggleButtons.length; ++i) {
          toggleButtons[i].setAttribute('aria-expanded', 'true');
          toggleButtons[i].setAttribute('aria-label', 'close menu');
        }
        modalParent.classList.add('dcf-modal-open');
        toggleIconOpen.classList.add('dcf-d-none');
        toggleIconClose.classList.remove('dcf-d-none');
        toggleLabel.textContent = 'Close';

        firstTabFocusEl.focus();
        document.addEventListener('keydown', onKeyDown);
      }

      function closeNavModal() {
        if (window.matchMedia("(max-width: 56.12em)").matches) {
          skipNav.setAttribute('aria-hidden', 'false');
          institutionTitle.setAttribute('aria-hidden', 'false');
          logo.setAttribute('aria-hidden', 'false');
          nav.setAttribute('aria-hidden', 'true');
          main.setAttribute('aria-hidden', 'false');
          footer.setAttribute('aria-hidden', 'false');

          // Allow body scroll when navigation is closed
          enableBodyScroll(mobileNavMenu);
        }
        for (var i = 0; i < toggleButtons.length; ++i) {
          toggleButtons[i].setAttribute('aria-expanded', 'false');
          toggleButtons[i].setAttribute('aria-label', 'open menu');
        }
        modalParent.classList.remove('dcf-modal-open');
        toggleIconOpen.classList.remove('dcf-d-none');
        toggleIconClose.classList.add('dcf-d-none');
        toggleLabel.textContent = 'Menu';
        activeToggleButton.focus();
        document.removeEventListener('keydown', onKeyDown);
      }

      // add an event listener for close Navigation Event
      document.addEventListener('closeNavigation', function(e) {
        if (isNavigationOpen() === true) {
          closeNavModal();
        }
      });

      // add an event listener for resize
      window.addEventListener('resize', function(e) {
        if (isNavigationOpen() === true) {
          closeNavModal();
        }
      });

      let toggleButtonOnClick = function() {
          activeToggleButton = this;
          if (isNavigationOpen() === true) {
            closeNavModal();
          } else {
            openNavModal();
          }
      };

      let isNavigationOpen = function() {
        return modalParent.classList.contains('dcf-modal-open');
      }

      for (let i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener('click', toggleButtonOnClick);
      }

      const primaryNavLi = document.querySelectorAll('.dcf-nav-menu-child>ul>li');
      const allPrimaryNavLi = Array.from(primaryNavLi);
      // Find any child <ul> in local navigation <li>
      const hasChild = allPrimaryNavLi.find((el)=>el.querySelector('ul'));
      const desktopBtn = document.getElementById('dcf-menu-toggle');
      // Show "desktop" menu toggle button if navigation contains children
      hasChild && desktopBtn.removeAttribute('hidden');
      hasChild && desktopBtn.setAttribute('aria-expanded', 'false');
      hasChild && desktopBtn.setAttribute('aria-label', 'open menu');
    }
  };

  return Plugin;
});
