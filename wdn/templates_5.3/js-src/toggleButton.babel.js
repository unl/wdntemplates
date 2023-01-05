require(['dcf-toggleButton'], (DCFToggleButtonModule) => {
    // get all the buttons and create the theme
    const toggleButtons = document.querySelectorAll('.dcf-toggleButton');
    const toggleButtonTheme = new DCFToggleButtonModule.DCFToggleButtonTheme();

    // Removed animation since we want to use text inside the button not the SVG
    const toggleButtonAnimation = (toggleButton) => {
        
    };
    toggleButtonTheme.setThemeVariable('toggleButtonAnimation', toggleButtonAnimation);

    // initialize the buttons with the theme
    const toggleButtonObj = new DCFToggleButtonModule.DCFToggleButton(toggleButtons, toggleButtonTheme);
    toggleButtonObj.initialize();
});
