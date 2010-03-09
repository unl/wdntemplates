WDN.randomizer = function() {
	return {
		initialize : function() { 
			WDN.log ("randomizer JS loaded");
			WDN.loadCSS('/wdn/templates_3.0/css/content/randomizer.css');
			
			var howManyDivs = WDN.jQuery('div.wdn_randomizer').children().size();
			var randomNum = Math.floor(Math.random()*howManyDivs);
			WDN.jQuery('div.wdn_randomizer div:eq(' + randomNum + ')').css("display", "block");
			
			return true;
		}
	};
}();