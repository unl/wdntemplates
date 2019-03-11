// Test for WebP browser support https://github.com/djpogo/webp-inline-support
(function (document) {
  "use strict";

  function alreadyTested() {
    return (!!window.sessionStorage && !!window.sessionStorage.getItem("webpSupport"));
  }

  /**
   * Test webP images support.
   * @param {Function} callback - Callback function.
   */
  function testWepP(callback) {
    if (alreadyTested()) {
      addWebPClass(true);
      return;
    }
    var webP = new Image();

    webP.onload = webP.onerror = function () {
      callback(webP.height === 2);
    };
    webP.src = "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA" + "iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";
  };

  /**
   * Add 'webp' class to html element if supported.
   * @param {Boolean} support - WebP format support.
   */
  function addWebPClass(support) {
    if (support) {
      var el = document.documentElement;

      if (el.classList) {
        el.classList.add("webp");
      } else {
        el.className += " webp";
      }
      window.sessionStorage.setItem("webpSupport", true);
    }
  };

  testWepP(addWebPClass);
})(document);
