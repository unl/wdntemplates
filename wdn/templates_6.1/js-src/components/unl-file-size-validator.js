import DCFFileSizeValidator from '@dcf/js/components/dcf-file-size-validator.js';
export default class UNLFileSizeValidator extends DCFFileSizeValidator {
    constructor(fileInput, options = {}) {

        if (!('errorElementClassList' in options)) {
            options.errorElementClassList = [
                'dcf-rounded',
                'unl-bg-scarlet',
                'unl-cream',
                'dcf-pt-4',
                'dcf-pb-4',
                'dcf-pl-2',
                'dcf-pr-2',
                'dcf-mt-3',
                'dcf-txt-center',
                'dcf-w-fit-content',
            ];
        }

        super(fileInput, options);
    }
}
