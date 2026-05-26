import DCFDatepicker from '@dcf/js/components/dcf-datepicker.js';

export default class UNLDatepicker extends DCFDatepicker {
    constructor(datepicker, options = {}) {
        super(datepicker, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.datepicker.getAttribute('id')] = this;
        this.datepicker.dispatchEvent(new Event('UNLClassReady'));
    }
}
