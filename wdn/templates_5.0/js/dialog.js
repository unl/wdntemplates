define([
  'plugins/dialog-polyfill/dialog-polyfill',
  'wdn'
], function(dialogPolyfill, wdn) {
  wdn.loadCSS('css!plugins/dialog-polyfill/dialog-polyfill');
  return dialogPolyfill;
});
