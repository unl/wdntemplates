WDN.randomizer = function() {
	return {
		initialize : function() { 
			WDN.log ("randomizer JS loaded");
			WDN.loadCSS('/wdn/templates_3.0/css/content/randomizer.css');
			WDN.loadJQuery(function() {
				WDN.jQuery('.wdn_randomizer').each(function() {
					var scope = WDN.jQuery(this).children();
					var n = scope.size();
					scope.eq(Math.floor(Math.random() * n)).css('display', 'block');
				});
			});
			
			return true;
		}
	};
}();