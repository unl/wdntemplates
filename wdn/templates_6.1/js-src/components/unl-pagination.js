import DCFPagination from '@dcf/js/components/dcf-pagination.js';

export default class UNLPagination extends DCFPagination {
    constructor(paginationNav, options = {}) {
        super(paginationNav, options);

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.paginationNav.getAttribute('id')] = this;
        this.paginationNav.dispatchEvent(new Event('UNLClassReady'));
    }
}
