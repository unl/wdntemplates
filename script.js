
// require(['dialog'],function(dialogPolyfill){



//select all modal
const modalContainers = Array.from(document.querySelectorAll('.dcf-js-dialog'));

modalContainers.forEach((modalContainer) => {
  // if(!window.HTMLDialogElement) {
  //   dialogPolyfill.registerDialog(modalContainer);
  // }

  const trigger = modalContainer.querySelector('.dcf-js-dialog-trigger');
  const modalDialog = modalContainer.querySelector('dialog');
  const closeButton = modalContainer.querySelector('.dcf-o-dialog__close');

  trigger.addEventListener('click',() => {modalDialog.showModal()});

  closeButton.addEventListener('click', () => {modalDialog.close('closed')});

  modalDialog.addEventListener('cancel', () => {modalDialog.close('cancelled')});
  modalContainer.addEventListener('click', (e) => {
    if (e.target == modalDialog) modalDialog.close('cancelled');
    console.log(e.target);
  });

});



// });