require (['dcf-utility', 'dcf-modal', 'plugins/body-scroll-lock'], (Utility, Modal, bodyScrollLock) => {
  const modals = document.querySelectorAll('.dcf-modal');
  const unlModal = new DCFModal(modals, bodyScrollLock);
  unlModal.initialize();

  // Define custom open and close event
  modals.forEach((modal) => {
    setVideoEventListeners(modal);
  });

  function setVideoEventListeners(modal) {
    // Get any videos in modal
    const videos = modal.getElementsByTagName('video');

    if (videos && videos.length > 0) {
      const playBtns = modal.getElementsByClassName('mejs-overlay-play');

      const autoplay = modal.getAttribute('data-autoplay');
      if (autoplay && autoplay === 'true') {
        document.addEventListener('ModalOpenEvent_' + modal.id, function (e) {
          // auto play first video
          videos[0].play();
        }, false);
      }

      document.addEventListener('ModalCloseEvent_' + modal.id, function(e) {
        // pause and reset all modal videos
        Array.prototype.forEach.call(videos,(video) => {
          video.pause();
          video.load();
        });

        // Show any hidden overlay play buttons
        if (playBtns && playBtns.length > 0) {
          Array.prototype.forEach.call(playBtns, (playBtn) => {
            if (playBtn.style.display === 'none') {
              playBtn.style.display = 'block';
            }
          });
        }
      }, false);
    }
  }
});
