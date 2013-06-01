/*
* Google Analytics Plugin
* Requires
*
*/

(function($) {

$.extend(mejs.MepDefaults, {
	googleAnalyticsCategory: 'Media',
	googleAnalyticsEventPlay: 'Play',
	googleAnalyticsEventPause: 'Pause',
	googleAnalyticsEventEnded: 'Ended',
	googleAnalyticsEventTime: 'Time'
});


$.extend(MediaElementPlayer.prototype, {
	buildgoogleanalytics: function(player, controls, layers, media) {

		media.addEventListener('play', function() {
            WDN.analytics.callTrackEvent( 
				player.options.googleAnalyticsCategory, 
				player.options.googleAnalyticsEventPlay, 
				(media.title === '') ? media.src : media.title
            );
		}, false);
		
		media.addEventListener('pause', function() {
			WDN.analytics.callTrackEvent( 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventPause, 
					(media.title === '') ? media.src : media.title
			    );
			}, false);	
		
		media.addEventListener('ended', function() {
			WDN.analytics.callTrackEvent( 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventEnded, 
					(media.title === '') ? media.src : media.title
			    );
			}, false);
		
		/*
		media.addEventListener('timeupdate', function() {
			if (typeof _gaq != 'undefined') {
				_gaq.push(['_trackEvent', 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventEnded, 
					player.options.googleAnalyticsTime,
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle,
					player.currentTime
				]);
			}
		}, true);
		*/
	}
});
	
})(mejs.$);