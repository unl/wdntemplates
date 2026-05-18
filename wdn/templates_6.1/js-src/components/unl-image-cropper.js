import DCFImageCropper from '@dcf/js/components/dcf-image-cropper.js';
import UNLCollapsibleFieldset from './unl-collapsible-fieldset.js';

export default class UNLImageCropper extends DCFImageCropper {
    constructor(imageCropper, options = {}) {
        if (!('collapsibleFieldset' in options)) {
            options.collapsibleFieldset = UNLCollapsibleFieldset;
        }
        super(imageCropper, options);
    }
}
