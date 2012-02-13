/*
 *
 * Function to create a carousel. See http://www1.unl.edu/wdn/wiki/Carousel for more details
 *
 */
WDN.carousel = (function() {

	return {
		pluginOptions : {},
		
		supportJSON : false,

		imageHeight : function() {
			return WDN.jQuery('#wdn_Carousel img').height();
		},

		imageWidth : function() {
			return WDN.jQuery('#wdn_Carousel img').width();
		},

		initialize : function() {
			WDN.log('carousel initialized');
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/blueberry/blueberry.css'));
			WDN.loadJQuery(function(){
				WDN.carousel.cleanUpDeprecated();
				WDN.jQuery('#wdn_Carousel img').removeAttr('width').removeAttr('height');
				if (WDN.carousel.supportJSON) {
					WDN.loadJS(WDN.carousel.supportJSON);
				} else {
					WDN.carousel.start();
				}
			});
		},

		cleanUpDeprecated : function() {
			if (!WDN.jQuery('#wdn_Carousel .slides').length) {
				WDN.jQuery('#wdn_Carousel > ul:first > li > a, #wdn_Carousel > ul:first > li > img').addClass('toMove');
				WDN.jQuery('#wdn_Carousel > ul:first').addClass('slides').children('li').each(function() {
					WDN.jQuery(this).wrapInner('<div />');
					WDN.jQuery(this).find('.toMove').insertBefore(WDN.jQuery(this).children('div')).removeClass('toMove');
					WDN.jQuery(this).find('p').addClass('caption'); 
				});
				if (WDN.jQuery('#wdn_Carousel').parent('.zenbox').length) {
					WDN.jQuery('#wdn_Carousel').unwrap();
				}
			}
		},

		start : function() {
			WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/blueberry/blueberry.js'), function() {
				WDN.jQuery('#wdn_Carousel').blueberry(WDN.carousel.pluginOptions);
			});
		},

		buildFoundation : function(data) { //we've grabbed the JSON
			 //now find out how many items exist
			totalObjects = data.length;
			startingObject = Math.floor(Math.random()*(totalObjects + 1)); //we'll randomly start at any given object.
			remainingObjects = (WDN.carousel.numberToDisplay -1) - (totalObjects - startingObject); //this will let us know how many remain to be looped through. We subtract 1 from the numberToDisplay because we expect one to already be on the page.
			WDN.log('remainingObjects: '+remainingObjects);
			for (var i=startingObject; i<totalObjects; i++) { //loop through the objects starting with the random one
				WDN.jQuery("#wdn_Carousel ul").prepend('<li><div><img src="'+data[i].img+'" height="'+WDN.carousel.imageHeight()+'" width="'+WDN.carousel.imageWidth()+'" /><p>'+data[i].title +'<a href="'+data[i].link+'">'+data[i].linktext+'</a></p></div>');
				if (i>=(startingObject + WDN.carousel.numberToDisplay - 2)) {
					break;
				}
			}
			if (remainingObjects > 0) { //now let's go back to the begining and grab more objects to fill in for the remaining spots.
				for (var j=0; j<remainingObjects; j++) {
					WDN.jQuery("#wdn_Carousel ul").prepend('<li><div><img src="'+data[j].img+'" height="'+WDN.carousel.imageHeight()+'" width="'+WDN.carousel.imageWidth()+'" /><p>'+data[j].title +'<a href="'+data[j].link+'">'+data[j].linktext+'</a></p></div>');
				}
			}
			WDN.carousel.start();
		}
	};
})();
