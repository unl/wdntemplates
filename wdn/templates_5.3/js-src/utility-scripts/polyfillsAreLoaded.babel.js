// callback function for polyfill.io in ES6+ syntax
function polyfillsAreLoaded() {
  function loadJs(url = "", async = true, id = "") {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.onload = function() {
        resolve(url);
      };
      el.onerror = function() {
        reject(url);
      };
      el.async = async;
      el.src = url;
      el.id = id;
      document.body.appendChild(el);
    });
  }

  loadJs(
    "/wdn/templates_5.3/js/compressed/all.js?dep=$DEP_VERSION$",
    true,
    "wdn_dependents"
  ).catch(function(err) {
    console.error("Failed at " + err);
  });
}
