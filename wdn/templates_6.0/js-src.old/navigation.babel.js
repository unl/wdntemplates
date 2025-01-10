define(['dcf-navMenuToggle', 'plugins/headroom', 'plugins/body-scroll-lock'], function(navMenuToggleModule, headroom, bodyScrollLock) {
  let initialized = false;

  let Plugin = {
    initialize : function() {
      if (initialized) {
        return;
      }
      let navMenuToggle = new navMenuToggleModule.DCFNavMenuToggle(headroom, bodyScrollLock);
    }
  };

  return Plugin;
});
