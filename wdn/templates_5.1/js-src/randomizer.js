define(['jquery', 'wdn'], function($, WDN) {
	var rndSel = '.wdn_randomizer';
	return {
		initialize : function() {
			$(function() {
				$(rndSel).each(function() {
					var scope = $(this).children(),
					n = scope.length;

					scope.hide().eq(Math.floor(Math.random() * n)).show();
				}).removeClass('wdn-fouc-fix');
			});
		}
	};
});
