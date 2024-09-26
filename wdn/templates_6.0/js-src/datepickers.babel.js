require(['dcf-datepicker'], (datePickerModule) => {
  //Date Pickers
  const datePickers = document.querySelectorAll('.dcf-datepicker');
  datePickers.forEach(function (dp) {
    new datePickerModule.DCFDatepicker(dp);
  });
});
