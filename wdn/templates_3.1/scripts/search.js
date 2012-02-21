WDN.search = function() {
	var $$ = function(selector) {
		if (selector.match(/^#[\w\-]+$/)) {
			return [document.getElementById(selector.slice(1))];
		}
		return (WDN.jQuery || function(sel) {
			if (document.querySelectorAll) {
				return document.querySelectorAll(sel);
			}
			return [];
		})(selector);
	};
	
	return {
		initialize : function() {
			var domQ = $$('#q')[0],
				domSearchForm = $$('#wdn_search_form')[0];
			
			/**
		     * Add the experimental text-to-speech
		     */
            domQ.setAttribute('x-webkit-speech', 'x-webkit-speech');

			var localSearch = WDN.search.getLocalSearch();
			if (localSearch) {
				// Change form action to the local search
				var qsPos = localSearch.indexOf('?'), hashes, hash, htmlUpdate = '';
				if (qsPos > -1) {
					hashes = localSearch.slice(qsPos + 1).split('&');
					for (var i = 0; i < hashes.length; i++) {
						hash = hashes[i].split('=');
						htmlUpdate += '<input type="hidden" name="'+hash[0]+'" value="'+decodeURIComponent(hash[1])+'" />';
					}
					domSearchForm.innerHTML += htmlUpdate;
				}
				domSearchForm.setAttribute('action', localSearch);
			} else {
				domSearchForm.setAttribute('action', 'http://www1.unl.edu/search/');
				if ('navigation' in WDN && WDN.navigation.siteHomepage !== false && 
					WDN.navigation.siteHomepage !== 'http://www.unl.edu/'
				) {
					domSearchForm.innerHTML += '<input type="hidden" name="u" value="'+WDN.navigation.siteHomepage+'" />';
				}
			}
			
			var widthScript = WDN.getCurrentWidthScript();
			if (widthScript == '320') {
				var mobileSearch = document.createElement('input');
				mobileSearch.id = "wdn_search_mobile";
				mobileSearch.setAttribute('name', 'format');
				mobileSearch.setAttribute('value', 'mobile');
				mobileSearch.setAttribute('type', 'hidden');
				domSearchForm.appendChild(mobileSearch);
			} else {
				
				if (WDN.hasDocumentClass('no-placeholder')) {
					WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/placeholder/jquery.placeholder.min.js'), function() {
						WDN.jQuery('#q').placeholder();
					});
				}
			}
		},
		getLocalSearch : function() {
			var link = $$('link[rel=search]');
			if (link.length && link[link.length - 1].type != 'application/opensearchdescription+xml') {
				return link[link.length - 1].href;
			}
			
			return false;
		}
	};
}();
