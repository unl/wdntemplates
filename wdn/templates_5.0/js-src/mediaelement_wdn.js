define([
	'wdn',
	'jquery',
	'plugins/mediaelement/mediaelement-and-player',
	'plugins/mediaelement/mep-feature-googleanalytics',
	'css!plugins/mediaelement/css/mediaelementplayer.min',
    'css!plugins/mediaelement/css/wdn-overrides.min'
], function(WDN, $, mejs) {
	// fix plugin path detection in built env
	mejs.MediaElementDefaults.pluginPath = WDN.getTemplateFilePath('scripts/plugins/mediaelement/', true);

	var defaultOptions = {
		videoWidth: '100%',
		videoHeight: '100%',
		audioWidth: '100%',
		toggleCaptionsButtonWhenOnlyOne: true,
		features : [
			'playpause',
			'current',
			'progress',
			'duration',
			'tracks',
			'volume',
			'fullscreen',
			'googleanalytics'
		]
	};

	return {
		initialize: function(callback) {
			var options = $.extend({}, defaultOptions, WDN.getPluginParam('mediaelement_wdn', 'options') || {});

			$(function() {
				$('video.wdn_player, audio.wdn_player').each(function() {
					$(this).mediaelementplayer(options);
				});

				if (callback) {
					callback(options);
				}
			});
		}
	};
});
