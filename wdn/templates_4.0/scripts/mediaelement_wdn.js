/**
 * This plugin is intended for use on pages with HTML5 audio/video
 * 
 */
define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var pluginPath = 'scripts/plugins/mediaelement/',
	initd = false;
	
	return {
		initialize: function(callback) {
			var min = '', body = document.getElementsByTagName('body');
			if (!body.length || !body[0].className.match(/(^|\s)debug(\s|$)/)) {
				min = '.min';
			}
			
			if (!initd) {
				WDN.loadCSS(WDN.getTemplateFilePath(pluginPath + 'css/mediaelementplayer' + min + '.css'));
				initd = true;
			}
			
			WDN.loadJQuery(function() {
				require([
			        WDN.getTemplateFilePath(pluginPath + 'mediaelement-and-player' + min + '.js'),
			        WDN.getTemplateFilePath(pluginPath + 'mep-feature-googleanalytics.js')
		        ], function() {
                    $('video.wdn_player, audio.wdn_player').each(function() {
						$(this).mediaelementplayer({
							videoWidth: '100%',
							videoHeight: '100%',
							audioWidth: '100%',
							features : ['playpause','current','progress','duration','tracks','volume','fullscreen','googleanalytics']
						});
					});
					
					if (callback) {
						callback();
					}
				});
			});
		}
	};
});
