define([
  'dcf-utility',
  'dcf-slideshow',
], function(){

  function DCFSlideshowModule() {
    DCFSlideshow.apply(this, arguments);
  }

  DCFSlideshowModule.prototype = Object.create(DCFSlideshow.prototype);
  DCFSlideshowModule.prototype.constructor = DCFSlideshowModule;

  return DCFSlideshowModule;
});
