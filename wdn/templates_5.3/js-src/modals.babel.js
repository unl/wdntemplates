require (['dcf-utility', 'dcf-modal', 'plugins/body-scroll-lock'], (Utility, Modal, bodyScrollLock) => {
  const modals = document.querySelectorAll('.dcf-modal');
  const unlModal = new DCFModal(modals, bodyScrollLock);
  unlModal.initialize();

  // Define custom open and close events
  modals.forEach((modal) => {
    handleModalVideos(modal);
  });

  function handleModalVideos(modal) {
    // Handle any videos in modal
    const videos = modal.getElementsByTagName('video');
    if (videos && videos.length > 0) {
        document.addEventListener('ModalOpenEvent_' + modal.id, function (e) {
          // autoplay any videos set to autoplay
          Array.prototype.forEach.call(videos,(video) => {
            if (video.hasAttribute('data-autoplay')) {
              video.play();
            }
          });
        }, false);

        document.addEventListener('ModalCloseEvent_' + modal.id, function (e) {
          // pause and reset all modal videos
          Array.prototype.forEach.call(videos,(video) => {
            video.pause();
            video.load();
          });

          // Show any hidden overlay play buttons
          let playBtns = modal.getElementsByClassName('mejs-overlay-play');
          if (playBtns && playBtns.length > 0) {
            Array.prototype.forEach.call(playBtns, (playBtn) => {
              if (playBtn.style.display === 'none') {
                playBtn.style.display = 'block';
              }
            });
          }
        }, false);
    }

    // Handle any mediahub iframe embed videos in modal
    const iframes = modal.getElementsByTagName('iframe');
    if (iframes && iframes.length > 0) {
      Array.prototype.forEach.call(iframes,(iframe) => {
        let allowAttr = iframe.getAttribute('allow');
        if (allowAttr && allowAttr.includes('autoplay')) {
          document.addEventListener('ModalOpenEvent_' + modal.id, function (e) {
            iframe.contentWindow.postMessage('mh-play-video', 'https://mediahub.unl.edu');
          }, false);

          document.addEventListener('ModalCloseEvent_' + modal.id, function (e) {
            iframe.contentWindow.postMessage('mh-reset-video', 'https://mediahub.unl.edu');
          }, false);
        } else {
          document.addEventListener('ModalCloseEvent_' + modal.id, function (e) {
            iframe.contentWindow.postMessage('mh-pause-video', 'https://mediahub.unl.edu');
          }, false);
        }
      });
    }
  }
});
