define(['jquery', 'wdn'], function($, WDN) {
	return {
		initialize : function() { 
			WDN.loadCSS(WDN.getTemplateFilePath('css/modules/randomizer.css'));
			$(function() {
				$('.wdn_randomizer').each(function() {
					var scope = $(this).children(),
					n = scope.length;
					scope.eq(Math.floor(Math.random() * n)).addClass('show');
				});
			});
		}
	};
});
