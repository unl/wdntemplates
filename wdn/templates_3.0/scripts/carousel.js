/*
 * 
 * Function to create a carousel. See http://www1.unl.edu/wdn/wiki/Carousel for more details
 * 
 */
WDN.carousel = function() {  
	
	return {
		supportJSON : false,
		
		numberToDisplay : 5,
		
		displayThumbnails : true,
		
		textholderHeight : .15,
		
		imageHeight : function(){
			return WDN.jQuery('#wdn_Carousel img').attr("height");
		},
		
		imageWidth : function(){
			return WDN.jQuery('#wdn_Carousel img').attr("width");
		},
		
		initialize : function() {
			WDN.log('carousel initialized');
			WDN.loadCSS('/wdn/templates_3.0/css/content/carousel.css');
			WDN.loadJQuery(function(){
				if (WDN.carousel.supportJSON) {
					WDN.loadJS(WDN.carousel.supportJSON);
				} else {
					WDN.carousel.start();
				}
			});
		},
		
		start : function() {
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/infinitecarousel/jquery.infinitecarousel.min.js', function () {
				WDN.jQuery('#wdn_Carousel').infiniteCarousel({imagePath: '/wdn/templates_3.0/css/content/images/carousel/', 
				displayThumbnails: WDN.carousel.displayThumbnails, textholderHeight: WDN.carousel.textholderHeight
				});
			});
		},
		
		buildFoundation : function(data) { //we've grabbed the JSON
			 //now find out how many items exist
			totalObjects = data.length;
			WDN.log('totalObjects: '+totalObjects);
			startingObject = Math.floor(Math.random()*(totalObjects + 1)); //we'll randomly start at any given object.
			WDN.log('startingObject: '+startingObject);
			remainingObjects = (WDN.carousel.numberToDisplay -1) - (totalObjects - startingObject); //this will let us know how many remain to be looped through. We subtract 1 from the numberToDisplay because we expect one to already be on the page.
			WDN.log('remainingObjects: '+remainingObjects);
			for (var i=startingObject; i<totalObjects; i++) { //loop through the objects starting with the random one
				WDN.log('first loop: '+data[i].img);
				WDN.jQuery("#wdn_Carousel ul").prepend('<li><img src="'+data[i].img+'" height="'+WDN.carousel.imageHeight()+'" width="'+WDN.carousel.imageWidth()+'" /><p>'+data[i].title +'<a href="'+data[i].link+'">'+data[i].linktext+'</a></p>');
				if (i>=(startingObject + WDN.carousel.numberToDisplay - 2)) {
					break;
				}
			}
			if (remainingObjects > 0) { //now let's go back to the begining and grab more objects to fill in for the remaining spots.
				for (var j=0; j<remainingObjects; j++) {
					WDN.log('second loop: '+data[j].img);
					WDN.jQuery("#wdn_Carousel ul").prepend('<li><img src="'+data[j].img+'" height="'+WDN.carousel.imageHeight()+'" width="'+WDN.carousel.imageWidth()+'" /><p>'+data[j].title +'<a href="'+data[j].link+'">'+data[j].linktext+'</a></p>');
				}
			}
			WDN.carousel.start();
			
		}
	};
}();
	