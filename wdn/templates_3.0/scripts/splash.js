function formatBlogDate(theDate) {
            splitDates = theDate.split(" ");
            //theDate = "<span class=\"month\">" + splitDates[2] + "</span> <span class=\"day\">" + splitDates[1] + "</span>";
            theDate = "Release date: " + splitDates[2] + " " +splitDates[1] + "";
            return theDate;
    }
                
    function showBlogPosts(data) {
        WDN.jQuery('#news_headlines').html('<ul id="the_headlines"></ul>');
      for(var i=0; i<3; i++) {
          if (i == 1 | i==3 | i==5) {
        WDN.jQuery("ul#the_headlines").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a><br /><span>"+formatBlogDate(data.query.results.item[i].pubDate)+"</span></li>");
          } else {
        WDN.jQuery("ul#the_headlines").append("<li><a href='"+data.query.results.item[i].link+"'>"+data.query.results.item[i].title+"</a><br /><span>"+formatBlogDate(data.query.results.item[i].pubDate)+"</span></li>");
          } 
        }
    }
    var my_calurl = "http://events.unl.edu/?upcoming&format=hcalendar&limit=7";
    WDN.get(my_calurl, null, function(content) {
        WDN.jQuery(document).ready( function() {
            WDN.jQuery('#splash_calendar').hide().html(content);
            WDN.jQuery('#splash_calendar abbr').each(
                    function() {
                        // Convert the date and time into something we want.
                        var eventdate = WDN.jQuery(this).html();
                        var month,day,time = '';
                        var xp = new RegExp(/[A-Za-z]{3,3}/);
                        if (xp.test(eventdate)) month = '<span class="month">'+xp.exec(eventdate)+'</span>';
                        eventdate.replace(xp.exec(eventdate),'');
                        xp = new RegExp(/[\d]+:[\d]+\s?[a,p]m/);
                        if (xp.test(eventdate)) time = '<span class="time">'+xp.exec(eventdate)+'</span>';
                        time = time.replace('0 ','0');
                        xp = new RegExp(/([\d]{1,2})[a-z]{2}/);
                        if (xp.test(eventdate)) day = '<span class="day">'+xp.exec(eventdate)[1]+'</span>';
                        WDN.jQuery(this).replaceWith('<div>'+month+' '+day+' '+time+'</div>');
                    });
            WDN.jQuery('#splash_calendar').show();
            });
        });
	WDN.jQuery(document).ready(function(){
		//starts the splash rotator on page ready
		//splashRotate(number of headlines, speed in milliseconds 4 sec=4000);
		splashRotate(4, 7000);
		
        if ((WDN.jQuery.browser.msie && WDN.jQuery.browser.version == '6.0') || (WDN.jQuery.browser.mozilla && parseFloat(WDN.jQuery.browser.version) < 1.9)) {
            WDN.jQuery('body').prepend('<div id="wdn_upgrade_notice"></div>');
            fetchURLInto('http://www.unl.edu/wdn/templates_3.0/includes/browserupgrade.html', 'wdn_upgrade_notice');
        }
		newRandomPromo('http://www.unl.edu/ucomm/splash/promo.xml');
	});	 
		 
	function splashRotate(panels, speed) {
	   function intervalTrigger() {
		  int = setInterval( function() {
			 currentPoster = parseInt(WDN.jQuery("#posters>div.active").attr("id").split('poster')[1]);
			 if (currentPoster< panels) {
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
		  }, speed );
	   };
		
	   //start the auto transition
	   intervalTrigger(); 
	
	   WDN.jQuery("#headlines>div").click(function(){
			//stop the auto-transition now that a panel has been clicked
			clearInterval(int);
			//headlines
			panelClicked = WDN.jQuery(this).attr("id").split('headline')[1];
			WDN.jQuery("#splash .active").removeClass("active").addClass('hidden');
			WDN.jQuery("#headline"+panelClicked+",#poster"+panelClicked).removeClass('hidden').addClass("active");
	   });
	   
	  //adjust for four panels
	  if (panels==4){
		  	WDN.jQuery("#headlines h4").css('font-size','1.3em');
			WDN.jQuery("#headlines div.splash_headline").css('height','85px').css('padding','8px 16px 4px');
			WDN.jQuery("#headline4").show();
			WDN.jQuery("#headline4>div.splash_headline").css('height','86px');
	  }
	};