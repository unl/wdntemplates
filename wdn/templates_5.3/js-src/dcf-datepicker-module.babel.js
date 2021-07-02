define([
  'dcf-utility',
  'dcf-datepicker',
], function(){

  function DCFDatePickerModule() {
    DCFDatepicker.apply(this, arguments);
  }

  DCFDatePickerModule.prototype = Object.create(DCFDatepicker.prototype);
  DCFDatePickerModule.prototype.constructor = DCFDatePickerModule;

  return DCFDatePickerModule;
});
