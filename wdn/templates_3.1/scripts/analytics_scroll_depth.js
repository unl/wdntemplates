WDN.analytics_scroll_depth = function() {
    var cache, startTime, isMobile = WDN.getCurrentWidthScript() == '320';

    var scrollTimeout = null;
    function scrollEventDelay() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(WDN.analytics_scroll_depth.calculateDepth, 100);
    };

    return {
        
        initialize : function() {
            
            // Start the timer
            startTime = +new Date;
            
            // Prime the cache
            cache = [];
            
            // Send the baseline event
            WDN.analytics.callTrackEvent('Scroll Depth', 'Baseline', WDN.analytics.thisURL, null, true);
            
            // bind the scroll event
            if(window.addEventListener) {
                window.addEventListener('scroll', scrollEventDelay, false);
            } else if (window.attachEvent) { // Don't forget to support IE8
                window.attachEvent('onscroll', scrollEventDelay);
            }
            
            // For IE8 support of ECMA5 script
            if(!Array.prototype.indexOf) {
                Array.prototype.indexOf = function(needle) {
                    for(var i = 0; i < this.length; i++) {
                        if(this[i] === needle) {
                            return i;
                        }
                    }
                    return -1;
                };
            }
        },
        
        calculateMarks : function(docHeight) {
            return {
                '25%' : parseInt(docHeight * 0.25, 10),
                '50%' : parseInt(docHeight * 0.50, 10),
                '75%' : parseInt(docHeight * 0.75, 10),
                // 1px cushion to trigger 100% event in iOS
                '100%': docHeight - 1
            };
        },
        
        calculateDepth : function() {
            /*
            * We calculate document and window height on each scroll event to
            * account for dynamic DOM changes.
            */
            var docHeight = document.height || document.documentElement.scrollHeight,
            
                // Determine the window height. IE8 needs the document.body.clientHeight
                winHeight = window.innerHeight || document.body.clientHeight, 
                
                // Determine the current offset. IE8 needs the document.body.scrollTop
                yOffset = window.pageYOffset || document.body.scrollTop,
                
                // Determine the distance scrolled
                scrollDistance = yOffset + winHeight,
                
                // Recalculate percentage marks
                marks = WDN.analytics_scroll_depth.calculateMarks(docHeight),
                
                // Timing
                timing = +new Date - startTime;
            
            // If we're done tracking then remove the event
            if (cache.length >= 4) {
                if (window.removeEventListener) {
                    window.removeEventListener('scroll', scrollEventDelay, false);
                } else if (window.detachEvent) { // Since we're supporting IE8
                    window.detachEvent('onscroll', scrollEventDelay);
                }
                return;
            }
            
            WDN.analytics_scroll_depth.checkMarks(marks, scrollDistance, timing);
        },
        
        checkMarks : function(marks, scrollDistance, timing) {
            // Loop through the marks
            for (var key in marks) {
                
                // Make sure we haven't tracked this mark and that we've scrolled far enough
                if (cache.indexOf(key) === -1 && scrollDistance >= marks[key]) {
                    WDN.analytics.callTrackEvent('Scroll Depth', key, WDN.analytics.thisURL, parseInt(key)/100, true);
                    _gaq.push(['wdn._trackTiming', 'Scroll Depth', key, timing, WDN.analytics.thisURL, 100]);
                    
                    // track in the mobile tracking account
                    if (isMobile) {
                        _gaq.push(['m._trackTiming', 'Scroll Depth', key, timing, WDN.analytics.thisURL, 100]);
                    }
                    
                    // attempt to track in local site analytics
                    try {
                    	if (WDN.analytics.isDefaultTrackerReady()) {
                    		var pageSuccess = _gaq.push(['_trackTiming', 'Scroll Depth', key, timing, WDN.analytics.thisURL, 100]);
                    	} else {
                    		throw "Default Tracker Account Not Set";
                    	}
                    } catch(e) {
                    	WDN.log("Event timing for local site didn't work.");
                    }
                    
                    // Keep track of what we tracked so we don't retrack
                    cache.push(key);
                }
            }
        }
    };

}();
