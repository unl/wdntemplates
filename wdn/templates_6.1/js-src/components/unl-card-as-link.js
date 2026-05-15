import DCFCardAsLink from '@dcf/js/components/dcf-card-as-link.js';
export default class UNLCardAsLink extends DCFCardAsLink {
    constructor(card, options = {}) {
        super(card, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.card.getAttribute('id')] = this;
        window.UNL.classes[this.link.getAttribute('id')] = this;
        this.card.dispatchEvent(new Event('UNLClassReady'));
        this.link.dispatchEvent(new Event('UNLClassReady'));
    }
}
