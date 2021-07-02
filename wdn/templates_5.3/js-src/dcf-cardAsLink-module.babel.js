define([
  'dcf-utility',
  'dcf-cardAsLink',
], function(){

  function DCFCardAsLinkModule() {
    DCFCardAsLink.apply(this, arguments);
  }

  DCFCardAsLinkModule.prototype = Object.create(DCFCardAsLink.prototype);
  DCFCardAsLinkModule.prototype.constructor = DCFCardAsLinkModule;

  return DCFCardAsLinkModule;
});
