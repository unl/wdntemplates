import { getClassInstance } from '@js-src/lib/unl-utility.js';

window.UNL = window.UNL || {};
window.UNL.nav = window.UNL.nav || {};
window.UNL.nav.config = window.UNL.nav.config || {};
let disableDesktopNav = window.UNL.nav.config?.disableDesktopNav ?? true;
const watchEnabled = window.UNL.nav.config?.watch ?? false;

// These variables are used in the `updateStyles` section
let searchDialogClassInstance = null;
let idmDialogClassInstance = null;
let currentScreenSize = null;
let idmDialog = null;
let searchDialog = null;

if (watchEnabled) {

    // Set up watching for nav changes and loading parts as they are available
    setUpNavWatch();
} else {

    // If we are not looking then we will just try running the setup functions
    copyNav();
    setUpHoverIntent();
    setUpUpdateStyles();
    initCtaPopups();
}

// updateStyles will set currentScreenSize which is used for both the search/idm dialogs closing logic
//  and also the nav menu dialog closing logic
window.addEventListener('resize', () => {
    updateStyles();
});
updateStyles();

/**
 * Watch for ajax nav loading and initialize nav parts as they appear
 */
function setUpNavWatch() {
    // These are the elements that are required for the set up functions
    const checkList = {
        'nav.dcf-nav-local': false,
        'nav.dcf-local-copy-dialog': false,
        'div.dcf-nav': false,
        'dialog.dcf-nav-dialog': false,
        'dialog.unl-idm-dialog': false,
        'dialog.dcf-search-dialog': false,
    };

    // These are the set up functions
    const initializedParts = {
        'copyNav': false,
        'setUpHoverIntent': false,
        'setUpUpdateStyles': false,
        'initCtaPopups': false,
    };

    /**
     * This function will look for the required elements and
     * set them as true if they are there
     * @returns { Void }
     */
    const updateChecklist = () => {
        for (const selector in checkList) {
            if (document.querySelector(selector) !== null) {
                checkList[selector] = true;
            }
        }
    };

    /**
     * This function will run the setup functions if the required elements are there
     * we only run the set up functions once
     * @returns { Void }
     */
    const initIfWeCan = () => {

        // If we have run all the set up functions then we do not need to keep looking for the elements
        if (
            !initializedParts['copyNav'] ||
            !initializedParts['setUpHoverIntent'] ||
            !initializedParts['setUpUpdateStyles'] ||
            !initializedParts['initCtaPopups']
        ) {
            updateChecklist();
        }

        if (
            !initializedParts['copyNav'] &&
            checkList['nav.dcf-nav-local'] &&
            checkList['nav.dcf-local-copy-dialog']
        ) {
            copyNav();
            initializedParts['copyNav'] = true;
        }
        if (
            !initializedParts['setUpHoverIntent'] &&
            checkList['div.dcf-nav'] &&
            checkList['dialog.dcf-nav-dialog']
        ) {
            setUpHoverIntent();
            initializedParts['setUpHoverIntent'] = true;
        }
        if (
            !initializedParts['setUpUpdateStyles'] &&
            checkList['dialog.unl-idm-dialog'] &&
            checkList['dialog.dcf-search-dialog']
        ) {
            setUpUpdateStyles();
            initializedParts['setUpUpdateStyles'] = true;
        }
        if (
            !initializedParts['initCtaPopups']
        ) {
            initCtaPopups();
            initializedParts['initCtaPopups'] = true;
        }
    };
    initIfWeCan();

    // We will watch the dcf-header for changes
    const dcfHeader = document.getElementById('dcf-header');
    const headerObserver = new MutationObserver((mutationList) => {
        for (const mutationRecord of mutationList) {
            // Loop through each node added and make sure it is an element
            for (const nodeAdded of mutationRecord.addedNodes) {
                if (nodeAdded instanceof Element) {
                    initIfWeCan();

                    if (
                        initializedParts['copyNav'] &&
                        initializedParts['setUpHoverIntent'] &&
                        initializedParts['setUpUpdateStyles']
                    ) {
                        headerObserver.disconnect();
                        return;
                    }
                }
            }
        }
    });
    const observerConfig = {
        subtree: true,
        childList: true,
    };
    headerObserver.observe(dcfHeader, observerConfig);
}

/**
 * Copies nav links from local to dialog
 * @returns { Void }
 */
function copyNav() {
    const dcfNavLocal = document.querySelector('nav.dcf-nav-local');
    const dcfNavLocalCopy = document.querySelector('nav.dcf-local-copy-dialog');
    dcfNavLocalCopy.innerHTML = dcfNavLocal.innerHTML;

    // The nav links might change and if they do then we will need to re-copy
    if (watchEnabled) {
        const navLinksObserver = new MutationObserver(() => {
            dcfNavLocalCopy.innerHTML = dcfNavLocal.innerHTML;
        });
        const observerConfig = {
            subtree: true,
            childList: true,
        };
        navLinksObserver.observe(dcfNavLocal, observerConfig);
    }

    const navDialogBackdrop = document.createElement('div');
    navDialogBackdrop.classList.add(
        'dcf-nav-dialog-backdrop',
        'dcf-bg-overlay-light',
        'dcf-d-none@print',
        'dcf-fixed',
        'dcf-top-0',
        'dcf-left-0',
        'dcf-right-0',
        'dcf-bottom-0',
    );

    document.body.prepend(navDialogBackdrop);
}

function initCtaPopups() {
    const visitLinks = document.querySelectorAll('#dcf-visit-options li');
    const applyLinks = document.querySelectorAll('#dcf-apply-options li');
    const giveLinks = document.querySelectorAll('#dcf-give-options li');

    if (visitLinks.length > 1) {
        getClassInstance('unl-visit-popup').then(() => {
            const visitStaticLink = document.getElementById('unl-visit-link');
            const visitPopup = document.getElementById('unl-visit-popup');

            visitStaticLink.classList.add('dcf-d-none!');
            visitPopup.classList.remove('dcf-d-none!');
        });
    }

    if (applyLinks.length > 1) {
        getClassInstance('unl-apply-popup').then(() => {
            const applyStaticLink = document.getElementById('unl-apply-link');
            const applyPopup = document.getElementById('unl-apply-popup');

            applyStaticLink.classList.add('dcf-d-none!');
            applyPopup.classList.remove('dcf-d-none!');
        });
    }

    if (giveLinks.length > 1) {
        getClassInstance('unl-give-popup').then(() => {
            const giveStaticLink = document.getElementById('unl-give-link');
            const givePopup = document.getElementById('unl-give-popup');

            giveStaticLink.classList.add('dcf-d-none!');
            givePopup.classList.remove('dcf-d-none!');
        });
    }
}


/**
 * Sets up hover intent for desktop nav
 * @returns { Void }
 */
function setUpHoverIntent() {
    if (checkForSecondaryNav() === false) {
        disableDesktopNav = true;
    }

    const dcfNav = document.querySelector('div.dcf-nav');
    const dcfNavDialog = document.querySelector('dialog.dcf-nav-dialog');
    const dcfDialogToggleBtn = document.getElementById('dcf-btn-close-desktop-menu');
    let dcfNavDialogClassInstance = null;
    const navDialogContent = document.querySelector('dialog.dcf-nav-dialog .dcf-dialog-content');
    let navOpenTimeout = null;
    let navCloseTimeout = null;
    let isMouseHovering = false;
    let mouseX = 0;
    let mouseY = 0;
    const navHoverOpenTimeoutDurationMs = 100;
    const navHoverCloseTimeoutDurationMs = 100;
    let navJustClosed = false;
    let mouseHoverLeaveFlag = false;
    let mouseHoverEnterFlag = false;

    if (disableDesktopNav) {
        dcfNav.querySelector('#dcf-menu-toggle')?.classList.add('dcf-d-none!');
    }

    // Before we open the dialog we need to check if we are focused on the toggle button
    dcfNavDialog.addEventListener('dialogPreOpen', () => {
        const desktopToggleButton = dcfNav.querySelector('#dcf-menu-toggle');
        if (desktopToggleButton !== null && document.activeElement.isSameNode(desktopToggleButton)) {
            mouseHoverEnterFlag = false;
        }
    });

    // Handles the logic of when the dialog opens
    dcfNavDialog.addEventListener('dialogPostOpen', () => {

        // We will disable the dialog toggle button that is behind the dialog
        dcfNav.querySelector('#dcf-menu-toggle')?.setAttribute('tabindex', '-1');
        dcfNav.querySelector('#dcf-menu-toggle')?.setAttribute('aria-hidden', 'true');

        // We will disable the nav links that are behind the dialog
        dcfNav.querySelectorAll('#dcf-navigation a').forEach((singleNavLink) => {
            singleNavLink.setAttribute('tabindex', '-1');
            singleNavLink.setAttribute('aria-hidden', 'true');
        });

        // If we hovered over the nav to open the dialog then we do not want to focus on anything
        if (mouseHoverEnterFlag === false) {
            dcfNavDialog.querySelector('.dcf-local-copy-dialog a')?.focus();
        }
        mouseHoverEnterFlag = false;
    });

    // Before the dialog closes we need to check to see we just closed due to focusout
    // and we need to check if any elements inside the dialog was focused on via the keyboard
    dcfNavDialog.addEventListener('dialogPreClose', (event) => {
        if ('detail' in event && 'type' in event.detail && event.detail.type === 'focusout') {
            navJustClosed = true;
        }
        if (dcfNavDialog.contains(document.activeElement)) {
            mouseHoverLeaveFlag = false;
        }
    });

    // Handles the logic of when the dialog closes
    dcfNavDialog.addEventListener('dialogPostClose', () => {

        // We will re-enable the dialog toggle button
        dcfNav.querySelector('#dcf-menu-toggle')?.removeAttribute('tabindex');
        dcfNav.querySelector('#dcf-menu-toggle')?.removeAttribute('aria-hidden');

        // We will re-enable the non-dialog nav links
        dcfNav.querySelectorAll('#dcf-navigation a').forEach((singleNavLink) => {
            singleNavLink.removeAttribute('tabindex', '-1');
            singleNavLink.removeAttribute('aria-hidden', 'true');
        });

        // If we used mouse hover to leave the dialog we do not want to focus
        if (mouseHoverLeaveFlag === false) {
            // If we are using the keyboard we will need to move the focus back to the toggle button
            if (currentScreenSize === 'mobile') {
                document.querySelector('button.dcf-btn-nav-mobile').focus();
            } else {
                document.querySelector('button.dcf-btn-nav-desktop').focus();
            }
        }
        mouseHoverLeaveFlag = false;
    });

    // This handles the logic of closing the dialog when you tap above the dialog in mobile
    dcfNavDialog.addEventListener('click', (event) => {
        if (dcfNavDialogClassInstance !== null) {
            if (isScreenUnderMediumSize() && !navDialogContent.contains(event.target)) {
                dcfNavDialogClassInstance.close();
            }
        }
    });

    // Get the class instance once it is ready
    dcfNavDialog.addEventListener('dialogReady', (event) => {
        dcfNavDialogClassInstance = event.detail.classInstance;
    });

    // Hover over nav for at least ${navHoverOpenTimeoutDurationMs} will open dialog
    dcfNav.addEventListener('mouseenter', () => {
        // If we just clicked the close button then ignore this
        if (navJustClosed === true) {
            navJustClosed = false;
            return;
        }
        if (disableDesktopNav && !isScreenUnderMediumSize()) {
            return;
        }
        navOpenTimeout = setTimeout(() => {
            if (dcfNavDialogClassInstance !== null) {
                mouseHoverEnterFlag = true;
                dcfNavDialogClassInstance.open();
            }
        }, navHoverOpenTimeoutDurationMs);
    });
    dcfNav.addEventListener('mouseleave', () => {
        clearTimeout(navOpenTimeout);
        // Reset the flag
        navJustClosed = false;
    });

    // Hover off dialog content for at least ${navHoverCloseTimeoutDurationMs} will close dialog
    navDialogContent.addEventListener('mouseleave', () => {
        // Track if we are hovering on the dialog for the scroll logic
        isMouseHovering = false;

        // If we are now hovering over the mobile nav then do not close the dialog
        const mobileNav = document.getElementById('dcf-nav-toggle-group');
        if (isScreenUnderMediumSize() && mobileNav.matches(':hover')) {
            return;
        }
        navCloseTimeout = setTimeout(() => {
            if (dcfNavDialogClassInstance !== null) {
                mouseHoverLeaveFlag = true;
                dcfNavDialogClassInstance.close();
            }
        }, navHoverCloseTimeoutDurationMs);
    });
    navDialogContent.addEventListener('mouseenter', () => {
        clearTimeout(navCloseTimeout);

        // Track if we are hovering on the dialog for the scroll logic
        isMouseHovering = true;
    });

    // Track where the mouse is on the dialog
    navDialogContent.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // If the user scrolls off the dialog then we need to close it
    window.addEventListener('scroll', () => {
        if (isMouseHovering === false || isScreenUnderMediumSize()) {
            return;
        }

        // Get location of the dialog content
        const rect = navDialogContent.getBoundingClientRect();

        // Check if the last known mouse coordinates are OUTSIDE those bounds
        const isOutside =
            mouseX < rect.left ||
            mouseX > rect.right ||
            mouseY < rect.top ||
            mouseY > rect.bottom;

        // If it is outside then we will close the dialog
        if (isOutside) {
            navCloseTimeout = setTimeout(() => {
                if (dcfNavDialogClassInstance !== null) {
                    mouseHoverLeaveFlag = true;
                    dcfNavDialogClassInstance.close();
                }
            }, navHoverCloseTimeoutDurationMs);
        // If not then we will clear the timeout and prevent the dialog from closing
        } else {
            clearTimeout(navCloseTimeout);
        }
    });

    // If we click the close button we want to ignore any mouse enter events
    // until we trigger a mouse leave event
    dcfDialogToggleBtn.addEventListener('click', () => {
        if (dcfNavDialog.open === true) {
            navJustClosed = true;
        }
    });
}

/**
 * Sets up logic for when we switch from desktop to mobile (or mobile to desktop)
 * we need to update the styles of the idm sand search dialogs
 * @returns { Void }
 */
function setUpUpdateStyles() {
    // Update IDM and Search Dialog Styles for mobile
    idmDialog = document.querySelector('dialog.unl-idm-dialog');
    searchDialog = document.querySelector('dialog.dcf-search-dialog');

    if (idmDialog !== null) {
        idmDialog.addEventListener('dialogReady', (event) => {
            idmDialogClassInstance = event.detail.classInstance;
        });
        // When we open make sure we are focused the first link
        idmDialog.addEventListener('dialogPostOpen', () => {
            idmDialog.querySelector('.unl-idm-personal a')?.focus();
        });
        // When we close focus us back on the toggle dialog button
        idmDialog.addEventListener('dialogPostClose', () => {
            if (currentScreenSize === 'mobile') {
                document.querySelector('button.unl-btn-idm-mobile').focus();
            } else {
                document.querySelector('button.unl-btn-idm-desktop').focus();
            }
        });
    }
    if (searchDialog !== null) {
        searchDialog.addEventListener('dialogReady', (event) => {
            searchDialogClassInstance = event.detail.classInstance;
        });
        // When we open make sure we are focused on the search input
        searchDialog.addEventListener('dialogPostOpen', () => {
            searchDialog.querySelector('#dcf-search_query')?.focus();
        });
        // When we close focus us back on the toggle dialog button
        searchDialog.addEventListener('dialogPostClose', () => {
            if (currentScreenSize === 'mobile') {
                document.querySelector('button.dcf-btn-search-mobile').focus();
            } else {
                document.querySelector('button.dcf-btn-search-desktop').focus();
            }
        });
    }
}

/**
 * Updates the styles of the idmDialog and searchDialog
 * @returns { Void }
 */
function updateStyles() {
    // If we switch screen size from mobile to desktop then
    //    then the dialog will go from modal to non-modal and look broken
    //    so we will need to close the dialogs when we switch over
    if (isScreenUnderMediumSize()) {
        if (currentScreenSize !== 'mobile') {
            currentScreenSize = 'mobile';
            if (idmDialogClassInstance !== null) {
                idmDialogClassInstance.close();
            }
            if (searchDialogClassInstance !== null) {
                searchDialogClassInstance.close();
            }
        }
        setMobileStyles();
    } else {
        if (currentScreenSize !== 'desktop') {
            currentScreenSize = 'desktop';
            if (idmDialogClassInstance !== null) {
                idmDialogClassInstance.close();
            }
            if (searchDialogClassInstance !== null) {
                searchDialogClassInstance.close();
            }
        }
        setDesktopStyles();
    }
}

/**
 * Checks if the screen size if smaller than the medium breakpoint
 * @returns { Boolean } True if screen size is medium or smaller
 */
function isScreenUnderMediumSize() {
    return matchMedia('only screen and (max-width: 56.12em)').matches;
}

/**
 * Sets the styles for the mobile version of the page
 * @returns { Void }
 */
function setMobileStyles() {
    if (searchDialog !== null) {
        searchDialog.classList.add('dcf-dialog-non-modal');
    }
    if (idmDialog !== null) {
        idmDialog.classList.add('dcf-dialog-non-modal');
    }
}

/**
 * Sets the styles for the desktop version of the page
 * @returns { Void }
 */
function setDesktopStyles() {
    if (searchDialog !== null) {
        searchDialog.classList.remove('dcf-dialog-non-modal');
    }
    if (idmDialog !== null) {
        idmDialog.classList.remove('dcf-dialog-non-modal');
    }
}

/**
 * Checks to see if there is any secondary nav links
 * @returns { Boolean } True if there is a secondary nav
 */
function checkForSecondaryNav() {
    const navLocal = document.getElementById('dcf-navigation');
    const navLocalList = navLocal?.querySelector('ul');
    
    return navLocalList?.querySelector('ul') !== null;
}
