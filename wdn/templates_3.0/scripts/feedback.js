WDN.feedback = function() {
	
	return {
        initialize : function() {
			//WDN.log("initialize feedback");
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/rating/jquery.rating.js', WDN.feedback.ratingSetup);
			WDN.feedback.commentSetup();
		},
		ratingSetup : function() {
			WDN.log("setting up rating");
			//jQuery('#wdn_feedback').rating().animate({opacity: 'show'}, 2000);
			try {
				WDN.jQuery('#wdn_feedback').rating();
			} catch (e) {}
		},
		commentSetup : function() {
			WDN.jQuery('#wdn_feedback_comments label').click(function(){
				WDN.jQuery(this).next().focus();
			});
			WDN.jQuery('#wdn_feedback_comments input[type=text], #wdn_feedback_comments textarea').focus(function(){
				WDN.jQuery(this).prev().hide();
			});
			WDN.jQuery('#wdn_feedback_comments textarea').keyup(
				function(event) {
					if (this.value.length > 0) {
						// Add the submit button
						WDN.jQuery('.wdn_comment_email,.wdn_comment_name,#wdn_feedback_comments input').slideDown();
					}
				}
			);
			WDN.jQuery('#wdn_feedback_comments').submit(
				function(event) {
					var comments = WDN.jQuery('#wdn_feedback_comments textarea').val();
					if (comments.split(' ').length < 4) {
						// Users must enter in at least 4 words.
						alert('Please enter more information, give me at least 4 words!');
						return false;
					}
					WDN.post(
						'http://ucommtest.unl.edu/workspace/UNL_WDN_Comments/', 
						WDN.jQuery('#wdn_feedback_comments').serialize(),
						function () {
							//WDN.analytics.callTrackEvent('Page Comment', 'Sent', window.location);
							WDN.jQuery('#wdn_feedback_comments').replaceWith('<h4>Thanks!</h4>');
						}
					);
					event.stopPropagation();
					return false;
				}
			);
		}
	};
}();