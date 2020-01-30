require(['dcf-utility', 'dcf-tabs'], (Utility, Tabs) => {
    const tabs = document.querySelectorAll('.dcf-tabs')
    const unlTabs = new DCFTabs(tabs);
    unlTabs.initialize();
});
