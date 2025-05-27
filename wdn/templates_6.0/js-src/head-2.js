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
import wdnEventListUrl from '@js-src/plugins/multi/event-list.js?finalUrl';

import wdnIdmUrl from '@js-src/plugins/single/idm.js?finalUrl';
import wdnSearchUrl from '@js-src/plugins/single/search.js?finalUrl';
import wdnQaUrl from '@js-src/plugins/single/qa.js?finalUrl';
import wdnFontSerifUrl from '@js-src/plugins/single/font-serif.js?finalUrl';

window.UNL = window.UNL || {};
window.UNL.autoLoader = {
    config: {
        enabled: true,
        watch: true,
        globalOptInSelector: null, // If the element doesn't have this class ignore it
        globalOptOutSelector: null, // If the element has this class ignore it
        plugins: {
            wdnTab: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnTabUrl,
            },
            wdnToggleButton: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnToggleButtonUrl,
            },
            wdnCollapsibleFieldset: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnCollapsibleFieldsetUrl,
            },
            wdnFigcaptionToggle: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnFigcaptionToggleUrl,
            },
            wdnNotice: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnNoticeUrl,
            },
            wdnDatepicker: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnDatepickerUrl,
            },
            wdnAutoplayVideo: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnAutoplayVideoUrl,
            },
            wdnPagination: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnPaginationUrl,
            },
            wdnSlideshow: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnSlideshowUrl,
            },
            wdnSearchSelect: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnSearchSelectUrl,
            },
            wdnPopup: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnPopupUrl,
            },
            wdnDialog: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnDialogUrl,
            },
            wdnGallery: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnGalleryUrl,
            },
            wdnEventList: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnEventListUrl,
            },
            wdnIdm: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnIdmUrl,
            },
            wdnSearch: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnSearchUrl,
            },
            wdnFontSerif: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnFontSerifUrl,
            },
            wdnQa: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                url: wdnQaUrl,
            },
        },
    },
    loaded: false,
    // onLoad is redefined by the autoloader once loaded
    onLoad: (callbackFunc) => {
        window.UNL.autoLoader.loadCallbackQueue = window.UNL.autoLoader.loadCallbackQueue || [];
        window.UNL.autoLoader.loadCallbackQueue.push(callbackFunc);
    },
};

// Components loaded in via header-global-1.js
if (typeof window.UNL.banner === 'undefined') {
    window.UNL.banner = {
        config: {
            enabled: true,
        },
        loaded: false,
    };
}
if (typeof window.UNL.alert === 'undefined') {
    window.UNL.alert = {
        config: {
            enabled: true,
        },
        loaded: false,
    };
}
if (typeof window.UNL.analytics === 'undefined') {
    window.UNL.analytics = {
        config: {
            enabled: true,
        },
        loaded: false,
    };
}

if (typeof window.UNL.idm === 'undefined') {
    window.UNL.idm = {
        config: {
            loginRoute: null,
            logoutRoute: null,
            serverUser: null,
        },
        loaded: false,
        // pushConfig is redefined by the IDM component once loaded
        pushConfig: (configProp, configValue) => {
            window.UNL.idm.config[configProp] = configValue;
        },
        onLoad: (callbackFunc) => {
            window.UNL.idm.loadCallbackQueue = window.UNL.idm.loadCallbackQueue || [];
            window.UNL.idm.loadCallbackQueue.push(callbackFunc);
        },
    };
}
