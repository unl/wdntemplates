/**
 * This plugin is adds the showcase seal to sites awarded.
 * 
 */
WDN.showcase_site = function() {
	return {
		/*
		 * List the awarded site roots here
		 * 
		 */
		awarded : [
		    {
			"site" : "ucommmeranda.unl.edu/workspace/UNL_WDNTemplates",
			"url" : "http://wdn.unl.edu/showcase/2011/01"
			},
			{
			"site" : "ucommmeranda.unl.edu/workspace/UNL_Mediahub",
			"url" : "http://wdn.unl.edu/showcase/2011/02"
			}
		],
		
		thisURL : String(window.location.hostname + window.location.pathname),
		
		initialize : function() {
			WDN.log ('showcase site initialized');
			for (var i=0; i<WDN.showcase_site.awarded.length; i++) {
				if (WDN.showcase_site.thisURL.search(WDN.showcase_site.awarded[i].site) >= 0) { //we have an awarded site
					WDN.log('we have an award');
					WDN.showcase_site.displayBadge(WDN.showcase_site.awarded[i].url);
					break; // we found an awarded site, no reason to continue looking
				}
			};
		},
		
		displayBadge : function(url) {
			WDN.jQuery('#footer_floater').addClass('showcase').click(function() {
				window.location = url;
			});
		}
	};
}();