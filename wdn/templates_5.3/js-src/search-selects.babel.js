require(['dcf-search-select'], (DCFSearchSelect) => {
    // Get all the selects and create the theme
    const selects = document.querySelectorAll('.dcf-search-select');
    const selectTheme = new DCFSearchSelect.DCFSearchSelectTheme();

    selectTheme.setThemeVariable('availableItemsClassList', ['dcf-m-0', 'dcf-b-1', 'dcf-b-solid', 'unl-b-lightest-gray']);


    // Initialize the selects with the theme
    const selectObj = new DCFSearchSelect.DCFSearchSelect(selects, selectTheme);
    selectObj.initialize();
});
