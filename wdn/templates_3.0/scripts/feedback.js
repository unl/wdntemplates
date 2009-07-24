WDN.feedback = function() {
	
	return {
        initialize : function() {
			//WDN.log("initialize feedback");
			WDN.loadCSS('wdn/templates_3.0/scripts/plugins/rating/rating.css');
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/rating/jquery.rating.js', WDN.feedback.ratingSetup);
			WDN.feedback.commentSetup();
		},
		ratingSetup : function() {
			WDN.log("setting up rating");
			//jQuery('#wdn_feedback').rating().animate({opacity: 'show'}, 2000);
			jQuery('#wdn_feedback').rating();
		},
		commentSetup : function() {
			jQuery('#wdn_feedback_comments textarea').keyup(
				function(event) {
					if (this.value.length > 0) {
						// Add the submit button
						jQuery('#wdn_feedback_comments input').css({display:'block'});
					}
				}
			);
			jQuery('#wdn_feedback_comments').submit(
				function(event) {
					var comments = jQuery('#wdn_feedback_comments textarea').val();
					WDN.post('http://www1.unl.edu/comments/', {comment:comments});
					jQuery('#wdn_feedback_comments').replaceWith('<h4>Thanks!</h4>');
					event.stopPropagation();
					return false;
				}
			);
		}
	};
}();