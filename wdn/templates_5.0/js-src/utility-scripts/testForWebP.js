// Test for WebP browser support
// Slightly modified https://github.com/djpogo/webp-inline-support

(function (document) {
  "use strict";

  function alreadyTested() {
    return (!!window.sessionStorage && !!window.sessionStorage.getItem("webpSupport"));
  }

  // Test webP images support.
  // @param {Function} callback - Callback function.
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

  // Add 'webp' class to html element if supported.
  // Add 'no-webp' class to html element if not supported.
  // @param {Boolean} support - WebP format support.
  function addWebPClass(support) {
    var el = document.documentElement;

    if (support) {
      if (el.classList) {
        el.classList.add("webp");
      } else {
        el.className += " webp";
      }
      window.sessionStorage.setItem("webpSupport", true);
    } else {
      if (el.classList) {
        el.classList.add("no-webp");
      } else {
        el.className += " no-webp";
      }
    }
  };

  testWepP(addWebPClass);
})(document);
