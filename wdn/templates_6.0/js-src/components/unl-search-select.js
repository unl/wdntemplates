import DCFSearchSelect from '@dcf/js/components/dcf-search-select.js';

export default class UNLSearchSelect extends DCFSearchSelect {
    constructor(selectElement, options = {}) {
        if (!('availableItemsListClassList' in options)) {
            options.availableItemsListClassList = [
                'dcf-absolute',
                'dcf-d-none',
                'dcf-mb-0',
                'dcf-pl-0',
                'dcf-w-100%',
                'dcf-z-2',
                'unl-box-shadow',
            ];
        }

        if (!('selectedItemButtonClassList' in options)) {
            options.selectedItemButtonClassList = [
                'dcf-btn',
                'dcf-btn-secondary',
                'dcf-h-100%',
                'dcf-p-3',
                'dcf-z-1',
            ];
        }

        super(selectElement, options);
    }
}
