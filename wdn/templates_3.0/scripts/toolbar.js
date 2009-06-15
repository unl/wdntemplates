WDN.toolbar = function() {
    var expandedHeight = 0;
    return {
        initialize : function() {
            WDN.loadCSS('wdn/templates_3.0/scripts/plugins/colorbox/colorbox.css');
            if (jQuery.browser.ie) {
                WDN.loadCSS('wdn/templates_3.0/scripts/plugins/colorbox/colorbox-ie.css');
            }
            WDN.loadJS('wdn/templates_3.0/scripts/plugins/colorbox/jquery.colorbox.js', WDN.toolbar.colorboxSetup);
            
            jQuery('#header').append('<div class="hidden"><div id="feedcontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="weathercontent"><div class="weather_col"><h3>Local Weather</h3><div id="currentcond"></div></div><div class="weather_col middle"><h3>Lincoln Forecast</h3><div id="weatherforecast"></div></div><div class="weather_twocol"><h3>Local Radar</h3><div id="showradar"><a href="http://radar.weather.gov/radar_lite.php?rid=oax&product=N0R&overlay=11101111&loop=yes"><img src="/ucomm/templatedependents/templatecss/images/transpixel.gif" /></a></div></div></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="eventscontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="pfcontent"><form onsubmit="WDN.toolbar_peoplefinder.queuePFRequest(document.getElementById(\'pq\').value,\'pfresults\'); return false;" method="get" action="http://peoplefinder.unl.edu/"><div><label for="pq">Search People:</label><input type="text" onkeyup="WDN.toolbar_peoplefinder.queuePFRequest(this.value,\'pfresults\');" name="pq" id="pq"/><img alt="progress" id="pfprogress" src="/ucomm/templatedependents/templatecss/images/transpixel.gif"/> </div></form><div class="toolResultsMask" id="pfResultsMask"><div class="toolResults" id="pfresults"/></div> </div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="cameracontent"><div class="cam_col"><h3>Nebraska Union Plaza</h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam1.jpg" alt="Plaze Cam" id="webcamuri1" /></div><div class="cam_col"><h3>Nebraska Union Rotunda</h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam2.jpg" alt="Rotunda Cam" id="webcamuri2" /></div><div class="cam_col"><h3>Nebraska East Union</h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam3.jpg" alt="East Union" id="webcamuri3" /></div></div></div>');
        },
        colorboxSetup : function() {
            WDN.log('Setting up colorbox');
            WDN.toolbar.toolTabsSetup();
            jQuery("a.feed").colorbox({width:"1002", height:"550", inline:true, href:"#feedcontent"});
            jQuery("a.weather").colorbox({width:"1002", height:"530", inline:true, href:"#weathercontent"}, WDN.toolbar.getContent("weather"));
            jQuery("a.calendar").colorbox({width:"1002", height:"550", inline:true, href:"#eventscontent"}, WDN.toolbar.getContent("events"));
            jQuery("a.directory").colorbox({width:"1002", height:"550", inline:true, href:"#pfcontent"});
            jQuery("a.camera").colorbox({width:"1002", height:"410", inline:true, href:"#cameracontent"}, WDN.toolbar.getContent("webcam")); 
        },
        getContent : function(type) {
        	eval('WDN.toolbar_'+type+'.display();');
        	jQuery("#cboxTitle").css({color:'#f2f2f2'}); //Hide the cboxTitle at the bottom
        },
        toolTabsSetup : function() {
        	jQuery('#cboxWrapper').append('<div id="tooltabs"><ul><li class="feed"><a class="feed" href="http://www1.unl.edu/feeds/">RSS Feeds</a></li><li class="weather"><a href="#" class="weather"><span>Weather</span></a></li><li class="calendar"><a href="#" class="calendar">UNL Events</a></li><li class="directory"><a href="#" class="directory">Peoplefinder</a></li><li class="camera"><a href="#" class="camera">Webcams</a></li></ul></div>');      	
        	jQuery("a.feed").click(function(){WDN.toolbar.toolTabsCurrent("feed")});
            jQuery("a.weather").click(function(){WDN.toolbar.toolTabsCurrent("weather")});
            jQuery("a.calendar").click(function(){WDN.toolbar.toolTabsCurrent("calendar")});
            jQuery("a.directory").click(function(){WDN.toolbar.toolTabsCurrent("directory")});
            jQuery("a.camera").click(function(){WDN.toolbar.toolTabsCurrent("camera")}); 
        
        },
        toolTabsCurrent : function(selected) {
        	if ( jQuery("#tooltabs li").hasClass("current") ){
        		jQuery("#tooltabs li").removeClass("current");        		
        	}
        	jQuery('#tooltabs li.'+selected+'').addClass("current");
        }
    };
}();