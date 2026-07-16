import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

import dialogsCssUrl from '@scss/components-js/_dialogs.scss?url';
import popupsCssUrl from '@scss/components-js/_popups.scss?url';
import idmCssUrl from '@scss/components-js/_idm.scss?url';
import searchCssUrl from '@scss/components-js/_search.scss?url';

import UNLDialog from '@js-src/components/unl-dialog.js';
import UNLPopup from '@js-src/components/unl-popup.js';
import UNLIdm from '@js-src/components/unl-idm.js';
import UNLSearch from '@js-src/components/unl-search.js';
import UNLQa from '@js-src/components/unl-qa.js';

const headerSection = document.getElementById('dcf-header');

// Load dialog components in header
const dialogs = headerSection.querySelectorAll('.dcf-dialog:not(.dcf-dialog-initialized)');
if (dialogs.length > 1) {
    await loadStyleSheet(dialogsCssUrl);
    dialogs.forEach((singleDialog) => {
        new UNLDialog(singleDialog);
    });
}

// Load popup components in header
const popups = headerSection.querySelectorAll('.dcf-popup:not(.dcf-popup-initialized)');
if (popups.length > 1) {
    await loadStyleSheet(popupsCssUrl);
    popups.forEach((singlePopup) => {
        new UNLPopup(singlePopup);
    });
}

// Load idm widgets in header
const idmWidgets = headerSection.querySelectorAll('.unl-idm');
if (idmWidgets.length > 1) {
    await loadStyleSheet(idmCssUrl);
    idmWidgets.forEach((singleIdmWidget) => {
        new UNLIdm(singleIdmWidget);
    });
}

// Load search widgets in header
const searchWidgets = headerSection.querySelectorAll('.dcf-search');
if (searchWidgets.length > 1) {
    await loadStyleSheet(searchCssUrl);
    searchWidgets.forEach((singleSearchWidget) => {
        new UNLSearch(singleSearchWidget);
    });
}

// Load QA link
const qaLink = document.getElementById('qa-test');
if (qaLink !== null) {
    new UNLQa();
}
