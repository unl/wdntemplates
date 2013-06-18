define(['jquery', 'wdn', 'require', 'modernizr', 'navigation'], function($, WDN, require, Modernizr, nav) {
	function getLocalSearch() {
		var link = $('link[rel=search]');
		if (link.length && link[link.length - 1].type != 'application/opensearchdescription+xml') {
			return link[link.length - 1].href;
		}
		
		return false;
	}
	
	return {
		initialize : function() {
			var domQ = $('#q'),
				domSearchForm = $('#wdn_search_form'),
				siteHomepage = nav.getSiteHomepage();
			
			/**
		     * Add the experimental text-to-speech
		     */
            domQ[0].setAttribute('x-webkit-speech', 'x-webkit-speech');

			var localSearch = getLocalSearch();
			if (localSearch) {
				// Change form action to the local search
				var qsPos = localSearch.indexOf('?'), hashes, hash, htmlUpdate = $();
				if (qsPos > -1) {
					hashes = localSearch.slice(qsPos + 1).split('&');
					for (var i = 0; i < hashes.length; i++) {
						hash = hashes[i].split('=');
						htmlUpdate.add($('<input>', {
							type: "hidden",
							name: hash[0],
							value: decodeURIComponent(hash[1])
						}));
					}
					domSearchForm.append(htmlUpdate);
				}
				
				domSearchForm.setAttribute('action', localSearch);
			} else {
				if (siteHomepage && siteHomepage !== 'http://www.unl.edu/') {
					domSearchForm.append($('<input>', {
						type: "hidden",
						name: "u",
						value: siteHomepage
					}));
				}
			}
				
			if (!Modernizr.placeholder) {
				require(['plugins/placeholder/jquery.placeholder.min.js'], function() {
					domQ.placeholder();
				});
			}
		}
	};
});
