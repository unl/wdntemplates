require(['dcf-toggleButton'], (DCFToggleButtonModule) => {
    // get all the buttons and create the theme
    const toggleButtons = document.querySelectorAll('.dcf-btn-toggle');

    // initialize the buttons with the theme
    const toggleButtonObj = new DCFToggleButtonModule.DCFToggleButton(toggleButtons);
    toggleButtonObj.initialize();
});
