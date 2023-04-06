require(['dcf-popup'], (DCFPopup) => {
  // Get all the buttons and create the theme
  const popups = document.querySelectorAll('.dcf-popup');

  // Initialize the buttons with the theme
  const popupTheme = new DCFPopup.DCFPopupTheme();

  const popupObj = new DCFPopup.DCFPopup(popups, popupTheme);
  popupObj.initialize();
});
