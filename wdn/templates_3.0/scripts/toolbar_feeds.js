WDN.toolbar_feeds = function() {
	var localRSS = false;
	var localRSSTitle;
	var wehaveinsertedthelocalrsshtml = false;
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
        	return '<div class="col col1"><h3><span><a href="'+WDN.toolbar_feeds.feedSite1+'">'+WDN.toolbar_feeds.feedName1+'</a></span><a href="'+WDN.toolbar_feeds.feedAddress1+'"><span class="rssicon"></span></a></h3><ul id="wdn_feed_col1"></ul></div><div class="col col2"><h3><span><a href="'+WDN.toolbar_feeds.feedSite2+'">'+WDN.toolbar_feeds.feedName2+'</a></span><a href="'+WDN.toolbar_feeds.feedAddress2+'"><span class="rssicon"></span></a></h3><ul id="wdn_feed_col2"></ul></div><div class="col col3"><h3><span><a href="'+WDN.toolbar_feeds.feedSite3+'">'+WDN.toolbar_feeds.feedName3+'</a></span><a href="'+WDN.toolbar_feeds.feedAddress3+'"><span class="rssicon"></span></a></h3><ul id="wdn_feed_col3"></ul></div>';
        },
        display : function() {
        	if (localRSS) {
        		if (wehaveinsertedthelocalrsshtml == false) {
        			jQuery('#toolbar_feeds').append('<div class="col col4"><h3><span>'+localRSSTitle+'</span><a href="'+WDN.toolbar_feeds.feedAddressLocal+'"><span class="rssicon"></span></a></h3><ul id="wdn_feed_local"></ul></div>');
        			wehaveinsertedthelocalrsshtml = true;
        		}
            	jQuery('#toolbar_feeds').append('<div id="wdn_rss_story"><h3>Story</h3><div id="wdn_rss_story_content"></div></div>');
        		jQuery('#toolbar_feeds .col.col1').css({width:"220px"});
        		jQuery('#toolbar_feeds .col.col2').css({width:"220px"});
        		jQuery('#toolbar_feeds .col.col3').css({width:"220px", padding:"0 10px 0 10px"});
        		WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddressLocal)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPostsLocal');
        	}
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress1)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts1');
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress2)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts2');
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress3)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts3');
        },
        showPosts1 : function(data) {
        	WDN.toolbar_feeds.showRSSItems('#wdn_feed_col1', data);
			WDN.toolbar_feeds.onClickWeMove(1);
        },
        showPosts2 : function(data) {
        	WDN.toolbar_feeds.showRSSItems('#wdn_feed_col2', data);
        	WDN.toolbar_feeds.onClickWeMove(2);
        },
        showPosts3 : function(data) {
        	WDN.toolbar_feeds.showRSSItems('#wdn_feed_col3', data);
        	WDN.toolbar_feeds.onClickWeMove(3);
        },
        showPostsLocal : function(data) {
        	WDN.toolbar_feeds.showRSSItems('#wdn_feed_local', data);
        	WDN.toolbar_feeds.onClickWeMove(4);
        },
        showRSSItems : function(ul_id, data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery(ul_id).append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
            }
        },
        onClickWeMove : function(col) {
        	jQuery('#toolbar_feeds div.col'+col+' a').click(function(ev){
        		ev.preventDefault();

        	//	jQuery("#wdn_rss_story_content").load("wdn/templates_3.0/scripts/rssStorySniffer.php?u="+WDN.toAbs(this.href, window.location)+"");       		
        		WDN.toolbar_feeds.getStory("http://ucommrasmussen.unl.edu/workspace/UNL_WDNTemplates/wdn/templates_3.0/scripts/rssStorySniffer.php?u="+WDN.toAbs(this.href, window.location)+"&col="+col+"");
        		
        		
        		
        		
            	jQuery('#toolbar_feeds div#wdn_rss_story').slideUp("slow");
        		
        		jQuery('#toolbar_feeds div').slideUp("slow");
        		jQuery('#toolbar_feeds div.col'+col+'').slideDown("slow", function(){jQuery('#toolbar_feeds div#wdn_rss_story').slideDown();});
            	
        	});
        }, 
        getStory : function(url) {
        	story_request.open("GET", url, true);
        	story_request.onreadystatechange = WDN.toolbar_feeds.updateStory;
        	story_request.send(null);
        },
        updateStory : function() {
        	if (story_request.readyState == 4) {
        		if (story_request.status == 200) {
        			document.getElementById("wdn_rss_story_content").innerHTML = story_request.responseText;
        		} else {
        			document.getElementById("wdn_rss_story").innerHTML = 'Error loading story.';
        		}
        	}
        	wait = false;
        	story_request = new WDN.proxy_xmlhttp();
        }
        
        
    };
}();