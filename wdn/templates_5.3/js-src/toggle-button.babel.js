require(['dcf-toggle-button', 'css!js-css/toggle-button'], (DCFToggleButtonModule) => {
  // Get all the buttons and create the theme
  const toggleButtons = document.querySelectorAll('.dcf-btn-toggle');

  // Initialize the buttons with the theme
  const toggleButtonObj = new DCFToggleButtonModule.DCFToggleButton(toggleButtons);
  toggleButtonObj.initialize();

  // Add class to toggleElement
  // The toggle button class only has functionality and no ability to add styles
  toggleButtons.forEach((toggleButton) => {
    const toggleElementId = toggleButton.dataset.controls;
    const toggleElement = document.getElementById(toggleElementId);

    toggleElement.classList.add('unl-btn-toggle-element');
  })
});
