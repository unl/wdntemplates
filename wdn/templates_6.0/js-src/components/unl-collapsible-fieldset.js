import DCFCollapsibleFieldset from '@dcf/js/components/dcf-collapsible-fieldset.js';

export default class UNLCollapsibleFieldset extends DCFCollapsibleFieldset {
    constructor(fieldset, options = {}) {
        if (!('legendButtonInnerHTMLOn' in options)) {
            options.legendButtonInnerHTMLOn = `<svg xmlns='http://www.w3.org/2000/svg' class='dcf-h-4 dcf-w-4 dcf-fill-current' viewBox='0 0 24 24'>
    <path d='M21.3,9.4l-18.7,0C1.2,9.4,0,10.6,0,12c0,0.7,0.3,1.4,0.8,1.9c0.5,0.5,1.2,0.8,1.9,0.8h18.7
        c1.4,0,2.6-1.2,2.6-2.6C24,10.6,22.8,9.4,21.3,9.4z'/>
    <g>
        <path fill='none' d='M0,0h24v24H0V0z'/>
    </g>
</svg>`;
        }

        if (!('legendButtonInnerHTMLOff' in options)) {
            options.legendButtonInnerHTMLOff = `<svg xmlns='http://www.w3.org/2000/svg' class='dcf-h-4 dcf-w-4 dcf-fill-current' viewBox='0 0 24 24'>
    <path d='M21.4,9.4h-6.7V2.6C14.6,1.2,13.5,0,12,0c-1.4,0-2.6,1.2-2.6,2.6l0,6.7H2.6C1.2,9.4,0,10.6,0,12
        c0,1.4,1.2,2.6,2.6,2.6h6.8l0,6.7c0,0.7,0.3,1.4,0.8,1.9c0.5,0.5,1.2,0.8,1.9,0.8
        c1.4,0,2.6-1.2,2.6-2.6v-6.7h6.7c1.4,0,2.6-1.2,2.6-2.6C24,10.6,22.8,9.4,21.4,9.4z'/>
    <g>
        <path fill='none' d='M0,0h24v24H0V0z'/>
    </g>
</svg>`;
        }

        if (!('fieldsetClassListOff' in options)) {
            options.fieldsetClassListOff = [
                'dcf-pt-0',
                'dcf-pb-0',
                'unl-collapsible-fieldset-close',
            ];
        }

        if (!('fieldsetClassListOn' in options)) {
            options.fieldsetClassListOn = [
                'unl-collapsible-fieldset-open',
            ];
        }

        if (!('fieldsetContentsClassListOn' in options)) {
            options.fieldsetContentsClassListOn = [
                'dcf-max-h-inf',
                'unl-collapsible-fieldset-contents-open',
            ];
        }

        if (!('fieldsetContentsClassListOff' in options)) {
            options.fieldsetContentsClassListOff = [
                'dcf-max-h-0',
                'dcf-overflow-y-hidden',
                'dcf-overflow-x-hidden',
                'unl-collapsible-fieldset-contents-close',
            ];
        }

        super(fieldset, options);
    }
}
