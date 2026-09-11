import DCFGallery from '@dcf/js/components/dcf-gallery.js';

export default class UNLGallery extends DCFGallery {
    constructor(galleryImage, options = {}) {
        super(galleryImage, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.image.getAttribute('id')] = this;
        this.image.dispatchEvent(new Event('UNLClassReady'));
    }
}
