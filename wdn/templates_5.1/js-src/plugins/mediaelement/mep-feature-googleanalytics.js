define(['plugins/mediaelement/mediaelement-and-player', 'jquery', 'analytics'], function(mejs, $, wdn_ga) {
	$.extend(mejs.MepDefaults, {
		googleAnalyticsTitle: '',
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
					player.options.googleAnalyticsTitle || media.title || player.currentSrc
	            );
			}, false);

			media.addEventListener('pause', function() {
				wdn_ga.callTrackEvent(
						player.options.googleAnalyticsCategory,
						player.options.googleAnalyticsEventPause,
						player.options.googleAnalyticsTitle || media.title || player.currentSrc
				    );
				}, false);

			media.addEventListener('ended', function() {
				wdn_ga.callTrackEvent(
						player.options.googleAnalyticsCategory,
						player.options.googleAnalyticsEventEnded,
						player.options.googleAnalyticsTitle || media.title || player.currentSrc
				    );
				}, false);
		}
	});
});
