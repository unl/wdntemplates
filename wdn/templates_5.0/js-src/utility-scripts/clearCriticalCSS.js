(function() {
  var WDNRemoveCriticalStyles = function() {
    document.getElementById('wdn-critical-styles').remove();
  };

  var coreStyles = document.getElementById('core-css');
  onloadCSS(coreStyles, function() {
    WDNRemoveCriticalStyles();
  });

})();
