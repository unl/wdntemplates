import wdnBannerUrl from '@js-src/components/wdn-banner.js?finalUrl';

// Set up these values if they are not defined already
window.UNL = window.UNL || {};
window.UNL.banner = window.UNL.banner || {};
window.UNL.banner.config = window.UNL.banner.config || {};
window.UNL.alert = window.UNL.alert || {};
window.UNL.alert.config = window.UNL.alert.config || {};

// Get the value of window.UNL.banner.config.enabled or default to true
const bannerEnabled = window.UNL.banner.config?.enabled || true;

// Get the value of window.UNL.alert.config.enabled or default to true
const alertEnabled = window.UNL.alert.config?.enabled || true;


// Load the banner and/or alert if they are enabled
if (bannerEnabled !== false) {
    loadBanner();
}
if (alertEnabled !== false) {
    loadAlert();
}

// These functions need to be async to allow us to use await
async function loadBanner() {
    const WDNBanner = await import(wdnBannerUrl);
    new WDNBanner.default();

    window.UNL.banner.loaded = true;
}
async function loadAlert() {
    console.log('alert load placeholder');

    window.UNL.alert.loaded = true;
}
