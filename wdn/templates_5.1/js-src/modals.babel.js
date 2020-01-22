require (['dcf-utility', 'dcf-modal', 'plugins/body-scroll-lock', 'css!js-css/modals'], (Utility, Modal, bodyScrollLock) => {
  const modals = document.querySelectorAll('.dcf-modal');
  const unlModal = new DCFModal(modals, bodyScrollLock);
  unlModal.initialize();
});
