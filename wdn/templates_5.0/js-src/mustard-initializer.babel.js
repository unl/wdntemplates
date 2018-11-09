// loading polyfill.io
(function() {
  var el = document.createElement("script");
  el.async = false;
  el.src = "https://cdn.polyfill.io/v2/polyfill.min.js";
  document.body.appendChild(el);
})();

if (!("objectFit" in document.body.style)) {
  require(["mustard/ofi"], () => {
    objectFitImages();
  });
}
