WDN.tabs = function() {
	return {
		initialize : function() {
		WDN.log ("tabs JS loaded");
		//start by grabbing the #hash in the URL in case we need it	
		if (window.location.hash) {
				var hash = window.location.hash;
				WDN.tabs.hideDiv('#'+hash);
				jQuery('a[href='+hash+']').parent().addClass('selected');
			} else {
				var hash = false;
				jQuery('ul.wdn_tabs:not(.disableSwitching) li:first').addClass('selected');
				var href = jQuery('ul.wdn_tabs:not(.disableSwitching) li:first a').attr('href');
				WDN.tabs.hideDiv(href);
			};
		jQuery('ul.wdn_tabs:not(.disableSwitching) a').click(function() { //do something when a tab is clicked
			jQuery(this).parent().addClass('selected').siblings().removeClass('selected');
			var href = jQuery(this).attr("href");
			window.location.hash = href;
			WDN.log(href);
			WDN.tabs.hideDiv(href);
			return false;
		});
		},
		
		hideDiv: function(theDiv) {
			WDN.log('hiding: '+theDiv);
			jQuery('ul.wdn_tabs').siblings('div[id^=tab]').hide(); //hide all the content divs expect the one selected
			jQuery('div'+theDiv).show();
		}
	};
}();
	