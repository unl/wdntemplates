require(['dcf-utility', 'dcf-datepicker'], () => {
  //Date Pickers
  const datePickers = document.querySelectorAll('.dcf-datepicker');
  datePickers.forEach(function (dp) {
    new DCFDatepicker(dp);
  });
});