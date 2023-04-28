require(['dcf-collapsible-fieldset', 'css!js-css/collapsible-fieldsets'], (DCFFieldsetCollapsibleModule) => {
    // Get all the buttons and create the theme
    const fieldsets = document.querySelectorAll('.dcf-collapsible-fieldset');
    const fieldsetsTheme = new DCFFieldsetCollapsibleModule.DCFFieldsetCollapsibleTheme();

    // Set up the theme to match WDN styles and add classes for animations
    fieldsetsTheme.setThemeVariable('legendButtonInnerHTMLOn',
    `<svg xmlns="http://www.w3.org/2000/svg" class="dcf-h-4 dcf-w-4 dcf-d-block dcf-fill-current" viewBox="0 0 24 24">
        <path d="M21.3,9.4l-18.7,0C1.2,9.4,0,10.6,0,12c0,0.7,0.3,1.4,0.8,1.9c0.5,0.5,1.2,0.8,1.9,0.8h18.7
            c1.4,0,2.6-1.2,2.6-2.6C24,10.6,22.8,9.4,21.3,9.4z"/>
        <g>
            <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
    </svg>`);

    fieldsetsTheme.setThemeVariable('legendButtonInnerHTMLOff', 
    `<svg xmlns="http://www.w3.org/2000/svg" class="dcf-h-4 dcf-w-4 dcf-d-block dcf-fill-current" viewBox="0 0 24 24">
        <path d="M21.4,9.4h-6.7V2.6C14.6,1.2,13.5,0,12,0c-1.4,0-2.6,1.2-2.6,2.6l0,6.7H2.6C1.2,9.4,0,10.6,0,12
            c0,1.4,1.2,2.6,2.6,2.6h6.8l0,6.7c0,0.7,0.3,1.4,0.8,1.9c0.5,0.5,1.2,0.8,1.9,0.8
            c1.4,0,2.6-1.2,2.6-2.6v-6.7h6.7c1.4,0,2.6-1.2,2.6-2.6C24,10.6,22.8,9.4,21.4,9.4z"/>
        <g>
            <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
    </svg>`);

    // This lets us have the close state be a line instead of a box
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
    
    // Initialize the buttons with the theme
    const fieldsetObj = new DCFFieldsetCollapsibleModule.DCFFieldsetCollapsible(fieldsets, fieldsetsTheme);
    fieldsetObj.initialize();
});
