// WDN must be loaded synchronously for BC and config support
requirejs.config({
  baseUrl: WDN.getTemplateFilePath('js', true),
  urlArgs : 'dep=' + WDN.getDepVersion(),
  map: {
    "*": {
      css: 'require-css/css'
    }
  }
});

requirejs([
  // these map to used callback parameters
  'wdn',
  'require',
  // these are bundles for framework loading and plugin initialization
  'main-wdn-plugins'
], function(WDN, require) {
    var unlchat_url = 'https://ucommchat.unl.edu/assets/js';
    //#UNLCHAT_URL
    WDN.loadJQuery(function() {
        // load chat with cache bust once a day
        var todayParts = new Date().toLocaleDateString().split('/');
        require([unlchat_url + '?for=client&version=' + WDN.getHTMLVersion() + '&cb=' + todayParts[2] + todayParts[0] + todayParts[1]], function(){});
    });

    // Set the URL to test in webaudit
    var qaTestLink = document.getElementById('qa-test');
    if (qaTestLink) {
      var pathname = document.location.pathname;
      // webaudit expects pages to end with a slash, so add one if missing
      if (!pathname.match(/\..*$/) && !pathname.match(/\/$/)) {
        pathname += '/';
      }
      qaTestLink.search = '?url=' + encodeURI(document.location.origin + pathname);
    }

    // Process deferred inline scripts
    window.dispatchEvent(new Event('inlineJSReady'));
});
