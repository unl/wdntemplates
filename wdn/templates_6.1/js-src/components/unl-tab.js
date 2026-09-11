import DCFTab from '@dcf/js/components/dcf-tab.js';

export default class UNLTab extends DCFTab {
    constructor(tabsGroup, options = {}) {
        super(tabsGroup, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.tabsGroup.getAttribute('id')] = this;
        this.tabsPanelList.forEach((singlePanel) => {
            window.UNL.classes[singlePanel.getAttribute('id')] = this;
            singlePanel.dispatchEvent(new Event('UNLClassReady'));
        });
        const tabs = Array.from(this.tabsList.querySelectorAll('a, button'));
        tabs.forEach((singleTab) => {
            window.UNL.classes[singleTab.getAttribute('id')] = this;
            singleTab.dispatchEvent(new Event('UNLClassReady'));
        });
        this.tabsGroup.dispatchEvent(new Event('UNLClassReady'));
    }
}
