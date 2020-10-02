define([], function() {

  let initialized = false;

  let Plugin = {
    initialize : function() {
      if (initialized) {
        return;
      }

      let ctaHeader = document.querySelector('.dcf-cta-header');
      let ctaLinks = document.querySelectorAll('.dcf-link-cta');
      let ctaButtons = document.querySelectorAll('.dcf-btn-toggle-cta');
      let ctaLists = document.querySelectorAll('.dcf-list-cta');

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

        // Close all popovers when Esc key is pressed
        function onKeyUp(e) {
          if (e.keyCode === 27) {
            closeAllPopovers();
          }
        }

        let toggleButtonOnClick = function() {
          if (this.getAttribute('aria-pressed') == 'true') {
            closePopover(this);
          } else {
            openPopover(this);
          }
        };

        let openButtonOnMouseover = function() {
          if (this.getAttribute('aria-pressed') == 'false') {
            openPopover(this);
          }
        };

        let openPopover = function(ctabtn) {
          if (ctabtn.getAttribute('aria-pressed') == 'true') {
            // already open
            return;
          }
          closeAllPopovers();
          ctabtn.setAttribute('aria-pressed', 'true');
          ctabtn.nextElementSibling.setAttribute('aria-expanded', 'true');
          ctabtn.nextElementSibling.removeAttribute('hidden');
          ctabtn.focus();
          document.addEventListener('keyup', onKeyUp);
        };

        let closePopover = function(ctabtn) {
          if (ctabtn.getAttribute('aria-pressed') == 'false') {
            // already closed
            return;
          }

          ctabtn.setAttribute('aria-pressed', 'false');
          ctabtn.nextElementSibling.setAttribute('aria-expanded', 'false');
          ctabtn.nextElementSibling.setAttribute('hidden', '');
          ctabtn.focus();
          document.removeEventListener('keyup', onKeyUp);
        };

        let closeAllPopovers = function() {
          for (var i = 0; i < ctaButtons.length; ++i) {
            if (ctaButtons[i].getAttribute('aria-pressed') == 'true') {
              closePopover(ctaButtons[i]);
            }
          }
        }

        // Set events for each button in CTA nav
        for (let i = 0; i < ctaButtons.length; i++) {
          ctaButtons[i].addEventListener('click', toggleButtonOnClick);
        }

      }
    }
  };

  return Plugin;
});
