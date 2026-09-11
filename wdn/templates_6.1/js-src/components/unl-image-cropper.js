import DCFImageCropper from '@dcf/js/components/dcf-image-cropper.js';
import UNLCollapsibleFieldset from './unl-collapsible-fieldset.js';

export default class UNLImageCropper extends DCFImageCropper {
    constructor(imageCropper, options = {}) {
        if (!('collapsibleFieldset' in options)) {
            options.collapsibleFieldset = UNLCollapsibleFieldset;
        }
        super(imageCropper, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.cropperElement.getAttribute('id')] = this;
        this.cropperElement.dispatchEvent(new Event('UNLClassReady'));
    }
}
