const dcfNavLocal = document.querySelector('nav.dcf-nav-local');
const dcfNavLocalCopy = document.querySelector('nav.dcf-local-copy-dialog');
dcfNavLocalCopy.innerHTML = dcfNavLocal.innerHTML;
console.log(dcfNavLocalCopy);

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
