define([], function () {

	/**
	 * 
	 * @type {{initialize: function(), registerDialog: function(*=), setupDialog: function(*=, *=, *=), setupShowDialogButton: function(*=, *), setupCloseDialogButton: function(*=, *), setupBackdropClose: function(*=)}}
	 */
	const dialogHelper = {
		/**
		 * 
		 * @param dialog node - the dialog node (not jquery object)
		 * @param showButton null|node - null will prompt the function to find all buttons with the data-show-dialog attribute
		 * @param closeButton null|node - null will prompt the function to find all buttons with the data-close-dialog attribute
		 */
		initialize: (dialog, showButton, closeButton) => {
			//attach the polyfill if Dialog element not present in window
			if (!window.HTMLDialogElement) dialogHelper.registerDialogPolyfill(dialog);

			//add event listeners and other WDN magic
			dialogHelper.setupShowDialogButton(dialog, showButton);
			dialogHelper.setupCloseDialogButton(dialog, closeButton);
			dialogHelper.setupBackdropClose(dialog);
		},

		/**
		 * Register the dialog with the polyfill
		 * 
		 * @param dialog the dialog node
		 */
		registerDialogPolyfill: (dialog) => {
			if(!window.HTMLDialogElement) {
				require([	'mustard/dialog-polyfill',
					'css!mustard/dialog-polyfill.css'],(dialogPolyfill) => {
					dialogPolyfill.registerDialog(dialog);
				})
			}
		},

		/**
		 * 
		 * @param buttons - null|node - will attach an event listener to the button node, if null will attach an event listener to all buttons with the data-show-dialog attribute that references the dialog's id
		 * @param dialog node - the dialog node to reference
		 */
		setupShowDialogButton: (dialog, buttons) => {
			if (!buttons) {
				buttons = document.querySelectorAll('button[data-show-dialog="'+dialog.getAttribute('id')+'"]');
			}

			if ('undefined' === typeof buttons.length) {
				//Convert to an array if we need to
				buttons = [buttons];
			}

			for (let i=0; i<buttons.length; i++) {
				// show dialog on trigger button click
				buttons[i].addEventListener('click', () => {
					dialog.showModal();
				});
			}
		},

		/**
		 *
		 * @param buttons - null|node - will attach an event listener to the button node, if null will attach an event listener to all buttons with the data-close-dialog attribute that references the dialog's id
		 * @param dialog node - the dialog node to reference
		 */
		setupCloseDialogButton: (dialog, buttons) => {
			if (!buttons) {
				buttons = document.querySelectorAll('button[data-close-dialog="'+dialog.getAttribute('id')+'"]');
			}
			
			if ('undefined' === typeof buttons.length) {
				//Convert to an array if we need to
				buttons = [buttons];
			}
			
			for (let i=0; i<buttons.length; i++) {
				// close dialog on close button click
				buttons[i].addEventListener('click', () => {
					dialog.close();
				});
			}
		},

		/**
		 * Close the dialog when the backdrop is clicked
		 * 
		 * @param dialog node
		 */
		setupBackdropClose: (dialog) => {
			//Set up a wrapper element
			let wrapper = document.createElement('div');

			// insert wrapper before el in the DOM tree
			dialog.parentNode.insertBefore(wrapper, dialog);

			// move el into wrapper
			wrapper.appendChild(dialog);
			
			//Watch for click events on the wrapper
			wrapper.addEventListener('click', (e) => {
				if (e.target === dialog) {
					dialog.close();
				}
			});
		}
	};
	
	return dialogHelper;
});
