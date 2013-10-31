/**
 * This plugin is intended for use on pages with HTML5 audio/video
 * 
 */
WDN.mediaelement_wdn = function() {
	return {
		initialize : function(callback) {
			var min = '', body = document.getElementsByTagName('body');
			if (!body.length || !body[0].className.match(/(^|\s)debug(\s|$)/)) {
				min = '.min';
			}
			
			var options = {
				videoWidth: '100%',
				videoHeight: '100%',
				audioWidth: '100%',
				features : ['playpause','current','progress','duration','tracks','volume','fullscreen','googleanalytics']
			};

			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/css/mediaelementplayer' + min + '.css'));
			WDN.loadJQuery(function() {
				WDN.jQuery.extend(options, WDN.getPluginParam('mediaelement_wdn', 'options') || {});

				//Prevent captions from being auto-displayed
				WDN.jQuery('.wdn_player').each(function() {
					if (this.textTracks) {
						for (i=0; i<this.textTracks.length; i++) {
							this.textTracks[i].mode = "hidden";
						}
					}
				});
				
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/mediaelement-and-player' + min + '.js'), function() {
					WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/mep-feature-googleanalytics.js'), function() {
						WDN.jQuery('video.wdn_player, audio.wdn_player').each(function() {
							WDN.jQuery(this).mediaelementplayer(options);
						});

						if (callback) {
							callback();
						}
					});
				});
			});
		}
	};
}();
