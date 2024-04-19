require(['dcf-search-select'], (DCFSearchSelect) => {
    // Get all the selects and create the theme
    const selects = document.querySelectorAll('.dcf-search-select');
    const selectTheme = new DCFSearchSelect.DCFSearchSelectTheme();

    selectTheme.setThemeVariable('availableItemsGroupLabelClassList', ['dcf-m-0', 'dcf-p-bold', 'unl-bg-scarlet', 'unl-cream']);


    // Initialize the selects with the theme
    const selectObj = new DCFSearchSelect.DCFSearchSelect(selects, selectTheme);
    selectObj.initialize();
});
