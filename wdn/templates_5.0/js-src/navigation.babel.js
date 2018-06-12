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
            
            let toggleMenu = document.getElementById('dcf-menu-toggle');
            let mobileNav = document.getElementById('dcf-navigation');
            let modalParent = toggleMenu.closest('.dcf-modal-parent');
            let body = document.querySelector('body');
            let firstLink = mobileNav.querySelector('a');
            
            function onKeyUp(e) {
                if (e.keyCode === 27) {
                    closeModal();
                }
            }

            function openModal() {
                body.classList.remove('dcf-overflow-auto');
                body.classList.add('dcf-overflow-hidden');
                modalParent.classList.add('dcf-modal-open');
                toggleMenu.setAttribute('aria-expanded', 'true');
                firstLink.focus();
                modalParent.addEventListener('keyup', onKeyUp);
            }
            
            function closeModal() {
                body.classList.remove('dcf-overflow-hidden');
                body.classList.add('dcf-overflow-auto');
                modalParent.classList.remove('dcf-modal-open');
                toggleMenu.setAttribute('aria-expanded', 'false');
                toggleMenu.focus();
                modalParent.removeEventListener('keyup', onKeyUp);
            }

            toggleMenu.addEventListener('click', function() {
                if (modalParent.classList.contains('dcf-modal-open')) {
                    closeModal();
                } else {
                    openModal();
                }
            });
        }
    };

    return Plugin;
});
