WDN.feedback = function() {
	
	return {
        initialize : function() {
			//WDN.log("initialize feedback");
			WDN.loadCSS('wdn/templates_3.0/scripts/plugins/rating/rating.css');
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/rating/jquery.rating.js', WDN.feedback.ratingSetup);
		},
		ratingSetup : function() {
			WDN.log("setting up rating");
			//jQuery('#wdn_feedback').rating().animate({opacity: 'show'}, 2000);
			jQuery('#wdn_feedback').rating();
		}
	};
}();