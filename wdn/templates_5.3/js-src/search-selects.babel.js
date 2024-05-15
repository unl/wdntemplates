require(['dcf-search-select'], (DCFSearchSelect) => {

  // Get all the selects and create the theme
  const selects = document.querySelectorAll('.dcf-search-select');
  const selectTheme = new DCFSearchSelect.DCFSearchSelectTheme();

  selectTheme.setThemeVariable('availableItemsListClassList', ['dcf-absolute', 'dcf-d-none', 'dcf-mb-0', 'dcf-pl-0', 'dcf-w-100%', 'dcf-z-2', 'unl-box-shadow']);
  selectTheme.setThemeVariable('selectedItemButtonClassList', [ 'dcf-btn', 'dcf-btn-secondary', 'dcf-h-100%', 'dcf-p-3', 'dcf-z-1']);

  // Initialize the selects with the theme
  const selectObj = new DCFSearchSelect.DCFSearchSelect(selects, selectTheme);
  selectObj.initialize();

});
