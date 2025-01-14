import { DCFUtility } from '@dcf/js/dcf-utility.js';
import { DCFTabs } from "@dcf/js/components/dcf-tabs.js";
import tabs_css_url from '@scss/components/_components.tabs.scss?url';

DCFUtility.loadStyleSheet(tabs_css_url);

export function initialize() {
    const tabs = document.querySelectorAll('.dcf-tabs')
    const unlTabs = new DCFTabs(tabs);
    unlTabs.initialize();
}
