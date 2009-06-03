var WDN_Search = function() {
	return {
		initialize : function() {
			jQuery('#wdn_search_form fieldset input#q').focus(WDN_Search.hideLabel);
			if (jQuery('#wdn_search_form fieldset input#q').val() != "") {
				WDN_Search.hideLabel();
			}
		},
		hideLabel : function() {
			jQuery('#wdn_search_form fieldset label').hide();
		}
	};
}();
WDN_Search.initialize();