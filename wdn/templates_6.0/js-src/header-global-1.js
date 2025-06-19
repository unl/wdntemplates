import UNLBannerUrl from '@js-src/components/UNL-banner.js?finalUrl';
import UNLAnalyticsUrl from '@js-src/components/UNL-analytics.js?finalUrl';
import { loadJS } from './lib/unl-utility?inline';

// Set up these values if they are not defined already
window.UNL = window.UNL || {};
window.UNL.banner = window.UNL.banner || {};
window.UNL.banner.config = window.UNL.banner.config || {};
window.UNL.alert = window.UNL.alert || {};
window.UNL.alert.config = window.UNL.alert.config || {};
window.UNL.analytics = window.UNL.analytics || {};
window.UNL.analytics.config = window.UNL.analytics.config || {};
window.UNL.chat = window.UNL.chat || {};
window.UNL.chat.config = window.UNL.chat.config || {};

// Get the value of window.UNL.banner.config.enabled or default to true
const bannerEnabled = window.UNL.banner.config?.enabled || true;

// Get the value of window.UNL.alert.config.enabled or default to true
const alertEnabled = window.UNL.alert.config?.enabled || true;

// Get the value of window.UNL.analytics.config.enabled or default to true
const analyticsEnabled = window.UNL.analytics.config?.enabled || true;

// Get the value of window.UNL.analytics.config.enabled or default to true
const chatEnabled = window.UNL.chat.config?.enabled || true;

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
if (chatEnabled !== false) {
    loadChat();
}

// These functions need to be async to allow us to use await
async function loadBanner() {
    const UNLBanner = await import(UNLBannerUrl);
    new UNLBanner.default();

    window.UNL.banner.loaded = true;
}
async function loadAlert() {
    console.log('alert load placeholder');

    window.UNL.alert.loaded = true;
}
async function loadAnalytics() {
    const UNLAnalytics = await import(UNLAnalyticsUrl);
    new UNLAnalytics.default();

    window.UNL.analytics.loaded = true;
}
async function loadChat() {
    const unlChatUrl = import.meta.env.VITE_UNL_CHAT_URL || 'https://ucommchat.unl.edu/assets/js';
    const todayParts = new Date().toLocaleDateString().split('/');
    loadJS(`${unlChatUrl}?for=client&version=6.0&cb=${todayParts[2]}${todayParts[0]}${todayParts[1]}`, true);

    window.UNL.chat.loaded = true;
}
