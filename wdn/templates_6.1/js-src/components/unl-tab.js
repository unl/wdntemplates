import DCFTab from '@dcf/js/components/dcf-tab.js';

export default class UNLTab extends DCFTab {
    constructor(tabsGroup, options = {}) {
        super(tabsGroup, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.tabsGroup.getAttribute('id')] = this;
        this.tabsGroup.dispatchEvent(new Event('UNLClassReady'));
    }
}
