define([], function() {

  let initialized = false;

  let Plugin = {
    initialize : function() {
      if (initialized) {
        return;
      }

      let ctaLinks = document.querySelectorAll('.dcf-link-cta');
      let ctaBtns = document.querySelectorAll('.dcf-btn-cta');

      if (window.matchMedia('(min-width: 56.12em)').matches) {

        // Remove fallback links
        for (let i = 0; i < ctaLinks.length; i++) {
          let ctaLink = ctaLinks[i];
          ctaLink.setAttribute('hidden', '');
        }

        // Show buttons (instead of fallback links) to toggle display of options popovers
        for (let i = 0; i < ctaBtns.length; i++) {
          let ctaBtn = ctaBtns[i];
          ctaBtn.removeAttribute('hidden');
        }

      }
    }
  };

  return Plugin;
});
