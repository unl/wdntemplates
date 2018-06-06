define([], function() {
    "use strict";
    
    let initialized = false;

    let Plugin = {
        initialize : function() {
            if (initialized) {
                return;
            }
            
            let toggleMenu = document.getElementById('dcf-menu-toggle');
            let mobileNav = document.getElementById('#dcf-navigation');
            let navBp = window.matchMedia("(max-width: 895px)");
            let modalParent = toggleMenu.closest('.dcf-modal-parent');
            let body = document.querySelector('body');

            function openModal() {
                body.classList.remove('dcf-overflow-auto');
                modalParent.classList.add('dcf-modal-open');
            }
            
            function closeModal() {
                body.classList.add('dcf-overflow-auto');
                modalParent.classList.remove('dcf-modal-open');
            }

            toggleMenu.addEventListener('click', function() {
                if (modalParent.classList.contains('dcf-modal-open') && navBp.matches) {
                    closeModal();
                    mobileNav.setAttribute('hidden', '');
                } else if (modalParent.classList.contains('dcf-modal-open')) {
                    closeModal();
                } else if (navBp.matches) {
                    openModal();
                    mobileNav.removeAttribute('hidden');
                } else {
                    openModal();
                }
            });

            // Add a listen event
            navBp.addListener(watchNav);

            // Function to do something with the media query
            function watchNav(navBp) {
                if (!navBp.matches) {
                    mobileNav.removeAttribute('hidden');
                } else {
                    mobileNav.setAttribute('hidden', '');
                }
            }

            // On load
            watchNav(navBp);
        }
    };

    return Plugin;
});
