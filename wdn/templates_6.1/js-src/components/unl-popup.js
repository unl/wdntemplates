import DCFPopup from '@dcf/js/components/dcf-popup.js';

export default class UNLPopup extends DCFPopup {
    constructor(popup, options = {}) {
        super(popup, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.popupElement.getAttribute('id')] = this;
        window.UNL.classes[this.popupButton.getAttribute('id')] = this;
        window.UNL.classes[this.popupContent.getAttribute('id')] = this;
        this.popupElement.dispatchEvent(new Event('UNLClassReady'));
        this.popupButton.dispatchEvent(new Event('UNLClassReady'));
        this.popupContent.dispatchEvent(new Event('UNLClassReady'));
    }
}
