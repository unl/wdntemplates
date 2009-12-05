WDN.socialmediashare = function() {
    return {
        initialize : function() {
            /* No need to use the attr method or even jQuery when working with single elements. Doing it the following way will speed up performance: */
            function e (id) {
                return document.getElementById(id);
            };
            try {
                e("wdn_facebook").href = "http://www.facebook.com/share.php?u="+window.location+"";
                e("wdn_twitter").href = "http://twitter.com/home?status=Reading "+window.location+" %23unl";
                e("wdn_plurk").href = "http://www.plurk.com/?status="+window.location+" from University%20of%20Nebraska-Lincoln&qualifier=shares";
                e("wdn_myspace").href = "http://www.myspace.com/Modules/PostTo/Pages/?l=3&u="+window.location+"&t=University%20of%20Nebraska-Lincoln: "+document.title+"";
                e("wdn_digg").href = "http://digg.com/submit?phase=2&url="+window.location+"&title=University%20of%20Nebraska-Lincoln: "+document.title+"";
                e("wdn_linkedin").href = "http://www.linkedin.com/shareArticle?mini=true&url="+window.location+"&title=University%20of%20Nebraska-Lincoln: "+document.title+"&summary=&source=";
                e("wdn_googlebookmark").href = "http://www.google.com/bookmarks/mark?op=edit&bkmk="+window.location+"&title=University%20of%20Nebraska-Lincoln: "+document.title+"";
                e("wdn_delicious").href = "http://del.icio.us/post?url="+window.location+"&title=University%20of%20Nebraska-Lincoln: "+document.title+"";
                e("wdn_reddit").href = "http://reddit.com/submit?url="+window.location+"&title=University%20of%20Nebraska-Lincoln: "+document.title+"";
                e("wdn_stumbleupon").href = "http://www.stumbleupon.com/submit?url="+window.location+"&title=University%20of%20Nebraska-Lincoln: "+document.title+"";
                e("wdn_newsvine").href = "http://www.newsvine.com/_tools/seed&save?popoff=0&u="+window.location+"&h=University%20of%20Nebraska-Lincoln: "+document.title+"";
            } catch(e) {}
            
            WDN.jQuery('a#createURL').click(function() {
            	WDN.jQuery(this).remove();
            	WDN.socialmediashare.createURL(window.location.href, 
            		function(data) {
            			WDN.jQuery('.socialmedia:last').after("<input type='text' id='goURLResponse' value='"+data+"' />");
            			WDN.jQuery('#goURLResponse').focus().select();
            		}
            	);
            	return false;
            });
            //change the href to a goURL with GA campaign tagging
            var utm_source = "";
            var utm_campaign = "wdn_social";
            var utm_medium = "share_this";
            WDN.jQuery('.socialmedia a').hover(function() {
            	utm_source = WDN.jQuery(this).attr('id');
            	gaTagging = "utm_campaign="+utm_campaign+"&amp;utm_medium="+utm_medium+"&amp;utm_source="+utm_source;
            	//Let's build the URL to be shrunk
            	thisPage = new String(window.location.href);
            	if (thisPage.indexOf('?') != -1) { //check to see if has a ?, if not then go ahead with the ?. Otherwise add with &
            		thisURL = thisPage+"?"+gaTagging;
            	} else {
            		thisURL = thisPage+"&amp;"+gaTagging;
            	}
            	WDN.socialmediashare.createURL(
            		thisURL,
            		function(data) { //now we have a GoURL, let's replace the href with this new URL.
            			var regExpURL = new RegExp(window.location);
	            		var currentHref = WDN.jQuery('#'+utm_source).attr('href');
	            		WDN.jQuery('#'+utm_source).attr({href : currentHref.replace(regExpURL, data)});
            		}
            	);
            });
        },
	    createURL : function(createThisURL, callback) { //function to create a GoURL
	    	WDN.post(
				"http://go.unl.edu/api_create.php", 
				{theURL: createThisURL},
				function(data) {
					WDN.log(createThisURL+" "+data);
					if (data != "There was an error. ") {
						callback(data);
					}
				}
	    	);
	    }
    };
}();