'use strict';

/**
 * This creates a dropdown widget and enforces accessibility best practices including:
 * 1) use aria-expanded to describe when the drop-down is open or closed
 * 2) when opened, send focus to the first focusable element
 * 3) when closed, return focus back to the button (escape key will also close)
 *
 * This is different from an aria dropdown MENU because the a 'menu' in aria describes a desktop application like menu structure. Not links or other content.
 *
 * <div> //container (for a navigation dropdown, this should be <nav>
 *     <button aria-expanded="false">text</button>
 *     <div hidden> //this is what the button controls. It needs to be either the element following the button, or referenced by aria-controls.
 *         <a href="">example</a> //This element will be focused
 *     </div>
 * </div>
 *
 */
define([], function () {
	"use strict";

	/**
  * @param container DOM object (NOT a jquery object)
  * @constructor
  */

	function DropDownWidget(container, type) {
		this.container = container;
		this.type = type || null;
		this.button = this.container.querySelector('button[aria-expanded="false"]');

		let id = this.button.getAttribute('aria-controls');
		if (id) {
			this.controls = document.getElementById(id);
		} else {
			//Assume that it is controlling the next sibling element
			this.controls = this.button.nextElementSibling;
		}

		//Determine which element should receive focus
		this.focusTarget = this.controls.querySelector('h2, a, button');
		this.focusTarget.setAttribute('tabindex', '0'); //Ensure that the element is focusable.

    //Close
    document.addEventListener('closeDropDownWidget', function (e) {
      if (this.type == e.detail.type && this.isExpanded()) {
        this.close();
      }
    }.bind(this));

		//Toggle
		this.button.addEventListener('click', function (e) {
			// pass menu item node to select method
			this.toggle();
		}.bind(this));

		//Handle the escape action
		document.addEventListener('keydown', function (e) {
			// If escape, refocus menu button
			if (e.keyCode === 27) {
				this.close();
			}
		}.bind(this));
	}

	DropDownWidget.prototype.open = function () {
		this.button.setAttribute('aria-expanded', 'true');
		this.controls.hidden = false;
		//Send focus to the first item
		this.focusTarget.focus();
		let openEvent = new CustomEvent('openDropDownWidget', {detail: {type: this.type}});
		document.dispatchEvent(openEvent);
	};

	DropDownWidget.prototype.close = function () {
		this.button.setAttribute('aria-expanded', 'false');
		this.controls.hidden = true;

		//Send focus back to the button if a child of the menu is currently selected
		if (document.activeElement && this.controls.contains(document.activeElement)) {
			this.button.focus();
		}
	};

	DropDownWidget.prototype.toggle = function () {
		if (this.isExpanded()) {
			this.close();
		} else {
			this.open();
		}
	};

	DropDownWidget.prototype.isExpanded = function () {
		return this.button.getAttribute('aria-expanded') === 'true';
	};

	return DropDownWidget;
});
