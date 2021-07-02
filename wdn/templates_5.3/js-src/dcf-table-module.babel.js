define([
  'dcf-utility',
  'dcf-table',
], function(){

  function DCFTableModule() {
    DCFTable.apply(this, arguments);
  }

  DCFTableModule.prototype = Object.create(DCFTable.prototype);
  DCFTableModule.prototype.constructor = DCFTableModule;

  return DCFTableModule;
});
