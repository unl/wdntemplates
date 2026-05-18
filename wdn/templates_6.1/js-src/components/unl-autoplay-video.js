import DCFAutoplayVideoToggle from '@dcf/js/components/dcf-autoplay-video-toggle.js';

export default class UNLAutoplayVideoToggle extends DCFAutoplayVideoToggle {
    constructor(autoplayVideoContainer, options = {}) {
        if (!('toggleBtnClassList' in options)) {
            options.toggleBtnClassList = [
                'dcf-btn-autoplay-video-toggle',
                'dcf-btn',
                'dcf-btn-primary',
                'dcf-z-1',
                'dcf-absolute',
                'dcf-pin-bottom',
                'dcf-pin-right',
                'dcf-d-flex',
                'dcf-ai-center',
                'dcf-jc-center',
                'dcf-mb-3',
                'dcf-mr-3',
                'dcf-h-7',
                'dcf-w-7',
                'dcf-p-0',
                'dcf-circle',
            ];
        }

        if (!('togglePlayBtnInnerHTML' in options)) {
            options.togglePlayBtnInnerHTML = `<svg class='dcf-h-4 dcf-w-4 dcf-fill-current' width='24' height='24' viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
    <path d='M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498 0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z'></path>
</svg>`;
        }

        if (!('togglePauseBtnInnerHTML' in options)) {
            options.togglePauseBtnInnerHTML = `<svg class='dcf-h-4 dcf-w-4 dcf-fill-current' width='24' height='24' viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
    <path d='M10.5 0h-5C5.224 0 5 .224 5 .5v23C5 23.776 5.224 24 5.5 24h5c.276 0 .5-.224.5-.5v-23C11 .224 10.776 0 10.5 0zM18.5 0h-5C13.224 0 13 .224 13 .5v23c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-23C19 .224 18.776 0 18.5 0z'></path>
</svg>`;
        }

        super(autoplayVideoContainer, options);
    }
}
