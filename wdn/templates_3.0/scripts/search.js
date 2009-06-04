var WDN_Search = function() {
	return {
		initialize : function() {
		/**
		 * Hide the label when the user starts a search
		 */
			jQuery('#wdn_search_form fieldset input#q').focus(WDN_Search.hideLabel);
			if (jQuery('#wdn_search_form fieldset input#q').val() != "") {
				WDN_Search.hideLabel();
			};
			/**
			 * Show the label if the user abandons an empty search box
			 */
			jQuery('#wdn_search_form fieldset input#q').blur(function() {
				if (jQuery('#wdn_search_form fieldset input#q').val() == "") {
					WDN_Search.showLabel();
				};
			});
		},
		hideLabel : function() {
			jQuery('#wdn_search_form fieldset label').hide();
		},
		showLabel : function() {
			jQuery('#wdn_search_form fieldset label').show();
		}
	};
}();
WDN_Search.initialize();