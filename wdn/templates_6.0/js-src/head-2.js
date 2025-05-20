import wdnTabUrl from '@js-src/plugins/multi/tab.js?finalUrl';
import wdnToggleButtonUrl from '@js-src/plugins/multi/toggle-button.js?finalUrl';
import wdnCollapsibleFieldsetUrl from '@js-src/plugins/multi/collapsible-fieldset.js?finalUrl';
import wdnFigcaptionToggleUrl from '@js-src/plugins/multi/figcaption-toggle.js?finalUrl';
import wdnNoticeUrl from '@js-src/plugins/multi/notice.js?finalUrl';
import wdnDatepickerUrl from '@js-src/plugins/multi/datepicker.js?finalUrl';
import wdnAutoplayVideoUrl from '@js-src/plugins/multi/autoplay-video.js?finalUrl';
import wdnPaginationUrl from '@js-src/plugins/multi/pagination.js?finalUrl';
import wdnSlideshowUrl from '@js-src/plugins/multi/slideshow.js?finalUrl';
import wdnSearchSelectUrl from '@js-src/plugins/multi/search-select.js?finalUrl';
import wdnPopupUrl from '@js-src/plugins/multi/popup.js?finalUrl';
import wdnDialogUrl from '@js-src/plugins/multi/dialog.js?finalUrl';
import wdnGalleryUrl from '@js-src/plugins/multi/gallery.js?finalUrl';

import wdnIdmUrl from '@js-src/plugins/single/idm.js?finalUrl';
import wdnSearchUrl from '@js-src/plugins/single/search.js?finalUrl';
import wdnQaUrl from '@js-src/plugins/single/qa.js?finalUrl';
import wdnFontSerifUrl from '@js-src/plugins/single/font-serif.js?finalUrl';

window.UNL = window.UNL || {};
window.UNL.autoLoader = {
    config: {
        enabled: true,
        watch: true,
        optInSelector: null, // If the element doesn't have this class ignore it
        optOutSelector: null, // If the element has this class ignore it
        plugins: {
            wdnTab: wdnTabUrl,
            wdnToggleButton: wdnToggleButtonUrl,
            wdnCollapsibleFieldset: wdnCollapsibleFieldsetUrl,
            wdnFigcaptionToggle: wdnFigcaptionToggleUrl,
            wdnNotice: wdnNoticeUrl,
            wdnDatepicker: wdnDatepickerUrl,
            wdnAutoplayVideo: wdnAutoplayVideoUrl,
            wdnPagination: wdnPaginationUrl,
            wdnSlideshow: wdnSlideshowUrl,
            wdnSearchSelect: wdnSearchSelectUrl,
            wdnPopup: wdnPopupUrl,
            wdnDialog: wdnDialogUrl,
            wdnGallery: wdnGalleryUrl,
            wdnIdm: wdnIdmUrl,
            wdnSearch: wdnSearchUrl,
            wdnFontSerif: wdnFontSerifUrl,
            wdnQa: wdnQaUrl,
        },
    },
    loaded: false,
    // onLoad is redefined by the autoloader once loaded
    onLoad: (callbackFunc) => {
        window.UNL.autoLoader.loadCallbackQueue = window.UNL.autoLoader.loadCallbackQueue || [];
        window.UNL.autoLoader.loadCallbackQueue.push(callbackFunc);
    },
};
