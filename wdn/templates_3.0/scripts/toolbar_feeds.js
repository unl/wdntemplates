WDN.toolbar_feeds = function() {
	var localRSS = false;
	var localRSSTitle;
	var wehaveinsertedthelocalrsshtml = false;
	var appendWhatIsRSS = false;
    var story_request = new WDN.proxy_xmlhttp();
    return {
    	feedAddress1 : 'http://www1.unl.edu/mediahub/?format=xml',
    	feedSite1 : 'http://www1.unl.edu/mediahub/',
    	feedName1 : 'UNL Media Hub',
    	feedAddress2 : 'http://newsroom.unl.edu/releases/?format=xml',
    	feedSite2 : 'http://newsroom.unl.edu/',
    	feedName2 : 'UNL Newsroom',
    	feedAddress3 : 'http://www.huskers.com/rss.dbml?db_oem_id=100&media=news',
    	feedSite3 : 'http://www.huskers.com/',
    	feedName3 : 'Husker Athletics News',
    	feedAddressLocal : false,
        initialize : function() {
    		localRSS = WDN.toolbar_feeds.hasLocalRSS();
			if (localRSS) {
				WDN.toolbar_feeds.feedAddressLocal = localRSS; 	
			}
        },
        hasLocalRSS : function() {
        	var pagelinks = document.getElementsByTagName('link');
        	for (var i=0;i<pagelinks.length;i++) {
        	    relatt = pagelinks[i].getAttribute('rel');
        	    if (relatt=='alternate') {
        	    	localRSSTitle = pagelinks[i].getAttribute('title');
        	    	return pagelinks[i].getAttribute('href');
        	    }
        	}
        	return false;
        },
        setupToolContent : function() {
        	// This is where your tools content resides
        	return '<div class="col col1"><h3><span><a href="'+WDN.toolbar_feeds.feedSite1+'">'+WDN.toolbar_feeds.feedName1+'</a></span><a href="'+WDN.toolbar_feeds.feedAddress1+'"><span class="rssicon"></span></a></h3><div class="toolbarMask"><ul id="wdn_feed_col1"></ul></div></div><div class="col col2"><h3><span><a href="'+WDN.toolbar_feeds.feedSite2+'">'+WDN.toolbar_feeds.feedName2+'</a></span><a href="'+WDN.toolbar_feeds.feedAddress2+'"><span class="rssicon"></span></a></h3><div class="toolbarMask"><ul id="wdn_feed_col2"></ul></div></div><div class="col col3"><h3><span><a href="'+WDN.toolbar_feeds.feedSite3+'">'+WDN.toolbar_feeds.feedName3+'</a></span><a href="'+WDN.toolbar_feeds.feedAddress3+'"><span class="rssicon"></span></a></h3><div class="toolbarMask"><ul id="wdn_feed_col3"></ul></div></div>';
        },
        display : function() {
        	if (localRSS) {
        		if (wehaveinsertedthelocalrsshtml == false) {
        			jQuery('#toolbar_feeds').append('<div class="col col4"><h3><span>'+localRSSTitle+'</span><a href="'+WDN.toolbar_feeds.feedAddressLocal+'"><span class="rssicon"></span></a></h3><div class="toolbarMask"><ul id="wdn_feed_local"></ul></div></div>');
        			wehaveinsertedthelocalrsshtml = true;
        		}
        		jQuery('#toolbar_feeds .col.col1').css({width:"220px"});
        		jQuery('#toolbar_feeds .col.col2').css({width:"220px"});
        		jQuery('#toolbar_feeds .col.col3').css({width:"220px", padding:"0 10px 0 10px"});
        		WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Cdescription%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddressLocal)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPostsLocal');
        	}
        	if (appendWhatIsRSS==false) {
        		jQuery('#toolbar_feeds').append('<div id="wdn_rss_story"><div id="wdn_rss_story_content"></div></div>');
        		jQuery('#toolbar_feeds').append('<div id="whatisrss"><span class="toolbarAddRSSIcon">What is &nbsp;&nbsp;&nbsp;&nbsp;</span><span>&nbsp;?</span>RSS, or Rich Site Summary, is an open-standard XML format used to publish frequently updated works such as blog entries, news headlines, audio, and video. You can subscribe to these feeds by using a news reader program. The application connects to the news services at preset intervals and downloads new items as they are published.</div>');
        	}
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Cdescription%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress1)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts1');
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Cdescription%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress2)+'%27+limit+5&format=json&callback=WDN.toolbar_feeds.showPosts2');
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Cdescription%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress3)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts3');
        },
        showPosts1 : function(data) {
        	WDN.toolbar_feeds.showRSSItems('wdn_feed_col1', data);
        	WDN.toolbar_feeds.onClickWeMove(1);
        },
        showPosts2 : function(data) {
        	WDN.toolbar_feeds.showRSSItems('wdn_feed_col2', data);
        },
        showPosts3 : function(data) {
        	WDN.toolbar_feeds.showRSSItems('wdn_feed_col3', data);
        },
        showPostsLocal : function(data) {
        	WDN.toolbar_feeds.showRSSItems('wdn_feed_local', data);
        },
        showRSSItems : function(ul_id, data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery('#'+ul_id+'').append("<li><a tooltip='"+jQuery('<div/>').text(data.query.results.item[i].description).html()+"' href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
        	}
        	WDN.tooltip.tooltipSetup(ul_id);
        },
        onClickWeMove : function(col) {
        	jQuery('#toolbar_feeds ul#wdn_feed_col'+col+' a').click(function(ev){
        		ev.preventDefault();

        		//jQuery('#wdn_rss_story_title').empty();
        		jQuery('#wdn_rss_story_content').empty();

        		jQuery('#whatisrss').hide();
        		jQuery('#toolbar_feeds div.col2').slideUp("slow");
        		jQuery('#toolbar_feeds div.col3').slideUp("slow");
        		jQuery('#toolbar_feeds div.col4').slideUp("slow", function(){
        			jQuery('#toolbar_feeds .col.col1').css({width:"220px"}); //in case the first column was set as one of three columns we resize it to it's 1/4 size
        			jQuery('#toolbar_feeds div#wdn_rss_story').show();
        			});
        		
        		//jQuery('#wdn_rss_story_title').append('title');
        		jQuery('#wdn_rss_story_content').append('<div class="content_holder" id="preview_holder"><div class="unl_liquid_pictureframe"><div class="unl_liquid_pictureframe_inset"><object id="preview" height="400" width="700"><param value="true" name="allowfullscreen"></param><param value="always" name="allowscriptaccess"></param><embed src="http://www.unl.edu/ucomm/templatedependents/templatesharedcode/scripts/components/mediaplayer/player.swf?file='+jQuery(this).attr("href")+'&amp;image=http://itunes.unl.edu/thumbnails.php?url='+jQuery(this).attr("href")+'&amp;volume=100&amp;autostart=false" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="400" width="700"></embed></object><span class="unl_liquid_pictureframe_footer"></span></div></div></div>');
        		  
        		
            	
        	});
        }
        
    };
}();