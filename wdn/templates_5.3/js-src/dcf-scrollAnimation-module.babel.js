define([
  'dcf-utility',
  'dcf-scrollAnimation',
], function(){

  function DCFScrollAnimationModule() {
    DCFScrollAnimation.apply(this, arguments);
  }

  DCFScrollAnimationModule.prototype = Object.create(DCFScrollAnimation.prototype);
  DCFScrollAnimationModule.prototype.constructor = DCFScrollAnimationModule;

  return DCFScrollAnimationModule;
});
