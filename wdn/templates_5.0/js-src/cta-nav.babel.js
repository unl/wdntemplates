// define([], function() {
//
//   let initialized = false;
//
//   let Plugin = {
//     initialize : function() {
//       if (initialized) {
//         return;
//       }
//
//       let ctaNav = document.querySelector('.dcf-nav-global');
//       let ctaButtons = document.querySelectorAll('.dcf-nav-global-btn');
//
//       function onKeyUp(e) {
//         if (e.keyCode === 27) {
//           closeAllPopovers();
//         }
//       }
//
//       let toggleButtonOnClick = function() {
//         if (this.getAttribute('aria-pressed') == 'true') {
//           closePopover(this);
//         } else {
//           openPopover(this);
//         }
//       };
//
//       let openButtonOnMouseover = function() {
//         if (this.getAttribute('aria-pressed') == 'false') {
//           openPopover(this);
//         }
//       };
//
//       let openPopover = function(ctabtn) {
//         if (ctabtn.getAttribute('aria-pressed') == 'true') {
//           // already open
//           return;
//         }
//         closeAllPopovers();
//         ctabtn.setAttribute('aria-pressed', 'true');
//         ctabtn.nextElementSibling.setAttribute('aria-expanded', 'true');
//         ctabtn.nextElementSibling.removeAttribute('hidden');
//         ctabtn.focus();
//         document.addEventListener('keyup', onKeyUp);
//       };
//
//       let closePopover = function(ctabtn) {
//         if (ctabtn.getAttribute('aria-pressed') == 'false') {
//           // already closed
//           return;
//         }
//
//         ctabtn.setAttribute('aria-pressed', 'false');
//         ctabtn.nextElementSibling.setAttribute('aria-expanded', 'false');
//         ctabtn.nextElementSibling.setAttribute('hidden', '');
//         ctabtn.focus();
//         document.removeEventListener('keyup', onKeyUp);
//       };
//
//       let closeAllPopovers = function() {
//         for (var i = 0; i < ctaButtons.length; ++i) {
//           if (ctaButtons[i].getAttribute('aria-pressed') == 'true') {
//             closePopover(ctaButtons[i]);
//           }
//         }
//       }
//
//       // Close all CTA Popovers when mouseleave CTA nav or open popovers
//       ctaNav.addEventListener('mouseleave', closeAllPopovers);
//
//       // Set events for each button in CTA nav
//       for (let i = 0; i < ctaButtons.length; i++) {
//         ctaButtons[i].addEventListener('click', toggleButtonOnClick);
//         ctaButtons[i].addEventListener('mouseover', openButtonOnMouseover);
//       }
//     }
//   };
//
//   return Plugin;
// });
