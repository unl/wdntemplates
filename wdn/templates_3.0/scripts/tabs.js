WDN.tabs = function() {
	return {
		initialize : function() {
			var ie7 = document.all && navigator.appVersion.indexOf("MSIE 7.") != -1;	
			WDN.log ("tabs JS loaded");
			//Detect if the <span> is present. If not, add it
			WDN.jQuery('ul.wdn_tabs li a:not(:has(span))').each(function(){
				theHTML = WDN.jQuery(this).html();
				WDN.jQuery(this).html("<span>"+theHTML+"</span>");
			});
			//Grab the #hash in the URL in case we need it	
			if (window.location.hash) {
				var hash = window.location.hash;
				WDN.tabs.hideDiv('#'+hash);
				WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li.selected').removeClass('selected');
				WDN.jQuery('a[href='+hash+']').parent().addClass('selected');
			} else {
				var hash = false;
				if (WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li.selected').length){
					var href = WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li.selected:first a').attr('href');
				}else{
					WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li:first').addClass('selected');
					var href = WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li:first a').attr('href');
				}
				WDN.tabs.hideDiv(href);
			};
			WDN.jQuery('ul.wdn_tabs li').each(function(){
				var content = WDN.jQuery(this).children('a').text();
				var contentTitle = WDN.jQuery(this).children('a').attr('href');
				WDN.jQuery('div#'+contentTitle).prepend("<h5 class='yesprint'>"+content+"</h5>");
				return true;
			}),
			WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) a').click(function() { //do something when a tab is clicked
				WDN.jQuery(this).parent().addClass('selected').siblings().removeClass('selected');
				var href = WDN.jQuery(this).attr("href");
				if (!ie7) {
					window.location.hash = href;
				}
				WDN.tabs.hideDiv(href);
				WDN.tabs.cleanLastTab();
				return false;
			});
			WDN.tabs.cleanLastTab();
			return true;
		},
		
		hideDiv: function(theDiv) {
			WDN.jQuery('div.wdn_tabs_content > div').hide(); //hide all the content divs except the one selected
			WDN.jQuery('div'+theDiv).show();
			return true;
		},
		
		cleanLastTab: function() {
			WDN.jQuery('ul.wdn_tabs li:last-child a')
				.css({'margin-right':'-7px', 'background':"url('"+WDN.template_path+"wdn/templates_3.0/css/content/images/tabs/inactiveRightLast.png') no-repeat top right"});
			WDN.jQuery('ul.wdn_tabs li:last-child.selected a')
				.css({'background':"url('"+WDN.template_path+"wdn/templates_3.0/css/content/images/tabs/activeRight.png') no-repeat top right"});
			return true;
		}
	};
}();
	