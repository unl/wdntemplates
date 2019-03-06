// Load Polyfill.io
(function() {
  var el = document.createElement("script");
  el.async = false;
  el.src = "https://polyfill.io/v3/polyfill.min.js?flags=gated&features=default%2CArray.prototype.map%2CArray.prototype.find%2CArray.prototype.filter%2CElement.prototype.matches";
  document.body.appendChild(el);
})();


require(['require',], () => {

  // Test for object-fit browser support, load polyfill if needed
	if(!('objectFit' in document.body.style)) {
		require(['mustard/ofi'], () => {
			objectFitImages();
		})
	}

  // Require test for WebP browser support
  require(['utility-scripts/testForWebP',], () => {});

});
