WDN.tabs = function() {
	return {
		initialize : function() {
			var ie7 = document.all && navigator.appVersion.indexOf("MSIE 7.") != -1;	
			WDN.log ("tabs JS loaded");
			//Detect if the <span> is present. If not, add it
			WDN.jQuery('ul.wdn_tabs > li > a:not(:has(span))').each(function(){
				theHTML = WDN.jQuery(this).html();
				WDN.jQuery(this).html("<span>"+theHTML+"</span>");
			});
			
			//Grab the #hash in the URL in case we need it
			if (window.location.hash) {
				WDN.tabs.showOnlyDiv(window.location.hash);
			} else {
				var href;
				if (WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li.selected').length){
					href = WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li.selected:first a').attr('href');
				} else {
					href = WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li:first a').attr('href');
				}
				WDN.tabs.showOnlyDiv(href);
			}
			
			// Add yesprint class to list items, to act as a table of contents when printed
			WDN.jQuery('ul.wdn_tabs li').each(function(){
				var content = WDN.jQuery(this).children('a').text();
				var contentTitle = WDN.jQuery(this).children('a').attr('href');
				WDN.jQuery('div#'+contentTitle).prepend("<h5 class='yesprint'>"+content+"</h5>");
				return true;
			});
			
			// Set up the event for when a tab is clicked
			WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) a').click(function() { //do something when a tab is clicked
				var href = WDN.jQuery(this).attr("href");
				if (!ie7) {
					window.location.hash = href;
				}
				WDN.tabs.showOnlyDiv(href);
				WDN.tabs.cleanLastTab();
				return false;
			});
			
			if (WDN.jQuery('#maincontent ul.wdn_tabs li ul').length) {
				WDN.jQuery('#maincontent ul.wdn_tabs').css({'margin-bottom':'70px'});
			}
			
			WDN.tabs.cleanLastTab();
			return true;
		},
		
		showOnlyDiv: function(theDiv) {
			// Remove any selected tab class
			WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li.selected').removeClass('selected');
			
			// Hide any subtabs
			WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) ul').hide();
			
			// Add the selected class to the tab
			WDN.jQuery('ul.wdn_tabs li a[href='+theDiv+']').parents('li').addClass('selected');
			
			// Show any relevant sub-tabs
			WDN.jQuery('ul.wdn_tabs li a[href='+theDiv+']').siblings().show();
			WDN.jQuery('ul.wdn_tabs li a[href='+theDiv+']').parents('ul').show();
			
			WDN.jQuery('div.wdn_tabs_content > div').hide(); //hide all the content divs except the one selected
			WDN.jQuery('div'+theDiv).show();
			return true;
		},
		
		cleanLastTab: function() {
			WDN.jQuery('ul.wdn_tabs > li:last-child > a').css(
					{'margin-right':'-7px', 'background':"url('"+WDN.template_path+"wdn/templates_3.0/css/content/images/tabs/inactiveRightLast.png') no-repeat top right"});
			WDN.jQuery('ul.wdn_tabs > li:last-child.selected > a').css(
					{'background':"url('"+WDN.template_path+"wdn/templates_3.0/css/content/images/tabs/activeRight.png') no-repeat top right"});
			return true;
		}
	};
}();
	