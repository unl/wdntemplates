WDN.toolbar_events = function() {
	var havelocalevents = false;
	return {
		initialize : function() {

		},
		setupToolContent : function() {
			var pagelinks = document.getElementsByTagName('link');
			var relatt;
			for (i=0;i<pagelinks.length;i++) {
				relatt = pagelinks[i].getAttribute('rel');
				if (relatt=='events') {
					havelocalevents = true;
					localeventshref = pagelinks[i].getAttribute('href');
					localeventstitle = pagelinks[i].getAttribute('title');
					return '<div class="col left"><h3><span>UNL Events <em><a href="http://events.unl.edu">(See the full calendar at events.unl.edu)</a></em></span><a href="http://events.unl.edu/upcoming/?format=rss"><span class="rssicon"></span></a>&nbsp;</h3><div id="allunlevents" class="toolbarMask"></div></div><div class="col right"><h3><span>Upcoming '+localeventstitle+' Events <em><a href="'+localeventshref+'/upcoming/">(See all events)</a></em></span><a href="'+localeventshref+'/upcoming/?format=rss"><span class="rssicon"></span></a>&nbsp;</h3><div id="localsiteevents" class="toolbarMask"></div></div>';
				}
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
				calurl = localeventshref+'/upcoming/?format=hcalendar';
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
