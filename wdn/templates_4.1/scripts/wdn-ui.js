define(['jquery'], function($) {
	"use strict";

	var initd = false;
	
	return {
		initialize : function () {
			
			if (initd) {
				//Don't initialize multiple times
				return;
			}
			
			this.setUpDropDownWidget('.wdn-dropdown-widget-toggle');
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
				$(element).attr('aria-haspopup', true);

				//Get the dropdown-container for this control.
				var container_id = $(element).attr('aria-controls');
				var $container = $('#'+container_id);
				
				//Mark it as hidden
				$container.attr('aria-hidden', true);
			});
			
			$(selector).change(function() {
				var $control = $(this);
				if ($control.is(':checked')) {
					var container_id = $control.attr('aria-controls');
					var $container = $('#'+container_id);
					$container.attr('aria-hidden', false);
				}
				
				
				//Close other widgets
				$.each($('.wdn-dropdown-widget-toggle').not(this), function(index, element) {
					var container_id = $(element).attr('aria-controls');
					var $container = $('#'+container_id);

					$container.attr('aria-hidden', true);
					
					
					$(element).attr('checked', false);
				});
			});
		}
	};
});
