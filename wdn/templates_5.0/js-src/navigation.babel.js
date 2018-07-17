define([], function() {
    "use strict";

    let initialized = false;

    let Plugin = {
        initialize : function() {
            if (initialized) {
                return;
            }

            // grab an element
            let mobileActions = document.querySelectorAll('.hrjs');

            // construct an instance of Headroom, passing the element
            mobileActions.forEach((elem)=>{
                let headroom = new Headroom(elem, {
                    "tolerance" : {
                        up : 5,
                        down : 5
                    }
                });
                headroom.init();
            });
            
            let toggleButtons = document.querySelectorAll('.dcf-nav-toggle-btn');
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
                firstLink.focus();
                modalParent.addEventListener('keyup', onKeyUp);
            }

            function closeModal() {
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
                modalParent.removeEventListener('keyup', onKeyUp);
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
