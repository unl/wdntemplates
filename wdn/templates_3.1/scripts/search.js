WDN.search = function() {
	return {
		initialize : function() {
		    /**
		     * Add the experimental text-to-speech
		     */
            WDN.jQuery('#q').attr('x-webkit-speech', 'x-webkit-speech');
            
            if (WDN.hasDocumentClass('no-placeholder')) {
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/placeholder/jquery.placeholder.min.js'), function() {
					WDN.jQuery('#q').placeholder();
				});
			}

			var localSearch = WDN.search.hasLocalSearch();
			if (localSearch) {
				// Change form action to the local search
				var qParams = new Object();
				var url = new String(localSearch);
				var hashes = url.slice(url.indexOf('?') + 1).split('&');
				for (var i = 0; i < hashes.length; i++) {
					var hash = hashes[i].split('=');
					WDN.jQuery('#wdn_search_form').append('<input type="hidden" name="'+hash[0]+'" value="'+decodeURIComponent(hash[1])+'" />');
				}
				WDN.jQuery('#wdn_search_form').attr('action', localSearch);
			} else {
				WDN.jQuery('#wdn_search_form').attr('action', 'http://www1.unl.edu/search/');
				if (WDN.navigation.siteHomepage !== false && WDN.navigation.siteHomepage !== 'http://www.unl.edu/') {
					// Add local site to the search parameters
					WDN.jQuery('#wdn_search_form').append('<input type="hidden" name="u" value="'+WDN.navigation.siteHomepage+'" />');
				}
			}
		},
		hasLocalSearch : function() {
			
			if (WDN.jQuery('link[rel=search]').length
				&& WDN.jQuery('link[rel=search]').attr('type') != 'application/opensearchdescription+xml') {
				return WDN.toAbs(WDN.jQuery('link[rel=search]').attr('href'), location.protocol+'//'+location.hostname);
			}
			return false;
		}
	};
}();
