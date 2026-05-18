import DCFDialog from '@dcf/js/components/dcf-dialog.js';

export default class UNLDialog extends DCFDialog {

    videos = [];

    iframes = [];

    constructor(dialog, options = {}) {
        super(dialog, options);

        this.videos = Array.from(this.dialogElement.getElementsByTagName('video'));

        const iframeElements = Array.from(this.dialogElement.getElementsByTagName('iframe'));
        iframeElements.forEach((singleIframe) => {
            const source = singleIframe.getAttribute('src');
            const allowAttr = singleIframe.getAttribute('allow');

            if (allowAttr && allowAttr.includes('autoplay')) {
                if (!source.includes('mediahub.unl.edu')) {
                    // Remove autoplay from non-mediaHub url if defined onload
                    try {
                        const url = new URL(singleIframe.getAttribute('src'));
                        if (url.searchParams.has('autoplay')) {
                            url.searchParams.delete('autoplay');
                            singleIframe.src = url.toString();
                        }
                    } catch (error) {
                        // do nothing
                        console.error(error);
                    }
                }
            }

            this.iframes.push({
                source: source,
                allowAttr: allowAttr,
                iframeElement: singleIframe,
            });
        });
    }

    open(eventData = {}) {
        super.open(eventData);

        if (this.videos.length > 0) {
            // autoplay any videos set to autoplay
            this.videos.forEach((singleVideo) => {
                if (singleVideo.hasAttribute('data-autoplay')) {
                    singleVideo.play();
                }
            });
        }

        if (this.iframes.length > 0) {
            this.iframes.forEach((iframeObj) => {
                if (iframeObj.allowAttr && iframeObj.allowAttr.includes('autoplay')) {
                    const currentSource = iframeObj.iframeElement.getAttribute('src');
                    if (currentSource.includes('mediahub.unl.edu')) {
                        iframeObj.iframeElement.contentWindow.postMessage('mh-play-video', 'https://mediahub.unl.edu');
                    } else {
                        try {
                            const url = new URL(currentSource);
                            url.searchParams.set('autoplay', '1');
                            const newSource = url.toString();
                            if (currentSource !== newSource) {
                                iframeObj.iframeElement.src = newSource;
                            }
                        } catch (error) {
                            console.error(error);
                            iframeObj.iframeElement.src = iframeObj.source;
                        }
                    }
                }
            });
        }
    }

    close(eventData = {}) {
        super.close(eventData);

        if (this.videos.length > 0) {
            // pause and reset all modal videos
            this.videos.forEach((singleVideo) => {
                singleVideo.pause();
                singleVideo.load();
            });

            // Show any hidden overlay play buttons
            const playBtns = Array.from(this.dialogElement.getElementsByClassName('mejs-overlay-play'));
            if (playBtns.length > 0) {
                playBtns.forEach((singlePlayBtn) => {
                    if (singlePlayBtn.style.display === 'none') {
                        singlePlayBtn.style.display = 'block';
                    }
                });
            }
        }

        if (this.iframes.length > 0) {
            this.iframes.forEach((iframeObj) => {
                if (iframeObj.allowAttr && iframeObj.allowAttr.includes('autoplay')) {
                    let currentSource = iframeObj.iframeElement.getAttribute('src');
                    if (currentSource.includes('mediahub.unl.edu')) {
                        iframeObj.iframeElement.contentWindow.postMessage('mh-reset-video', 'https://mediahub.unl.edu');
                    } else {
                        try {
                            const url = new URL(currentSource);
                            if (url.searchParams.has('autoplay')) {
                                url.searchParams.delete('autoplay');
                                currentSource = url.toString();
                            }
                            iframeObj.iframeElement.src = currentSource;
                        } catch (error) {
                            console.error(error);
                            iframeObj.iframeElement.src = iframeObj.source;
                        }
                    }
                } else if (iframeObj.source.includes('mediahub.unl.edu')) {
                    iframeObj.iframeElement.contentWindow.postMessage('mh-pause-video', 'https://mediahub.unl.edu');
                } else {
                    iframeObj.iframeElement.src = iframeObj.source;
                }
            });
        }
    }
}
