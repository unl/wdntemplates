//
//
//
//
//
//
//

WDN.splash_poster = function() {
	return {
		initialize : function() {
	  		WDN.log("splash_poster initialized");
			theInterval = setInterval( function() {
				posterCount = parseInt(WDN.jQuery("#posters>div.active").attr("id").split('poster')[1]);
				if (currentPoster< 4) {
					nextPoster = currentPoster + 1;
				} else {
					nextPoster = 1;
				}
				WDN.jQuery("#posters>div.active").fadeOut("slow", function (){
			 	//change the poster
					WDN.jQuery("#splash .active").removeClass("active").addClass("hidden");
					WDN.jQuery("#poster"+nextPoster).removeClass("hidden").addClass("active").fadeIn("slow", function (){
					    //change the headline panel
					    WDN.jQuery("#headline"+nextPoster).addClass("active");
					});
				});
			}, 7000 );
	  		
	  		WDN.jQuery("#headlines>div").click(function(){
	  			//stop the auto-transition now that a panel has been clicked
	  			clearInterval(theInterval);
	  			//headlines
	  			panelClicked = WDN.jQuery(this).attr("id").split('headline')[1];
	  			WDN.jQuery("#splash .active").removeClass("active").addClass('hidden');
	  			WDN.jQuery("#headline"+panelClicked+",#poster"+panelClicked).removeClass('hidden').addClass("active");
	  		});
	  	   
	  		if (WDN.jQuery('#splash .splash_headline').length == 4) {
		  		//adjust for four panels
		  		WDN.jQuery("#headlines h4").css('font-size','1.3em');
	  			WDN.jQuery("#headlines div.splash_headline").css('height','85px').css('padding','8px 16px 4px');
		  		WDN.jQuery("#headline4").show();
		  		WDN.jQuery("#headline4>div.splash_headline").css('height','86px');
	  		}
	  	}
	};
}();