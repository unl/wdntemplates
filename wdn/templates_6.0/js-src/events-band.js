define([
  'events',
  'jquery'
], function(events, $) {
  console.warn('Warning: The WDN events-band plugin is deprecated. Use WDN events plugin with band layout instead.');

  return {
    initialize : function(config) {
      // force these items so behaves as legacy events-band
      if (!config.container) {
        config.container = '#events-band';
      }
      config.layout = 'band';

      $(function() {
        events.setup(config);
      });
    },

    setup : events.setup
  };
});
