/*
* Google Analytics Plugin
* Requires
*
*/

define(['analytics'], function(wdn_ga) {
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
				wdn_ga.callTrackEvent( 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventPlay, 
					(media.title === '') ? media.src : media.title
	            );
			}, false);
			
			media.addEventListener('pause', function() {
				wdn_ga.callTrackEvent( 
						player.options.googleAnalyticsCategory, 
						player.options.googleAnalyticsEventPause, 
						(media.title === '') ? media.src : media.title
				    );
				}, false);	
			
			media.addEventListener('ended', function() {
				wdn_ga.callTrackEvent( 
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
});