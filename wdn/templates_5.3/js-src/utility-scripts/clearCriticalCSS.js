(function() {
  var removeCriticalCSS = function() {
    var el = document.getElementById("unl-css-critical");
    el.parentNode.removeChild(el);
  };

  var coreStyles = document.getElementById("unl-css-core");
  onloadCSS(coreStyles, function() {
    removeCriticalCSS();
  });
})();
