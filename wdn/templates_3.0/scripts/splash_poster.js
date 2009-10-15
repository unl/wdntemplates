/**
 * This plugin is intended for use on splash pages containing rotating panels
 * of information.
 */
WDN.splash_poster = function() {
	return {
		/**
		 * Stores the number of panels
		 */
		panels : false,
		
		/**
		 * The current rotation event timeout
		 */
		timeout : false,
		
		/**
		 * The panel rotation interval in microseconds
		 */
		interval : 3000,
		
		/**
		 * Initialize the splash posters
		 */
		initialize : function() {
	  		WDN.log("splash_poster initialized");

	  		WDN.jQuery("#headlines>div").click( function() {
	  			//stop the auto-transition now that a panel has been clicked
	  			WDN.splash_poster.stopPanelRotation();
	  			//headlines
	  			panelClicked = WDN.jQuery(this).attr("id").split('headline')[1];
	  			WDN.jQuery("#splash .active").removeClass("active").addClass('hidden');
	  			WDN.jQuery("#headline"+panelClicked+",#poster"+panelClicked).removeClass('hidden').addClass("active");
	  		});
	  		
	  		WDN.splash_poster.panels = WDN.jQuery('#splash .splash_headline').length;
	  		
	  		if (WDN.splash_poster.panels == 4) {
		  		//adjust for four panels
		  		WDN.jQuery("#headlines h4").css('font-size','1.3em');
	  			WDN.jQuery("#headlines div.splash_headline").css('height','85px').css('padding','8px 16px 4px');
		  		WDN.jQuery("#headline4").show();
		  		WDN.jQuery("#headline4>div.splash_headline").css('height','86px');
	  		}
	  		
	  		WDN.splash_poster.startPanelRotation();
	  	},
	  	
	  	/**
	  	 * Begins the panel rotation
	  	 */
	  	startPanelRotation : function() {
	  		WDN.splash_poster.timeout = setInterval( function() {
				var currentPoster = parseInt(WDN.jQuery("#posters>div.active").attr("id").split('poster')[1]);
				if (currentPoster < WDN.splash_poster.panels) {
					var nextPoster = currentPoster + 1;
				} else {
					var nextPoster = 1;
				}
				WDN.jQuery("#posters>div.active").fadeOut("slow", function (){
					//change the poster
					WDN.jQuery("#splash .active").removeClass("active").addClass("hidden");
					WDN.jQuery("#poster"+nextPoster).removeClass("hidden").addClass("active").fadeIn("slow", function (){
					    //change the headline panel
					    WDN.jQuery("#headline"+nextPoster).addClass("active");
					});
				});
			}, WDN.splash_poster.interval );
	  	},
	  	
	  	/**
	  	 * Stops panel rotation
	  	 */
	  	stopPanelRotation : function() {
	  		clearInterval(WDN.splash_poster.timeout);
	  	}
	};
}();