WDN.toolbar_feeds = function() {
    return {
    	feedAddress : false,
        initialize : function() {
    		var localRSS = WDN.toolbar_feeds.hasLocalRSS();
			if (localRSS) {
				WDN.toolbar_feeds.feedAddress = localRSS; 
			}
        },
        hasLocalRSS : function() {
        	// Scan for link with rel="*alternate*"
        	return 'http://www1.unl.edu/mediahub/?format=xml';
        	return false;
        },
        setupToolContent : function() {
        	// This is where your tool's content resides
        	return '<div class="col"><h3>RSS Feed</h3><ul id="wdn_feed_items"></ul></div>';
        },
        display : function() {
        	
        	WDN.loadJS('http://query.yahooapis.com/v1/public/yql?q=select+link%2Ctitle+from+rss+where+url%3D%27'+escape(WDN.toolbar_feeds.feedAddress)+'%27+limit+3&format=json&callback=WDN.toolbar_feeds.showBlogPosts');
        },
        showBlogPosts : function(data) {
        	for (var i=0; i<data.query.count; i++) {
                jQuery("#wdn_feed_items").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a></li>");
            }
        }
    };
}();