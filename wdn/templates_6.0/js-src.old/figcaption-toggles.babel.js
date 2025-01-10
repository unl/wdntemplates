require(['dcf-figcaption-toggle', 'css!js-css/figcaption-toggles'], (DCFFigcaptionToggleModule) => {
  // Get all the buttons and create the theme
  const figcaptions = document.querySelectorAll('.dcf-figcaption-toggle');
  const figcaptionToggleTheme = new DCFFigcaptionToggleModule.DCFFigcaptionToggleTheme();

  // Change classes to UNL-* so we can do animations in css!js-css/figcaption-toggle
  figcaptionToggleTheme.setThemeVariable('toggleButtonInnerHTML',
    `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
        width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path class="unl-btn-toggle-figcaption-icon-open"
        d="M1,3h19c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,1,0,1.4,0,2C0,2.6,0.4,3,1,3z"/>
        '<path class="unl-btn-toggle-figcaption-icon-open"
        d="M1,8h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,6,0,6.4,0,7C0,7.6,0.4,8,1,8z"/>
    <path class="unl-btn-toggle-figcaption-icon-close-1"
        d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
    <path class="unl-btn-toggle-figcaption-icon-close-2"
        d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
    <path class="unl-btn-toggle-figcaption-icon-open"
        d="M1,18h18c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,17.6,0.4,18,1,18z"/>
    <path class="unl-btn-toggle-figcaption-icon-open"
        d="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>
    </svg>`
  );
  
  // Initialize the buttons with the theme
  const figcaptionToggleObj = new DCFFigcaptionToggleModule.DCFFigcaptionToggle(figcaptions, figcaptionToggleTheme);
  figcaptionToggleObj.initialize();
});
