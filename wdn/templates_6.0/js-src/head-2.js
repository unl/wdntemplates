import UNLTabUrl from '@js-src/plugins/multi/tab.js?finalUrl';
import UNLToggleButtonUrl from '@js-src/plugins/multi/toggle-button.js?finalUrl';
import UNLCollapsibleFieldsetUrl from '@js-src/plugins/multi/collapsible-fieldset.js?finalUrl';
import UNLFigcaptionToggleUrl from '@js-src/plugins/multi/figcaption-toggle.js?finalUrl';
import UNLNoticeUrl from '@js-src/plugins/multi/notice.js?finalUrl';
import UNLDatepickerUrl from '@js-src/plugins/multi/datepicker.js?finalUrl';
import UNLAutoplayVideoUrl from '@js-src/plugins/multi/autoplay-video.js?finalUrl';
import UNLPaginationUrl from '@js-src/plugins/multi/pagination.js?finalUrl';
import UNLSlideshowUrl from '@js-src/plugins/multi/slideshow.js?finalUrl';
import UNLSearchSelectUrl from '@js-src/plugins/multi/search-select.js?finalUrl';
import UNLPopupUrl from '@js-src/plugins/multi/popup.js?finalUrl';
import UNLDialogUrl from '@js-src/plugins/multi/dialog.js?finalUrl';
import UNLGalleryUrl from '@js-src/plugins/multi/gallery.js?finalUrl';
import UNLEventListUrl from '@js-src/plugins/multi/event-list.js?finalUrl';
import UNLImageCropperUrl from '@js-src/plugins/multi/image-cropper.js?finalUrl';
import UNLCardAsLink from '@js-src/plugins/multi/card-as-link.js?finalUrl';
import UNLIdmUrl from '@js-src/plugins/single/idm.js?finalUrl';
import UNLSearchUrl from '@js-src/plugins/single/search.js?finalUrl';
import UNLQaUrl from '@js-src/plugins/single/qa.js?finalUrl';
import UNLFontSerifUrl from '@js-src/plugins/single/font-serif.js?finalUrl';
import UNLFileSizeValidatorUrl from '@js-src/plugins/multi/file-size-validator.js?finalUrl';


window.UNL = window.UNL || {};
window.UNL.autoLoader = {
    config: {
        enabled: true,
        watch: true,
        globalOptInSelector: null, // If the element doesn't have this class ignore it
        globalOptOutSelector: null, // If the element has this class ignore it
        plugins: {
            UNLTab: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLTabUrl,
            },
            UNLToggleButton: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLToggleButtonUrl,
            },
            UNLCollapsibleFieldset: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLCollapsibleFieldsetUrl,
            },
            UNLFigcaptionToggle: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLFigcaptionToggleUrl,
            },
            UNLNotice: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLNoticeUrl,
            },
            UNLDatepicker: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLDatepickerUrl,
            },
            UNLAutoplayVideo: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLAutoplayVideoUrl,
            },
            UNLPagination: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLPaginationUrl,
            },
            UNLCardAsLink: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLCardAsLink,
            },
            UNLSlideshow: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLSlideshowUrl,
            },
            UNLSearchSelect: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLSearchSelectUrl,
            },
            UNLPopup: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLPopupUrl,
            },
            UNLDialog: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLDialogUrl,
            },
            UNLGallery: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLGalleryUrl,
            },
            UNLEventList: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLEventListUrl,
            },
            UNLImageCropper: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLImageCropperUrl,
            },
            UNLIdm: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLIdmUrl,
            },
            UNLSearch: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLSearchUrl,
            },
            UNLFontSerif: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLFontSerifUrl,
            },
            UNLQa: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLQaUrl,
            },
            UNLFileSizeValidator: {
                optOutSelector: null,
                optInSelector: null,
                customConfig: {},
                onPluginLoadedElement: null,
                url: UNLFileSizeValidatorUrl,
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
        callTrackEvent: () => {
            //TODO: This needs to be nicer
            return '';
        },
        loaded: false,
    };
}
if (typeof window.UNL.chat === 'undefined') {
    window.UNL.chat = {
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
        getPrimaryAffiliation: () => {
            return 'None';
        },
        getDisplayName: () => {
            return '';
        },
        getEmailAddress: () => {
            return '';
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

// This config is if we load the navigation AJAX
if (typeof window.UNL.nav === 'undefined') {
    window.UNL.nav = {
        config: {
            watch: false,
        },
    };
}
