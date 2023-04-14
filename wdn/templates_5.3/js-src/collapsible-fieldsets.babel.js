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
    
    // Initialize the buttons with the theme
    const fieldsetObj = new DCFFieldsetCollapsibleModule.DCFFieldsetCollapsible(fieldsets, fieldsetsTheme);
    fieldsetObj.initialize();
});
