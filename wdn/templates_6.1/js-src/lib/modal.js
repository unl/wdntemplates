/**
 * @deprecated This file and modal component are deprecated and will be removed in version 6.1
 * Please use dialog instead
 */

import DCFModal from '@dcf/js/components/dcf-modal.js';
import { enableBodyScroll, disableBodyScroll} from '@js-src/lib/body-scroll-lock.js';
import modalCssUrl from '@scss/components-js/_modals.scss?url';
import { loadStyleSheet } from '@js-src/lib/unl-utility.js';

loadStyleSheet(modalCssUrl).then(() => {
    const modals = document.querySelectorAll('.dcf-modal');
    const unlModal = new DCFModal(modals, { enableBodyScroll, disableBodyScroll });
    unlModal.initialize();

    // Define custom open and close events
    modals.forEach((modal) => {
        handleModalVideos(modal);
    });
});

function handleModalVideos(modal) {
    // Handle any videos in modal
    const videos = modal.getElementsByTagName('video');
    if (videos && videos.length > 0) {
        document.addEventListener(`ModalOpenEvent_${modal.id}`, function() {
            // autoplay any videos set to autoplay
            Array.prototype.forEach.call(videos, (video) => {
                if (video.hasAttribute('data-autoplay')) {
                    video.play();
                }
            });
        }, false);

        document.addEventListener(`ModalCloseEvent_${modal.id}`, function() {
            // pause and reset all modal videos
            Array.prototype.forEach.call(videos, (video) => {
                video.pause();
                video.load();
            });

            // Show any hidden overlay play buttons
            const playBtns = modal.getElementsByClassName('mejs-overlay-play');
            if (playBtns && playBtns.length > 0) {
                Array.prototype.forEach.call(playBtns, (playBtn) => {
                    if (playBtn.style.display === 'none') {
                        playBtn.style.display = 'block';
                    }
                });
            }
        }, false);
    }

    // Handle any mediahub iframe embed videos in modal
    const iframes = modal.getElementsByTagName('iframe');
    if (iframes && iframes.length > 0) {
        Array.prototype.forEach.call(iframes, (iframe) => {
            const source = iframe.getAttribute('src');
            const allowAttr = iframe.getAttribute('allow');

            if (allowAttr && allowAttr.includes('autoplay')) {
                if (!source.includes('mediahub.unl.edu')) {
                    // Remove autoplay from non-mediaHub url if defined onload
                    try {
                        const url = new URL(iframe.getAttribute('src'));
                        if (url.searchParams.has('autoplay')) {
                            url.searchParams.delete('autoplay');
                            iframe.src = url.toString();
                        }
                    } catch (error) {
                        // do nothing
                        console.error(error);
                    }
                }

                document.addEventListener(`ModalOpenEvent_${modal.id}`, function() {
                    const currentSource = iframe.getAttribute('src');
                    if (currentSource.includes('mediahub.unl.edu')) {
                        iframe.contentWindow.postMessage('mh-play-video', 'https://mediahub.unl.edu');
                    } else {
                        try {
                            const url = new URL(currentSource);
                            url.searchParams.set('autoplay', '1');
                            const newSource = url.toString();
                            if (currentSource !== newSource) {
                                iframe.src = newSource;
                            }
                        } catch (error) {
                            console.error(error);
                            iframe.src = source;
                        }
                    }
                }, false);

                document.addEventListener(`ModalCloseEvent_${modal.id}`, function() {
                    let currentSource = iframe.getAttribute('src');
                    if (currentSource.includes('mediahub.unl.edu')) {
                        iframe.contentWindow.postMessage('mh-reset-video', 'https://mediahub.unl.edu');
                    } else {
                        try {
                            const url = new URL(currentSource);
                            if (url.searchParams.has('autoplay')) {
                                url.searchParams.delete('autoplay');
                                currentSource = url.toString();
                            }
                            iframe.src = currentSource;
                        } catch (error) {
                            console.error(error);
                            iframe.src = source;
                        }
                    }
                }, false);
            } else {
                // without allow autoplay
                document.addEventListener(`ModalCloseEvent_${modal.id}`, function() {
                    if (source.includes('mediahub.unl.edu')) {
                        iframe.contentWindow.postMessage('mh-pause-video', 'https://mediahub.unl.edu');
                    } else {
                        iframe.src = source;
                    }
                }, false);
            }
        });
    }
}
