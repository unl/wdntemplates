define([
  'dcf-utility',
  'dcf-modal',
], function(){

  function DCFModalModule() {
    DCFModal.apply(this, arguments);
  }

  DCFModalModule.prototype = Object.create(DCFModal.prototype);
  DCFModalModule.prototype.constructor = DCFModalModule;

  return DCFModalModule;
});
