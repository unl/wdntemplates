define([
	'css!js-css/font-serif'
], function(WDN, require) {
    var initd = false;

    return {
      initialize: function() {
        // protect against multiple initializations
        if (initd) {
          return;
        }
        initd = true;

        // Load Mercury ScreenSmart fonts from Cloud.typography
        const fontSerif = document.createElement('link');
        fontSerif.rel = 'stylesheet';
        fontSerif.href = 'https://cloud.typography.com/7717652/7706412/css/fonts.css';
        document.head.appendChild(fontSerif);
      }
    };
});
