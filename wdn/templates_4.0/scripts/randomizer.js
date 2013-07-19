define(['jquery', 'wdn'], function($, WDN) {
	var rndSel = '.wdn_randomizer';
	return {
		initialize : function() { 
			WDN.loadCSS(WDN.getTemplateFilePath('css/modules/randomizer.css'), function() {
				$(rndSel + '.wdn-fouc-fix').removeClass('wdn-fouc-fix');
			});
			$(function() {
				$(rndSel).each(function() {
					var scope = $(this).children(),
					n = scope.length;
					scope.eq(Math.floor(Math.random() * n)).addClass('show');
				});
			});
		}
	};
});
