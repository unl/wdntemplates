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
            let modalParent = document.querySelector('.dcf-nav-bar.dcf-modal-parent');
            let body = document.querySelector('body');
            let breadcrumbs = document.getElementById('dcf-breadcrumbs');
            let firstLink = mobileNav.querySelector('a');

            // We need to keep track of the toggle button that activated the menu so that we can return focus to it when the menu is closed
            let activeToggleButton = null;

            function onKeyUp(e) {
                if (e.keyCode === 27) {
                    closeModal();
                }
            }

            function openModal() {
                body.classList.remove('dcf-overflow-auto');
                body.classList.add('dcf-overflow-hidden');
                modalParent.classList.add('dcf-modal-open');
                breadcrumbs.classList.remove('dcf-d-none');
                for (var i = 0; i < toggleButtons.length; ++i) {
                    toggleButtons[i].setAttribute('aria-expanded', 'true');
                }
                main.setAttribute('inert', '');
                footer.setAttribute('inert', '');
                firstLink.focus();
                document.addEventListener('keyup', onKeyUp);
            }

            function closeModal() {
                main.removeAttribute('inert');
                footer.removeAttribute('inert');
                body.classList.remove('dcf-overflow-hidden');
                body.classList.add('dcf-overflow-auto');
                modalParent.classList.remove('dcf-modal-open');
                setTimeout(function(){
                  breadcrumbs.classList.add('dcf-d-none');
                }, 400);
                for (var i = 0; i < toggleButtons.length; ++i) {
                    toggleButtons[i].setAttribute('aria-expanded', 'false');
                }
                activeToggleButton.focus();
                document.removeEventListener('keyup', onKeyUp);
            }

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
