define([
  'dcf-utility',
  'dcf-lazyLoad',
], function(){

  function DCFLazyLoadModule() {
    DCFLazyLoad.apply(this, arguments);
  }

  DCFLazyLoadModule.prototype = Object.create(DCFLazyLoad.prototype);
  DCFLazyLoadModule.prototype.constructor = DCFLazyLoadModule;

  return DCFLazyLoadModule;
});
