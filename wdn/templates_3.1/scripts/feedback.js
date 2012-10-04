WDN.feedback = function() {

	return {
        initialize : function() {
			//WDN.log("initialize feedback");
			WDN.feedback.ratingSetup();
			WDN.feedback.commentSetup();
		},
		ratingSetup : function() {
			WDN.log("setting up rating");
			WDN.jQuery('#wdn_feedback input').click(function() {
			    selectedRating = WDN.jQuery(this).attr('value');
			    WDN.log("rating="+ selectedRating);
			    WDN.analytics.callTrackEvent('Page Rating', 'Rated a '+selectedRating, WDN.analytics.thisURL, selectedRating);
			    var url = 'http://www1.unl.edu/comments/';
			    WDN.post(
			    		url,
			    		{ rating: selectedRating },
			    		function() {
			    		}
			    );
			});
		}
	};
}();
