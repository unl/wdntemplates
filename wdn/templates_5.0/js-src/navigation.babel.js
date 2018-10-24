define(['plugins/headroom', 'plugins/matches-polyfill', 'plugins/inert-polyfill'], function(Headroom) {
    "use strict";

    // TODO: Remove the matches-polyfill requirement. A better approach will be to load it just for IE.

    let initialized = false;

    let Plugin = {
        initialize : function() {
            if (initialized) {
                return;
            }

            // grab an element
            let mobileActions = document.querySelectorAll('.hrjs');
            let main = document.querySelector('main');
            let footer = document.querySelector('footer');

            // construct an instance of Headroom, passing the element
            for (let i=0; i<mobileActions.length; i++) {
                let headroom = new Headroom(mobileActions[i], {
                    "tolerance" : {
                        up : 5,
                        down : 5
                    }
                });
                headroom.init();
            }

            let toggleButtons = document.querySelectorAll('.dcf-nav-toggle-btn-menu');
            let mobileNav = document.getElementById('dcf-navigation');
            let modalParent = document.querySelector('.dcf-nav-menu.dcf-modal-parent');
            let body = document.querySelector('body');
            let firstLink = mobileNav.querySelector('a');
            let closeSearchEvent = new CustomEvent('closeSearch');
            let closeIDMOptionsEvent = new CustomEvent('closeDropDownWidget', {detail: {type: 'idm-logged-in'}});

            // We need to keep track of the toggle button that activated the menu so that we can return focus to it when the menu is closed
            let activeToggleButton = null;

            function onKeyUp(e) {
                if (e.keyCode === 27) {
                    closeModal();
                }
            }

            function openModal() {
                if (window.matchMedia("(max-width: 56.12em)").matches) {
                  body.classList.add('dcf-overflow-hidden');
                  main.setAttribute('inert', '');
                  footer.setAttribute('inert', '');
                }
                modalParent.classList.add('dcf-modal-open');
                for (var i = 0; i < toggleButtons.length; ++i) {
                    toggleButtons[i].setAttribute('aria-expanded', 'true');
                }

                // Hide other mobile toggles
                document.dispatchEvent(closeSearchEvent);
                document.dispatchEvent(closeIDMOptionsEvent);

                firstLink.focus();
                document.addEventListener('keyup', onKeyUp);
            }

            function closeModal() {
                if (window.matchMedia("(max-width: 56.12em)").matches) {
                  body.classList.remove('dcf-overflow-hidden');
                  main.removeAttribute('inert');
                  footer.removeAttribute('inert');
                }
                modalParent.classList.remove('dcf-modal-open');
                for (var i = 0; i < toggleButtons.length; ++i) {
                    toggleButtons[i].setAttribute('aria-expanded', 'false');
                }
                activeToggleButton.focus();
                document.removeEventListener('keyup', onKeyUp);
            }

            // add an event listener for closeSearchEvent
            document.addEventListener('closeNavigation', function(e) {
              if (modalParent.classList.contains('dcf-modal-open')) {
                closeModal();
              }
            });

            let toggleButtonOnClick = function() {
                activeToggleButton = this;
                if (modalParent.classList.contains('dcf-modal-open')) {
                    closeModal();
                } else {
                    openModal();
                }
            };

            for (let i = 0; i < toggleButtons.length; i++) {
                toggleButtons[i].addEventListener('click', toggleButtonOnClick);
            }
        }
    };

    return Plugin;
});
