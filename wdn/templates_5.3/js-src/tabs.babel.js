require(['dcf-tabs', 'css!js-css/tabs'], (tabsModule) => {
  const tabs = document.querySelectorAll('.dcf-tabs')
  const unlTabs = new tabsModule.DCFTabs(tabs);
  unlTabs.initialize();
});
