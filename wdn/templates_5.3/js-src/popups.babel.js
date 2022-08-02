define([], function() {

  let initialized = false;

  let Plugin = {
    initialize : function() {
      if (initialized) {
        return;
      }

      let popupBtns = document.querySelectorAll('.dcf-btn-popup');

      // Close all popups when Esc key is pressed
      function onKeyUp(e) {
        if (e.keyCode === 27) {
          closeAllPopups();
        }
      }

      let toggleBtnOnClick = function() {
        if (this.getAttribute('aria-pressed') == 'true') {
          closePopup(this);
        } else {
          openPopup(this);
        }
      };

      let openButtonOnMouseover = function() {
        if (this.getAttribute('aria-pressed') == 'false') {
          openPopup(this);
        }
      };

      let openPopup = function(popupBtn) {
        if (popupBtn.getAttribute('aria-pressed') == 'true') {
          // already open
          return;
        }
        closeAllPopups();
        popupBtn.setAttribute('aria-pressed', 'true');
        popupBtn.nextElementSibling.setAttribute('aria-expanded', 'true');
        popupBtn.nextElementSibling.removeAttribute('hidden');
        popupBtn.focus();
        document.addEventListener('keyup', onKeyUp);
      };

      let closePopup = function(popupBtn) {
        if (popupBtn.getAttribute('aria-pressed') == 'false') {
          // already closed
          return;
        }

        popupBtn.setAttribute('aria-pressed', 'false');
        popupBtn.nextElementSibling.setAttribute('aria-expanded', 'false');
        popupBtn.nextElementSibling.setAttribute('hidden', '');
        popupBtn.focus();
        document.removeEventListener('keyup', onKeyUp);
      };

      let closeAllPopups = function() {
        for (var i = 0; i < popupBtns.length; ++i) {
          if (popupBtns[i].getAttribute('aria-pressed') == 'true') {
            closePopup(popupBtns[i]);
          }
        }
      }

      // Set events for each button in CTA nav
      for (let i = 0; i < popupBtns.length; i++) {
        popupBtns[i].addEventListener('click', toggleBtnOnClick);
      }

    }
  };

  return Plugin;
});
