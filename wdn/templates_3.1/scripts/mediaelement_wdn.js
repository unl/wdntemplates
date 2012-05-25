/**
 * This plugin is intended for use on pages with HTML5 audio/video
 * 
 */
WDN.mediaelement_wdn = function() {
	return {
		initialize : function(callback) {
			var min = '';
			if (!WDN.jQuery('body').hasClass('debug')) {
				min = '.min';
			}
			
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/css/mediaelementplayer' + min + '.css'));
			WDN.loadJQuery(function() {
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/mediaelement-and-player' + min + '.js'), function() {
					WDN.jQuery('video.wdn_player, audio.wdn_player').each(function() {
						WDN.jQuery(this).mediaelementplayer({
							videoWidth: '100%',
							videoHeight: '100%',
							audioWidth: '100%'
						});
					});
					
					if (callback) {
						callback();
					}
				});
			});
		}
	};
}();
