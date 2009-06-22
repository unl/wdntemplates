WDN.toolbar_feeds = function() {
	var localRSS = false;
	var wehaveinsertedthelocalrsshtml = false;
    return {
    	feedAddress1 : 'http://www1.unl.edu/mediahub/?format=xml',
    	feedName1 : 'UNL Media Hub',
    	feedAddress2 : 'http://newsroom.unl.edu/releases/?&format=xml',
    	feedName2 : 'UNL Newsroom',
    	feedAddress3 : 'http://www.huskers.com/rss.dbml?db_oem_id=100&media=news',
    	feedName3 : 'Husker Athletics News',
    	feedAddressLocal : false,
    	feedNameLocal : 'Feed From This Site',
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
        	    	return pagelinks[i].getAttribute('href');
        	    }
        	}
        	return false;
        },
        setupToolContent : function() {
        	// This is where your tools content resides
        	return '<div class="col left"><h3>'+WDN.toolbar_feeds.feedName1+'</h3><ul id="wdn_feed_col1"></ul></div><div class="col middle1"><h3>'+WDN.toolbar_feeds.feedName2+'</h3><ul id="wdn_feed_col2"></ul></div><div class="col middle2"><h3>'+WDN.toolbar_feeds.feedName3+'</h3><ul id="wdn_feed_col3"></ul></div>';
        },
        display : function() {
        	if(localRSS)
        	{
        		if(wehaveinsertedthelocalrsshtml == false)
        		{
        			jQuery('#toolbar_feeds').append('<div class="col right"><h3>'+WDN.toolbar_feeds.feedNameLocal+'</h3><ul id="wdn_feed_local"></ul></div>');
        			wehaveinsertedthelocalrsshtml = true;
        		}
        		jQuery('#toolbar_feeds .col.left').css({width:"220px"});
        		jQuery('#toolbar_feeds .col.middle1').css({width:"220px"});
        		jQuery('#toolbar_feeds .col.middle2').css({width:"220px", padding:"0 10px 0 10px"});
        		WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddressLocal)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPostsLocal');
        	}
        	else {}
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress1)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts1');
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress2)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts2');
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress3)+'%27+limit+7&format=json&callback=WDN.toolbar_feeds.showPosts3');
        },
        showPosts1 : function(data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery("#wdn_feed_col1").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
            }
        },
        showPosts2 : function(data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery("#wdn_feed_col2").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
            }
        },
        showPosts3 : function(data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery("#wdn_feed_col3").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
            }
        },
        showPostsLocal : function(data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery("#wdn_feed_local").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
            }
        }
    };
}();