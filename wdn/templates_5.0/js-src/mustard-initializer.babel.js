// Load Polyfill.io
(function() {
  var el = document.createElement("script");
  el.async = false;
  el.src = "https://cdn.polyfill.io/v2/polyfill.min.js";
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
