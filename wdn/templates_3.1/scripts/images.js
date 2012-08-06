/*
* Adapt image src based on media query width
*/
 
WDN.images = (function() {

	return {
	    imageList: [],
	        
		initialize : function() {
		    var i, foundImages, width;
		    // Store the images to be swapped
		    foundImages = WDN.images.getSwappers();
	        for (i=0; i !== foundImages.length; i++) {
		        WDN.images.imageList.push(foundImages[i]);
		    };
		    // Start the swapping if needed
		    width = WDN.getCurrentWidthBreakpoint();
		    if (width > 320) {
		        WDN.images.swapSource(width);
		    }    
		},
		
		/*
		* Run a test to see if the file exists on the same host.
		* 
		* @param {string} - the path to the proposed image file.
		*/
		checkFileExistence: function(fileUrl, image) {
		    WDN.log(fileUrl);
		    var xmlHttpReq = false, self = this;
            
            if (window.XMLHttpRequest) {
                self.xmlHttpReq = new XMLHttpRequest();
            }
        
            self.xmlHttpReq.open('HEAD', fileUrl, true);
            self.xmlHttpReq.send(null);
            self.xmlHttpReq.onreadystatechange = function() {
                if (self.xmlHttpReq.readyState == 2) {
                    if (self.xmlHttpReq.status == 200) {
                        image.setAttribute('src', fileUrl)
                    } else {
                        return false;
                    }
                }
            }
		},
		
		/*
		* Get all the images based on the class 'wdn_image_swap'
		*/
		getSwappers: function() {
            if (document.getElementsByClassName) { // use native implementation if available (all except IE8)
                return document.getElementsByClassName('wdn_image_swap');
            } else { //for IE8
                return (function getElementsByClass(searchClass) {
                    var classElements = [],
                        els = document.getElementsByTagName("*"),
                        elsLen = els.length,
                        pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;
                    
                    for (i = 0, j = 0; i < elsLen; i++) {
                      if ( pattern.test(els[i].className) ) {
                          classElements[j] = els[i];
                          j++;
                      }
                    }
                    return classElements;
                })('wdn_image_swap');
            }
        },
        
        swapSource: function(newWidthBreakpoint) {
            var i, 
                pattern = new RegExp(/([a-z\-_0-9\/\:\.]*)\.(jpg|jpeg|png|gif)/i),
                sizes = new RegExp(/_(320|480|600|768|960|1040)$/i);
            for (i=0; i < WDN.images.imageList.length; i++) {
                deconstructedPath = pattern.exec(WDN.images.imageList[i].getAttribute('src'));
                //create the new URL for the image
                imagePath = deconstructedPath[1].replace(sizes, '') + '_' + newWidthBreakpoint + '.' + deconstructedPath[2];
                WDN.images.checkFileExistence(imagePath, WDN.images.imageList[i]);
            }
        },
        
		
		onResize: function(oldWidthScript, newWidthScript, oldWidthBreakpoint, newWidthBreakpoint) {
		    if (oldWidthBreakpoint !== newWidthBreakpoint) { // We changed the breakpoint, begin the process
		        WDN.images.swapSource(newWidthBreakpoint);
		    }
		}
	};
})();