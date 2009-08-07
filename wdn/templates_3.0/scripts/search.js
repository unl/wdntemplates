WDN.search = function() {
	return {
		initialize : function() {
		   /**
			* Hide the label when the user starts a search
			*/
			WDN.jQuery('#wdn_search_form fieldset input#q').focus(WDN.search.hideLabel);
			if (WDN.jQuery('#wdn_search_form fieldset input#q').val() != "") {
				WDN.search.hideLabel();
			};
			/**
			 * Show the label if the user abandons an empty search box
			 */
			WDN.jQuery('#wdn_search_form fieldset input#q').blur(function() {
				if (WDN.jQuery('#wdn_search_form fieldset input#q').val() == "") {
					WDN.search.showLabel();
				};
			});
			
			var localSearch = WDN.search.hasLocalSearch();
			if (localSearch) {
				// Change form action to the local search
				WDN.jQuery('#wdn_search_form').attr('action', localSearch);
			} else {
				WDN.jQuery('#wdn_search_form').attr('action', 'http://www1.unl.edu/search/');
				if (WDN.navigation.siteHomepage != false && WDN.navigation.siteHomepage != 'http://www.unl.edu/') {
					// Add local site to the search parameters
					WDN.jQuery('#wdn_search_form').append('<input type="hidden" name="u" value="'+WDN.navigation.siteHomepage+'" />');
				}
			}
		},
		hasLocalSearch : function() {
        	var pagelinks = document.getElementsByTagName('link');
        	for (var i=0;i<pagelinks.length;i++) {
        	    relatt = pagelinks[i].getAttribute('rel');
        	    if (relatt=='search') {
        	    	return pagelinks[i].getAttribute('href');
        	    }
        	}
        	return false;
        },
		hideLabel : function() {
        	WDN.jQuery('#wdn_search_form fieldset label').hide();
		},
		showLabel : function() {
			WDN.jQuery('#wdn_search_form fieldset label').show();
		}
	};
}();
