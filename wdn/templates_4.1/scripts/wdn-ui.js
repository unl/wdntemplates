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
			$(selector).change(function() {
				//Close other widgets
				$.each($('.wdn-dropdown-widget-toggle').not(this), function(index, element) {
					$(element).attr('checked', false);
				});
			});
		}
	};
});
