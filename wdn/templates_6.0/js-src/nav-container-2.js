// Copy Nav to dialog
const dcfNavLocal = document.querySelector('nav.dcf-nav-local');
const dcfNavLocalCopy = document.querySelector('nav.dcf-local-copy-dialog');
dcfNavLocalCopy.innerHTML = dcfNavLocal.innerHTML;


// Hover intent for desktop nav
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
        dcfNavDialogClassInstance.open();
    }, navHoverOpenTimeoutDurationMs);
});
dcfNav.addEventListener('mouseleave', () => {
    clearTimeout(navOpenTimeout);
});

// Hover off dialog content for at least ${navHoverCloseTimeoutDurationMs} will close dialog
navDialogContent.addEventListener('mouseleave', () => {
    navCloseTimeout = setTimeout(() => {
        dcfNavDialogClassInstance.close();
    }, navHoverCloseTimeoutDurationMs);
});
navDialogContent.addEventListener('mouseenter', () => {
    clearTimeout(navCloseTimeout);
});


// Update IDM and Search Dialog Styles for mobile
let idmDialog = document.querySelector('dialog.dcf-idm-dialog');
let searchDialog = document.querySelector('dialog.dcf-search-dialog');
window.addEventListener('resize', () => {
    updateStyles();
});
updateStyles();

/**
 * Updates the styles of the idmDialog and searchDialog
 * @returns { Void }
 */
function updateStyles() {
    idmDialog = document.querySelector('dialog.dcf-idm-dialog');
    searchDialog = document.querySelector('dialog.dcf-search-dialog');

    if (isScreenUnderMediumSize()) {
        setMobileStyles();
    } else {
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
