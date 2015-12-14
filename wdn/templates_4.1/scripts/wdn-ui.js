define(['jquery'], function($) {
	"use strict";

	var initd = false;

	var closeDropDown = function(selector) {
		$.each($(selector), function(index, element) {
			var container_id = $(element).attr('aria-controls');
			var $container = $('#'+container_id);

			$container.attr('aria-hidden', true);
			$(element).attr('checked', false);
		});
	};
	
	return {
		initialize : function () {
			
			if (initd) {
				//Don't initialize multiple times
				return;
			}
			
			this.setUpDropDownWidget('.wdn-dropdown-widget-toggle');

			//Close search on escape
			$(document).on('keydown', function(e) {
				if (e.keyCode === 27) {
					//Close on escape
					closeDropDown('.wdn-dropdown-widget-toggle');
				}
			});

			//listen for clicks on the document and close dropdowns if they don't come from a dropdown
			$(document).on('click', function(e) {
				var $target = $(e.target);
				
				//dont close this way if the control was clicked
				if ($target.filter('.wdn-dropdown-widget-toggle, .wdn-dropdown-widget-label').length) {
					return;
				}
				
				//close all dropdown widgets
				if (!$('.wdn-dropdown-widget-content').find(e.target).length) {
					closeDropDown('.wdn-dropdown-widget-toggle');
				}
			});
			
			initd = true;
		},

		/**
		 * Set up new dropdown widget(s). The selector should point to the input that controls the content drop-down.
		 *
		 * @param selector
		 */
		setUpDropDownWidget : function(selector) {
			//Set up the initial state for the widget
			$(selector).each(function(index, element) {
				//Mark this control as having a popup
				var $element = $(element);

				$element.attr('aria-haspopup', true);

				//Get the dropdown-container for this control.
				var container_id = $element.attr('aria-controls');
				var $container = $('#'+container_id);
				
				//Mark it as hidden
				$container.attr('aria-hidden', true);
				
				//Add a helper class to labels
				var $label = $('label[for="'+$element.attr('id')+'"]');
				$label.addClass('wdn-dropdown-widget-label');
			});
			
			$(selector).change(function() {
				var $control = $(this);
				if ($control.is(':checked')) {
					var container_id = $control.attr('aria-controls');
					var $container = $('#'+container_id);
					$container.attr('aria-hidden', false);
				}

				//Close other widgets
				closeDropDown($('.wdn-dropdown-widget-toggle').not(this));
			});
		}
	};
});
