require(['dcf-slideshow-module', 'css!js-css/slideshows'], (slideShow) => {
  const openCaptionEvent = new Event('openCaption');
  const closeCaptionEvent = new Event('closeCaption');
  const slideshows = document.querySelectorAll('.dcf-slideshow');
  const uls = document.querySelectorAll('.dcf-slideshow ul');

  const slideshowInstance = new slideShow(slideshows, uls, openCaptionEvent, closeCaptionEvent);

  slideshowInstance.initialize();

  const keyframesClose1 = [
    {
      transform: 'rotate(45deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const keyframesClose2 = [
    {
      transform: 'rotate(-45deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const keyframesOpen1 = [
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(45deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const keyframesOpen2 = [
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(-45deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const options = {
    duration: 250,
    fill: 'forwards'
  };

  Array.prototype.forEach.call(slideshows, (slideshow) => {
    // Slideshow Controls
    let ctrlGroup = slideshow.querySelector('.dcf-slideshow-controls'); // DCF
    let ctrls = ctrlGroup.querySelectorAll('li');

    Array.prototype.forEach.call(ctrls, (ctrl) => {
      if (ctrl.classList.contains('dcf-li-slide-prev')) {
        let ctrlButton = ctrl.querySelector('button');
        ctrlButton.classList.add('dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse');
        ctrlButton.innerHTML =
          '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M23.509 9.856c-.38-.55-.928-.852-1.542-.852H9.74l4.311-4.151c.995-.994.961-2.646-.074-3.682-1.001-1-2.722-1.033-3.68-.077L.148 11.144a.5.5 0 00-.003.707l9.978 10.079a2.445 2.445 0 001.737.705c.707 0 1.407-.294 1.92-.806a2.737 2.737 0 00.807-1.923 2.431 2.431 0 00-.708-1.733l-4.156-4.16h12.276c.618 0 1.161-.302 1.53-.851.304-.451.471-1.041.471-1.658 0-.596-.179-1.196-.491-1.648z"></path>' +
          '</svg>';
      } else if (ctrl.classList.contains('dcf-li-slide-next')) {
        let ctrlButton = ctrl.querySelector('button');
        ctrlButton.classList.add('dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse');
        ctrlButton.innerHTML =
          '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M23.852 11.144L13.703 1.096c-.96-.96-2.678-.924-3.68.075-1.036 1.035-1.07 2.687-.069 3.69l4.321 4.143H2.03c-1.27 0-2.03 1.272-2.03 2.5 0 .617.168 1.207.472 1.659.369.549.913.851 1.53.851h12.276l-4.156 4.16a2.425 2.425 0 00-.708 1.734c0 .708.293 1.409.807 1.922a2.738 2.738 0 001.919.806c.664 0 1.28-.251 1.739-.708l9.977-10.076a.502.502 0 00-.004-.708z"></path>' +
          '</svg>';
      }
    });
    // Caption Button
    let figures = slideshow.querySelectorAll('.dcf-slideshow figure');
    Array.prototype.forEach.call(figures, (figure) => {
      let captionBtn = figure.querySelector('button');
      if (!(typeof captionBtn === 'undefined')) {
        captionBtn.innerHTML =
          '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" ' +
          'width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path class="unl-icon-slide-caption-open" ' +
          'd="M1,3h19c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,1,0,1.4,0,2C0,2.6,0.4,3,1,3z"/>' +
          '<path class="unl-icon-slide-caption-open" ' +
          'd="M1,8h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,6,0,6.4,0,7C0,7.6,0.4,8,1,8z"/>' +
          '<path class="unl-icon-slide-caption-close-1" ' +
          'd="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>' +
          '<path class="unl-icon-slide-caption-close-2" ' +
          'd="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>' +
          '<path class="unl-icon-slide-caption-open" ' +
          'd="M1,18h18c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,17.6,0.4,18,1,18z"/>' +
          '<path class="unl-icon-slide-caption-open" ' +
          'd="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>' +
          '</svg>';
      }
    });
  });
  let slideBtns = document.querySelectorAll('.dcf-btn-slide');
  Array.prototype.forEach.call(slideBtns, (slideBtn) => {
    slideBtn.classList.add('dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-white');
  });
  let buttons = document.querySelectorAll('.dcf-btn-slide-caption');
  Array.prototype.forEach.call(buttons, (button) => {
    let caption = button.previousElementSibling;
    let close1 = button.querySelector('.unl-icon-slide-caption-close-1');
    let close2 = button.querySelector('.unl-icon-slide-caption-close-2');

    caption.addEventListener('openCaption', () => {
      close1.animate(keyframesClose1, options);
      close2.animate(keyframesClose2, options);
    }, false);

    caption.addEventListener('closeCaption', () => {
      close1.animate(keyframesOpen1, options);
      close2.animate(keyframesOpen2, options);
    }, false);
  });
});
