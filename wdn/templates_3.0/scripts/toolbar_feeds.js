WDN.toolbar_feeds = function() {
    var gobacklinkadded = false;
    /**
     * expected pluginParam is in the form of
     * { 
     *     feeds: [
     *         {
     *             url: 'http://mediahub.unl.edu/?format=xml',
     *             link: 'http://mediahub.unl.edu/',
     *             title: 'UNL Media Hub'
     *         }
     *     ]
     * }
     */
    var defaultFeeds = [
	        {
	        	url: 'http://mediahub.unl.edu/?format=xml',
	        	link: 'http://mediahub.unl.edu/',
	        	title: 'UNL Media Hub'
	        },
	        {
	        	url: 'http://newsroom.unl.edu/releases/?format=xml',
	        	link: 'http://newsroom.unl.edu/',
	        	title: 'UNL Newsroom',
	        	limit: 5
	        },
	        {
	        	url: 'http://www.huskers.com/rss.dbml?db_oem_id=100&media=news',
	        	link: 'http://www.huskers.com/',
	        	title: 'Husker Athletics News'
	        }
	    ],
	    feeds;

    return {
    	cb: [],
        initialize : function() {
        	if (feeds) {
        		return;
        	}
        	
        	var feedsParam = WDN.getPluginParam('feeds', 'feeds'),
        		$localFeed = WDN.jQuery('link[rel=alternate]'),
        		i = 0,
        		foundLocal = false;
        	
            if (!feedsParam || !feedsParam.length) {
            	feeds = defaultFeeds;
            } else {
            	feeds = feedsParam.slice(0, 3);
            }
            
            if ($localFeed.length) {
            	for (; i < feeds.length; i++) {
            		if (feeds[i].url === $localFeed[0].href) {
            			foundLocal = true;
            			break;
            		}
            	}
            	if (!foundLocal) {
            		feeds.push({
                		url: $localFeed[0].href,
                		title: $localFeed.attr('title')
                	});
            	}
            }
        },
        setupToolContent : function(contentCallback) {
        	WDN.jQuery.ajax({
            	url: WDN.getTemplateFilePath('includes/tools/feeds.html', true),
            	success: function(data) {
            		var $tempDiv = WDN.jQuery('<div/>'),
            			gridNum = 12 / feeds.length;
            		
            		WDN.jQuery.each(feeds, function(i, feed) {
            			var $feedDiv = WDN.jQuery('<div />').addClass('feed_col grid' + gridNum + (i == 0 ? ' first' : '')),
            				$feedHeading = WDN.jQuery('<h3/>').append('<a>' + feed.title + '</a><a class="rssicon" href="' + feed.url + '">RSS</a>');
            			
            			if (feed.link) {
            				$feedHeading.children('a').first().attr('href', feed.link);
            			}
            			
            			$feedDiv.append($feedHeading).append('<ul id="wdn_feed' + (i + 1) + '"/>').appendTo($tempDiv);
            			
            			WDN.toolbar_feeds.cb[i] = function(jsonData) {
            				WDN.toolbar_feeds.showRSSItems(i, jsonData);
            				// if MediaHub, bind handler
            				if (feed.url === defaultFeeds[0].url) {
            					WDN.toolbar_feeds.bindShowMediaPlayer(i);
            				}
            			};
            		});
            		
            		$tempDiv.append(data);
            		contentCallback($tempDiv.children());
            	},
            	error: function() {
            		contentCallback("An error occurred while loading this section");
            	}
            });
        },
        display : function() {
        	var yqlEndpoint = 'http://query.yahooapis.com/v1/public/yql?q=',
        		q = 'select link,description,title from rss where url=';
        	
        	for (var i = 0; i < feeds.length; i++) {
        		WDN.loadJS(yqlEndpoint + escape(q + "'" + feeds[i].url + "' limit " + (feeds[i].limit ? feeds[i].limit : 7))
    				+ '&format=json&callback=WDN.toolbar_feeds.cb[' + i + ']'
				);
        	}
        },
        showRSSItems : function(colIdx, data) {
        	var $feedList = WDN.jQuery('#wdn_feed' + (colIdx + 1)).empty(); 
            for (var i=0; i<data.query.count; i++) {
                $feedList.append('<li><a title="' 
            		+ WDN.jQuery.trim(WDN.jQuery('<div/>').html(data.query.results.item[i].description).text())
            		+ '" href="' + data.query.results.item[i].link + '">' 
            		+ data.query.results.item[i].title + '</a></li>');
            }
        },
        bindShowMediaPlayer : function(col) {
            WDN.jQuery('#wdn_feed' + (col + 1) +' a').click(function(ev){
                var raudio = /\.mp3$/,
                	rvideo = /\.(m4v|mp4|mov)$/;
                
                if (!this.href.match(raudio) && !this.href.match(rvideo)) {
                	return;
                }
                
                ev.preventDefault();
                WDN.loadCSS(WDN.getTemplateFilePath('css/content/mediaelement.css'));
                
                var self = this,
                	$this = WDN.jQuery(this), 
                	$col = $this.closest('div'),
                	$sibs = $col.siblings('.feed_col'),
                	$story = WDN.jQuery('#wdn_rss_story'),
                	$media,
                	loadPlayer = function() {
                		$story.empty();
                		WDN.jQuery('.wdn_rss_media strong', $col).text('Now Playing: ' + $this.text());
                		
                		if (self.href.match(rvideo)) {
                			$media = WDN.jQuery('<video/>').prop('autoplay', true).prop('controls', true).attr('poster', 'http://itunes.unl.edu/thumbnails.php?url=' + escape(self.href)); 
                		} else {
                			$media = WDN.jQuery('<audio/>');
                		}
                		
                		$media.attr('width', '700').attr('height', '394').attr('id', 'wdn_rss_player').attr('src', self.href).appendTo($story);
                		
                		WDN.loadJS(WDN.getTemplateFilePath('scripts/mediaelement-and-player.min.js'), function() {
                			$media.mediaelementplayer();
                		});
                	};
                
                if (!$story.is(':visible')) {
                	var oldClass = $col[0].className,
                		onComplete = function() {
                        	$col[0].className = 'grid3 first';
                        	$story.show();
                        	WDN.jQuery('<a href="#"/>').html('&larr; Go back to all feeds').appendTo('<div/>')
                        		.click(function() {
                        			$story.empty().hide();
                        			$col[0].className = oldClass;
                        			WDN.jQuery('#whatisrss').slideDown(200);
                        			$sibs.animate({ width: 'toggle' }, 600);
                        			WDN.jQuery(this).parent().remove();
                        			return false;
                        		})
                        		.parent().addClass('wdn_rss_media').prepend(WDN.jQuery('<strong/>'))
                        		.prependTo($col);
                        	loadPlayer();
                        };
                	WDN.jQuery('#whatisrss').slideUp(200);
                	
                    $sibs.each(function(i) {
                    	WDN.jQuery(this).animate({ width: 'toggle' }, 600, i === 0 ? onComplete : null);
                    });
                } else {
                	loadPlayer();
                }
            });
        }
        
    };
}();