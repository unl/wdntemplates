require (['dcf-modal', 'plugins/body-scroll-lock', 'css!js-css/modals'], (Modal, bodyScrollLock) => {
  const modals = document.querySelectorAll('.dcf-modal');
  const unlModal = new Modal(modals, bodyScrollLock);
  unlModal.initialize();
});
