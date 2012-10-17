WDN.feedback = (function($) {

    return {
        initialize: function() {
            WDN.feedback.ratingSetup();
        },

        ratingSetup: function() {
            WDN.log('Setting up star rating');
            $('#wdn_feedback input').click(function() {
                selectedRating = $(this).attr('value');
                WDN.log('rating='+ selectedRating);
                WDN.analytics.callTrackEvent('Page Rating', 'Rated a '+selectedRating, WDN.analytics.thisURL, selectedRating);
                var url = 'http://www1.unl.edu/comments/';
                WDN.post(
                    url,
                    {rating: selectedRating},
                    function() {}
                );
            });
        }
    };

})(WDN.jQuery);
