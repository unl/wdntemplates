
WDN.carousel = function() {  
	
	return {
		initialize : function() {
			WDN.log('carousel initialized');
			WDN.loadCSS('/wdn/templates_3.0/css/content/carousel.css');
			WDN.loadJS('/wdn/templates_3.0/scripts/plugins/infinitecarousel/jquery.infinitecarousel.min.js', function () {
				WDN.jQuery('#wdn_Carousel').infiniteCarousel({imagePath: '/wdn/templates_3.0/css/content/images/carousel/'});
			});
		}
	};
}();
	