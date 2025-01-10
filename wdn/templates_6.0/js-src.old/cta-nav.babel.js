define([], function() {

  let initialized = false;

  let Plugin = {
    initialize : function() {
      if (initialized) {
        return;
      }

      let ctaLinks = document.querySelectorAll('.dcf-link-cta');
      let ctaButtons = document.querySelectorAll('.dcf-btn-toggle-cta');

      if (window.matchMedia('(min-width: 56.12em)').matches) {

        // Remove fallback links
        for (let i = 0; i < ctaLinks.length; i++) {
          let ctaLink = ctaLinks[i];
          ctaLink.setAttribute('hidden', '');
        }

        // Show buttons (instead of fallback links) to toggle display of options popovers
        for (let i = 0; i < ctaButtons.length; i++) {
          let ctaButton = ctaButtons[i];
          ctaButton.removeAttribute('hidden');
        }

      }
    }
  };

  return Plugin;
});
