window.UNL = window.UNL || {};
window.UNL.nav = window.UNL.nav || {};
window.UNL.nav.config = window.UNL.nav.config || {};
const watchEnabled = window.UNL.nav.config?.watch ?? false;

// These variables are used in the `updateStyles` section
let searchDialogClassInstance = null;
let idmDialogClassInstance = null;
let currentScreenSize = null;
let idmDialog = null;
let searchDialog = null;

if (watchEnabled) {
    // These are the elements that are required for the set up functions
    const checkList = {
        'nav.dcf-nav-local': false,
        'nav.dcf-local-copy-dialog': false,
        'div.dcf-nav': false,
        'dialog.dcf-nav-dialog': false,
        'dialog.dcf-idm-dialog': false,
        'dialog.dcf-search-dialog': false,
    };

    // These are the set up functions
    const initializedParts = {
        'copyNav': false,
        'setUpHoverIntent': false,
        'setUpUpdateStyles': false,
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
            !initializedParts['setUpUpdateStyles']
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
            checkList['dialog.dcf-idm-dialog'] &&
            checkList['dialog.dcf-search-dialog']
        ) {
            setUpUpdateStyles();
            initializedParts['setUpUpdateStyles'] = true;
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
} else {

    // If we are not looking then we will just try running the setup functions
    copyNav();
    setUpHoverIntent();
    setUpUpdateStyles();
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
}


/**
 * Sets up hover intent for desktop nav
 * @returns { Void }
 */
function setUpHoverIntent() {
    const dcfNav = document.querySelector('div.dcf-nav');
    const dcfNavDialog = document.querySelector('dialog.dcf-nav-dialog');
    let dcfNavDialogClassInstance = null;
    const navDialogContent = document.querySelector('dialog.dcf-nav-dialog .dcf-dialog-content');
    let navOpenTimeout = null;
    let navCloseTimeout = null;
    const navHoverOpenTimeoutDurationMs = 100;
    const navHoverCloseTimeoutDurationMs = 100;

    // Get the class instance once it is ready
    dcfNavDialog.addEventListener('dialogReady', (event) => {
        dcfNavDialogClassInstance = event.detail.classInstance;
    });

    // Hover over nav for at least ${navHoverOpenTimeoutDurationMs} will open dialog
    dcfNav.addEventListener('mouseenter', () => {
        navOpenTimeout = setTimeout(() => {
            if (dcfNavDialogClassInstance !== null) {
                dcfNavDialogClassInstance.open();
            }
        }, navHoverOpenTimeoutDurationMs);
    });
    dcfNav.addEventListener('mouseleave', () => {
        clearTimeout(navOpenTimeout);
    });

    // Hover off dialog content for at least ${navHoverCloseTimeoutDurationMs} will close dialog
    navDialogContent.addEventListener('mouseleave', () => {
        navCloseTimeout = setTimeout(() => {
            if (dcfNavDialogClassInstance !== null) {
                dcfNavDialogClassInstance.close();
            }
        }, navHoverCloseTimeoutDurationMs);
    });
    navDialogContent.addEventListener('mouseenter', () => {
        clearTimeout(navCloseTimeout);
    });
}

/**
 * Sets up logic for when we switch from desktop to mobile (or mobile to desktop)
 * we need to update the styles of the idm sand search dialogs
 * @returns { Void }
 */
function setUpUpdateStyles() {
    // Update IDM and Search Dialog Styles for mobile
    idmDialog = document.querySelector('dialog.dcf-idm-dialog');
    searchDialog = document.querySelector('dialog.dcf-search-dialog');

    idmDialog.addEventListener('dialogReady', (event) => {
        idmDialogClassInstance = event.detail.classInstance;
    });
    searchDialog.addEventListener('dialogReady', (event) => {
        searchDialogClassInstance = event.detail.classInstance;
    });

    window.addEventListener('resize', () => {
        updateStyles();
    });
    updateStyles();
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
    searchDialog.classList.add('dcf-dialog-non-modal');
    idmDialog.classList.add('dcf-dialog-non-modal');
}

/**
 * Sets the styles for the desktop version of the page
 * @returns { Void }
 */
function setDesktopStyles() {
    searchDialog.classList.remove('dcf-dialog-non-modal');
    idmDialog.classList.remove('dcf-dialog-non-modal');
}
