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
        	jQuery('#header').append('<div class="hidden"><div id="weathercontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="eventscontent"></div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="pfcontent"><form onsubmit="WDN.toolbar_peoplefinder.queuePFRequest(document.getElementById(\'pq\').value,\'pfresults\'); return false;" method="get" action="http://peoplefinder.unl.edu/"><div><label for="pq">Search People:</label><input type="text" onkeyup="WDN.toolbar_peoplefinder.queuePFRequest(this.value,\'pfresults\');" name="pq" id="pq"/><img alt="progress" id="pfprogress" src="/ucomm/templatedependents/templatecss/images/transpixel.gif"/> </div></form><div class="toolResultsMask" id="pfResultsMask"><div class="toolResults" id="pfresults"/></div> </div></div>');
        	jQuery('#header').append('<div class="hidden"><div id="cameracontent"><img src="http://www.unl.edu/unlpub/cam/cam1.jpg" alt="UNL Webcams" id="webcamuri" /></div></div>');
        },
        colorboxSetup : function() {
            WDN.log('Setting up colorbox');
            jQuery("#wdn_tool_links li a.feed").colorbox({width:"900", height:"550", iframe:true});
            jQuery("#wdn_tool_links li a.weather").colorbox({width:"900", height:"550", inline:true, href:"#weathercontent"}, WDN.toolbar.getContent("weather"));
            jQuery("#wdn_tool_links li a.calendar").colorbox({width:"900", height:"550", inline:true, href:"#eventscontent"}, WDN.toolbar.getContent("events"));
            jQuery("#wdn_tool_links li a.directory").colorbox({width:"900", height:"550", inline:true, href:"#pfcontent"});
            jQuery("#wdn_tool_links li a.camera").colorbox({width:"900", height:"550", inline:true, href:"#cameracontent"}, WDN.toolbar.getContent("webcam")); 
        },
        getContent : function(type) {
        	eval('WDN.toolbar_'+type+'.display();');
        	jQuery("#cboxTitle").css({color:'#f2f2f2'}); //Hide the cboxTitle at the bottom
        }
    };
}();