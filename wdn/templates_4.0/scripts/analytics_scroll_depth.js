define(['wdn', 'analytics'], function(WDN, analytics) {
    var cache, startTime, scrollTimeout = null, 
    evt = 'Scroll Depth', onEvt = 'scroll',
    gaTiming = '_trackTiming';
    
    function calculateMarks(elHeight, elOffset) {
        return {
            '25%' : elOffset + parseInt(elHeight * 0.25, 10),
            '50%' : elOffset + parseInt(elHeight * 0.50, 10),
            '75%' : elOffset + parseInt(elHeight * 0.75, 10),
            '100%': elOffset + elHeight
        };
    };
    
    function checkMarks(marks, scrollDistance, timing) {
    	var here = String(window.location);
        // Loop through the marks
        for (var key in marks) {
            
            // Make sure we haven't tracked this mark and that we've scrolled far enough
            if (cache.indexOf(key) === -1 && scrollDistance >= marks[key]) {
            	analytics.callTrackEvent(evt, key, here, parseInt(key), true);
                _gaq.push(['wdn.' + gaTiming, evt, key, timing, here, 100]);
                
                // attempt to track in local site analytics
                try {
                	if (analytics.isDefaultTrackerReady()) {
                		var pageSuccess = _gaq.push([gaTiming, evt, key, timing, here, 100]);
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
    };
    
    function calculateDepth() {
    	 /*
          * We calculate #maincontent and window height on each scroll event to account for dynamic DOM changes.
          */
         var maincontent = document.getElementById('maincontent'),

             // Determine the height of #maincontent                
             elemHeight = maincontent.offsetHeight,
         
             // Determine the window height. IE8 needs the document.body.clientHeight
             winHeight = window.innerHeight || document.body.clientHeight, 
             
             // Determine the current offset. IE8 needs the document.body.scrollTop
             yOffset = window.pageYOffset || document.body.scrollTop,
             
             // Determine how far down the page #maincontent begins
             elemOffset = maincontent.getBoundingClientRect().top + yOffset,
             
             // Determine the distance scrolled
             scrollDistance = yOffset + winHeight,
             
             // Recalculate percentage marks
             marks = calculateMarks(elemHeight, elemOffset),
             
             // Timing
             timing = +new Date - startTime;

         // If we're done tracking then remove the event
         if (cache.length >= 4) {
             if (window.removeEventListener) {
                 window.removeEventListener(onEvt, scrollEventDelay, false);
             } else if (window.detachEvent) { // Since we're supporting IE8
                 window.detachEvent('on' + onEvt, scrollEventDelay);
             }
             return;
         }
         
         checkMarks(marks, scrollDistance, timing);
    };
    
    function scrollEventDelay() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(calculateDepth, 100);
    };

    return {
        
        initialize : function() {
            
            // Start the timer
            startTime = +new Date;
            
            // Prime the cache
            cache = [];
            
            // bind the scroll event
            if(window.addEventListener) {
                window.addEventListener(onEvt, scrollEventDelay, false);
            } else if (window.attachEvent) { // Don't forget to support IE8
                window.attachEvent('on' + onEvt, scrollEventDelay);
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
        }
    };
});
