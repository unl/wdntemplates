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
            WDN.jQuery('#createURL a').click(function() {
            	//WDN.jQuery(this).parent('p').remove();
            	WDN.post(
            			"http://129.93.245.102/workspace/UNL_GoURL/api_create.php", 
            			{theURL: window.location.href},
            			function(data) {
            				WDN.jQuery('.socialmedia:last').after("<input type='text' value='"+data+"' />");
            			}
            	);
            	return false;
            });
        }
    };
}();