// Load Polyfill.io
(function() {
  var el = document.createElement('script');
  el.async = false;
  el.src = 'https://polyfill.io/v3/polyfill.min.js?flags=gated&features=Element.prototype.classList%2CCustomEvent%2CNodeList.prototype.forEach%2CArray.prototype.map%2CArray.prototype.find%2Cdefault%2CArray.prototype.filter%2CElement.prototype.matches';
  document.body.appendChild(el);
})();


require(['require',], () => {

  // Test for object-fit browser support, load polyfill if needed
  if(!('objectFit' in document.body.style)) {
    require(['mustard/ofi'], () => {
      objectFitImages();
    })
  }

  require(['dcf-utility'], (utilityModule) => {

    // Trigger dcf-webp class processing
    utilityModule.DCFUtility.flagSupportsWebP();

    // Trigger dcf-no-js check
    utilityModule.DCFUtility.flagSupportsJavaScript();
  });

});
