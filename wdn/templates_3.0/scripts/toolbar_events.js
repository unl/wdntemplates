WDN.toolbar_events = function() {
	var havelocalevents = false;
	return {
		initialize : function() {
		
		},
		setupToolContent : function() {
			if (WDN.jQuery('link[rel=events]').attr('href') != null) {
				havelocalevents = true;
				return '<div class="col left"><h3><span>UNL Events <em><a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></em></span><a href="http://events.unl.edu/upcoming/?format=rss"><span class="rssicon"></span></a>&nbsp;</h3><div id="allunlevents" class="toolbarMask"></div></div><div class="col right"><h3><span>Upcoming '+WDN.jQuery('link[rel=events]').attr('title')+' Events <em><a href="'+WDN.jQuery('link[rel=events]').attr('href')+'/upcoming/">(See all events)</a></em></span><a href="'+WDN.jQuery('link[rel=events]').attr('href')+'/upcoming/?format=rss"><span class="rssicon"></span></a>&nbsp;</h3><div id="localsiteevents" class="toolbarMask"></div></div>';
			}
			return '<div class="col left"><h3><span>UNL Events <em><a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></em></span><a href="http://events.unl.edu/upcoming/?format=rss"><span class="rssicon"></span></a>&nbsp;</h3><div id="allunlevents" class="toolbarMask"></div></div><div class="col right"><h3><span>Upcoming UNL Events <em><a href="http://events.unl.edu/upcoming/">(See all events)</a></em></span><a href="http://events.unl.edu/upcoming/?format=rss"><span class="rssicon"></span></a>&nbsp;</h3><div id="localsiteevents" class="toolbarMask"></div></div>';
		},
		display : function() {
			if (havelocalevents) {
				WDN.jQuery('#toolbar_events .col.left').css({width:"460px", padding:"0 10px 0 0"});
			}
			WDN.toolbar_events.getCalendarResults();
		},
		getCalendarResults : function() {
			var calurl = "http://events.unl.edu/?format=hcalendar";
			WDN.get(calurl, null, WDN.toolbar_events.updateCalendarResults);
			if (havelocalevents) {
				calurl = WDN.jQuery('link[rel=events]').attr('href')+'/upcoming/?format=hcalendar';
				WDN.get(calurl, null, WDN.toolbar_events.updateLocalCalendarResults);
			}
			
		},
		updateCalendarResults : function(data, textStatus) {
			if (textStatus == 'success') {
				document.getElementById("allunlevents").innerHTML = data;
			} else {
				document.getElementById("allunlevents").innerHTML = 'Error loading results.';
			}
		},
		updateLocalCalendarResults : function(data, textStatus) {
			if (textStatus == 'success') {
				document.getElementById("localsiteevents").innerHTML = data;
			} else {
				document.getElementById("localsiteevents").innerHTML = 'Error loading results.';
			}
		}
	};
}();
