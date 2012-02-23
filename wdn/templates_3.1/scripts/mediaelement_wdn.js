/**
 * This plugin is intended for use on pages with HTML5 audio/video
 * 
 */
WDN.mediaelement_wdn = function() {
	return {
		initialize : function(callback) {
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/css/mediaelementplayer.css'));
			WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/mediaelement/mediaelement-and-player.min.js'), callback);
		}
	};
}();
