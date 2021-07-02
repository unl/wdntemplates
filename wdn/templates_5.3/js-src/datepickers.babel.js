require(['dcf-datepicker-module'], (datePicker) => {
  //Date Pickers
  const datePickers = document.querySelectorAll('.dcf-datepicker');
  datePickers.forEach(function (dp) {
    new datePicker(dp);
  });
});