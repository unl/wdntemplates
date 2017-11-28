define(['jquery'], function($) {
    "use strict";

    var initd = false;

    var imageCls = 'wdn_image_swap',
    currentPoint,
    checkPoints = [320,480,600,768,960,1040],
    failPoint = 4,
    reImgFile = /(.*)\.(jpe?g|png|gif)$/i,
    rePointSuffix = new RegExp('_(' + checkPoints.join('|') + ')$'),

    resizeTimeout = 500,
    resizeTimer;

    function checkFileExistence(fileUrl, image) {
    	$.ajax(fileUrl, {
    		type: 'HEAD',
    		success: function() {
    			image.setAttribute('src', fileUrl);
    		}
    	});
    }

    function swapSource(newWidthBreakpoint) {
    	$('.' + imageCls).each(function() {
    		var deconstructedPath, imagePath;
    		deconstructedPath = reImgFile.exec(this.getAttribute('src'));
    		if (deconstructedPath) {
    			imagePath = deconstructedPath[1].replace(rePointSuffix, '') + '_' + newWidthBreakpoint + '.' + deconstructedPath[2];
    			checkFileExistence(imagePath, this);
    		}
    	});
    }

    function getMqPoint() {
    	var j;

    		for (j = checkPoints.length - 1; j >= 0; j--) {
    			if (matchMedia('(min-width: ' + checkPoints[j] + 'px)').matches) {
    				return checkPoints[j];
    			}
    		}

    	return checkPoints[0];
    }

	return {
		initialize : function () {
		    currentPoint = getMqPoint();
		    if (currentPoint > checkPoints[0]) {
		    	$(function() {
		    		swapSource(currentPoint);
		    	});
		    }

		    if (initd) {
		    	return;
		    }
		    initd = true;

		    $(window).resize(function() {
		    	if (resizeTimer) {
		    		clearTimeout(resizeTimer);
		    	}
		    	resizeTimer = setTimeout(function () {
		    		var newPoint = getMqPoint();
		    		if (newPoint > currentPoint) {
		    			currentPoint = newPoint;
		    			swapSource(newPoint);
		    		}
		    	}, resizeTimeout);
		    });
		}
	};
});
