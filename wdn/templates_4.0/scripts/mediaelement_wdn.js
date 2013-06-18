/**
 * This plugin is intended for use on pages with HTML5 audio/video
 * 
 */
define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var pluginPath = './plugins/mediaelement/',
	initd = false;
	
	return {
		initialize: function(callback) {
			var min = '', body = document.getElementsByTagName('body');
			if (!body.length || !body[0].className.match(/(^|\s)debug(\s|$)/)) {
				min = '.min';
			}
			
			if (!initd) {
				WDN.loadCSS(require.toUrl(pluginPath + 'css/mediaelementplayer' + min + '.css'));
				initd = true;
			}
			
			var ready = function() {
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
			};
			
			WDN.loadJQuery(function() {
				require([pluginPath + 'mediaelement-and-player' + min], function() {
					require([pluginPath + 'mep-feature-googleanalytics'], ready);
				});
			});
		}
	};
});
