(function() {
  var WDNRemoveCriticalStyles = function() {
    var el = document.getElementById("wdn-critical-styles");
    el.parentNode.removeChild(el);
  };

  var coreStyles = document.getElementById("core-css");
  onloadCSS(coreStyles, function() {
    WDNRemoveCriticalStyles();
  });
})();
