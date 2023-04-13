require(['dcf-popup', 'css!js-css/popups'], (DCFPopup) => {
  // Get all the popups on the dom
  const popups = document.querySelectorAll('.dcf-popup');

  // Initialize the popup theme
  const popupTheme = new DCFPopup.DCFPopupTheme();

  // Any changes to the theme would go here

  // Initialize the popup with the modified theme
  const popupObj = new DCFPopup.DCFPopup(popups, popupTheme);
  popupObj.initialize();
});
