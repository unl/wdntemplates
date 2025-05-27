import wdnBannerUrl from '@js-src/components/wdn-banner.js?finalUrl';
import wdnAnalyticsUrl from '@js-src/components/wdn-analytics.js?finalUrl';

// Set up these values if they are not defined already
window.UNL = window.UNL || {};
window.UNL.banner = window.UNL.banner || {};
window.UNL.banner.config = window.UNL.banner.config || {};
window.UNL.alert = window.UNL.alert || {};
window.UNL.alert.config = window.UNL.alert.config || {};
window.UNL.analytics = window.UNL.analytics || {};
window.UNL.analytics.config = window.UNL.analytics.config || {};

// Get the value of window.UNL.banner.config.enabled or default to true
const bannerEnabled = window.UNL.banner.config?.enabled || true;

// Get the value of window.UNL.alert.config.enabled or default to true
const alertEnabled = window.UNL.alert.config?.enabled || true;

// Get the value of window.UNL.analytics.config.enabled or default to true
const analyticsEnabled = window.UNL.analytics.config?.enabled || true;

// Load the banner and/or alert if they are enabled
if (bannerEnabled !== false) {
    loadBanner();
}
if (alertEnabled !== false) {
    loadAlert();
}
if (analyticsEnabled !== false) {
    loadAnalytics();
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
async function loadAnalytics() {
    const WDNAnalytics = await import(wdnAnalyticsUrl);
    new WDNAnalytics.default();

    window.UNL.analytics.loaded = true;
}
