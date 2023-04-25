require(['dcf-collapsible-fieldset', 'css!js-css/collapsible-fieldsets'], (DCFFieldsetCollapsibleModule) => {
    // Get all the buttons and create the theme
    const fieldsets = document.querySelectorAll('.dcf-collapsible-fieldset');
    const fieldsetsTheme = new DCFFieldsetCollapsibleModule.DCFFieldsetCollapsibleTheme();

    fieldsetsTheme.setThemeVariable('fieldsetClassListOff', [
        'dcf-bl-transparent',
        'dcf-bb-transparent',
        'dcf-br-transparent',
        'dcf-br-transparent',
        'dcf-pt-0',
        'dcf-pb-0',
        'dcf-sharp',
        'unl-collapsible-fieldset-close'
    ]);

    fieldsetsTheme.setThemeVariable('fieldsetClassListOn', [
        'unl-collapsible-fieldset-open'
    ]);

    fieldsetsTheme.setThemeVariable('fieldsetContentsClassListOn', [
        'dcf-h-max-inf',
        'unl-collapsible-fieldset-contents-open'
    ]);
    fieldsetsTheme.setThemeVariable('fieldsetContentsClassListOff', [
        'dcf-h-max-0',
        'unl-collapsible-fieldset-contents-close'
    ]);
    
    fieldsetsTheme.setThemeVariable('legendButtonInnerHTMLOn', `
        <svg xmlns="http://www.w3.org/2000/svg" class="dcf-h-4 dcf-w-4 dcf-d-block dcf-fill-current" viewBox="0 0 24 24">
            <path d="M23.002,11.021L1,11l0,0c-0.553,0-1,0.447-1,0.999c-0.001,0.552,0.446,1,0.998,1.001H23c0.553,0,1-0.426,1-0.977 C24.001,11.471,23.554,11.023,23.002,11.021z"></path>
            <g>
                <path fill="none" d="M0 0H24V24H0z"></path>
            </g>
        </svg>
    `);

    fieldsetsTheme.setThemeVariable('legendButtonInnerHTMLOff', `
        <svg xmlns="http://www.w3.org/2000/svg" class="dcf-h-4 dcf-w-4 dcf-d-block dcf-fill-current" viewBox="0 0 24 24">
            <path d="M23,11H13V1.001C13,0.448,12.574,0,12.021,0l0,0c-0.553,0-1,0.447-1,0.999L11.012,11H1c-0.553,0-1,0.447-1,1 c0,0.552,0.447,1,1,1h10.01L11,22.999c-0.001,0.552,0.446,1,0.998,1.001h0.001c0.552,0,1-0.447,1.001-0.999V13h10 c0.552,0,1-0.448,1-1C24,11.447,23.552,11,23,11z"></path>
            <g>
                <path fill="none" d="M0 0H24V24H0z"></path>
            </g>
        </svg>
    `);
    
    // Initialize the buttons with the theme
    const fieldsetObj = new DCFFieldsetCollapsibleModule.DCFFieldsetCollapsible(fieldsets, fieldsetsTheme);
    fieldsetObj.initialize();
});
