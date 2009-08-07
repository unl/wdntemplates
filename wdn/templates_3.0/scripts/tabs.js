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
		jQuery('ul.wdn_tabs li').each(function(){
			var content = jQuery(this).children('a').text();
			var contentTitle = jQuery(this).children('a').attr('href');
			jQuery('div#'+contentTitle).prepend("<h5 class='yesprint'>"+content+"</h5>");
		}),
		jQuery('ul.wdn_tabs:not(.disableSwitching) a').click(function() { //do something when a tab is clicked
			jQuery(this).parent().addClass('selected').siblings().removeClass('selected');
			var href = jQuery(this).attr("href");
			window.location.hash = href;
			WDN.tabs.hideDiv(href);
			return false;
		});
		},
		
		hideDiv: function(theDiv) {
			jQuery('div.wdn_tabs_content div').hide(); //hide all the content divs expect the one selected
			jQuery('div'+theDiv).show();
		}
	};
}();
	