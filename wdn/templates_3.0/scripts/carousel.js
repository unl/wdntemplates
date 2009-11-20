/**
 * This plugin is intended for use on pages containing carousels
 * of information.
 */
WDN.carousel = function() {
	return {
		initialize : function() {
			WDN.log ('carousel initialized');
			WDN.loadCSS('wdn/templates_3.0/css/content/carousel.css');
			//WDN.loadJS('wdn/templates_3.0/scripts/plugins/infinitecarousel/jquery.infinitecarousel.js');
			WDN.carousel.startCarousel();
		},
		totalImageWidth : function() {
			var sumOfAllWidths = 0;
			sumOfAllWidths = WDN.jQuery('#carousel li img').each(function() {
				sumOfAllWidths = sumOfAllWidths + WDN.jQuery(this).width;
			});
			return sumOfAllWidths;
		},
		startCarousel : function() {
			//WDN.jQuery('#maincontent #carousel ul').css({ width: WDN.carousel.totalImageWidth });
			WDN.jQuery('#carousel').infiniteCarousel();
		}
	};
}();