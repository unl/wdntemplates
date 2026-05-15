import DCFButtonToggle from '@dcf/js/components/dcf-button-toggle.js';

export default class UNLButtonToggle extends DCFButtonToggle {
    constructor(toggleButtonElement, options={}) {
        super(toggleButtonElement, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.toggleButtonElement.getAttribute('id')] = this;
        this.toggleButtonElement.dispatchEvent(new Event('UNLClassReady'));
    }
}
