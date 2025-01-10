require(['dcf-gallery', 'plugins/body-scroll-lock'], (DCFGalleryImageModule, bodyScrollLock) => {

  // Get all the gallery images and create the theme
  const galleryImages = document.querySelectorAll('.dcf-gallery-img');
  const galleryImageTheme = new DCFGalleryImageModule.DCFGalleryImageTheme();

  // Initialize the gallery images with the theme
  const galleryImageObj = new DCFGalleryImageModule.DCFGalleryImage(galleryImages, galleryImageTheme, bodyScrollLock);
  galleryImageObj.initialize();

  //TODO Add logic here for adding for when you add more images (galleryImageObj.addNewGalleryImage())

});
