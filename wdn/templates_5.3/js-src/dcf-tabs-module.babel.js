define([
  'dcf-utility',
  'dcf-tabs',
], function(){

  function DCFTabsModule() {
    DCFTabs.apply(this, arguments);
  }

  DCFTabsModule.prototype = Object.create(DCFTabs.prototype);
  DCFTabsModule.prototype.constructor = DCFTabsModule;

  return DCFTabsModule;
});
