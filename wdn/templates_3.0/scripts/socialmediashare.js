WDN.socialmediashare = function() {
	return {
		initialize : function() {
			jQuery("#wdn_facebook").attr("href", "http://www.facebook.com/share.php?u="+window.location+"");
			jQuery("#wdn_twitter").attr("href", "http://twitter.com/home?status=Currently reading "+window.location+"");
			jQuery("#wdn_plurk").attr("href", "http://twitter.com/home?status=Currently reading "+window.location+"");
			jQuery("#wdn_myspace").attr("href", "http://www.myspace.com/Modules/PostTo/Pages/?l=3&u="+window.location+"&t=University%20of%20Nebraska-Lincoln&c=");
			jQuery("#wdn_digg").attr("href", "http://digg.com/submit?phase=2&url="+window.location+"&title=University%20of%20Nebraska-Lincoln");
			
			jQuery("#wdn_googlebookmark").attr("href", "http://www.google.com/bookmarks/mark?op=edit&bkmk="+window.location+"&title=University%20of%20Nebraska-Lincoln");
			jQuery("#wdn_delicious").attr("href", "http://del.icio.us/post?url="+window.location+"&title=University%20of%20Nebraska-Lincoln");
			jQuery("#wdn_reddit").attr("href", "http://reddit.com/submit?url="+window.location+"&title=University%20of%20Nebraska-Lincoln");
			jQuery("#wdn_stumbleupon").attr("href", "http://www.stumbleupon.com/submit?url="+window.location+"&title=University%20of%20Nebraska-Lincoln");
			jQuery("#wdn_newsvine").attr("href", "http://www.newsvine.com/_tools/seed&save?popoff=0&u="+window.location+"&h=University%20of%20Nebraska-Lincoln");	
		}
	};
}();