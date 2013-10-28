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

            //Prevent captions from being auto-displayed
            var v = document.querySelectorAll('.wdn_player');
            for (var i = 0, length = v.length; i < length; i++) {
                if (v[i].textTracks) {
                    v[i].textTracks[0].mode = "hidden";
                }
            }
            
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/css/mediaelementplayer' + min + '.css'));
			WDN.loadJQuery(function() {
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/mediaelement-and-player' + min + '.js'), function() {
                    WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/mep-feature-googleanalytics.js'), function() {
    					WDN.jQuery('video.wdn_player, audio.wdn_player').each(function() {
    						WDN.jQuery(this).mediaelementplayer({
    							videoWidth: '100%',
    							videoHeight: '100%',
    							audioWidth: '100%',
    							features : ['playpause','current','progress','duration','tracks','volume','fullscreen','googleanalytics']
    						});
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
