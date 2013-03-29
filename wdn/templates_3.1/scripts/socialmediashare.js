WDN.socialmediashare = function() {
    return {
        initialize : function() {
            try {
            	WDN.jQuery("#wdn_emailthis").children('a').attr({'href': 'mailto:?body=Great%20content%20from%20UNL%3A%0A'+encodeURIComponent(window.location)+'&subject='+WDN.jQuery('#pagetitle h1').text()});
                WDN.jQuery("#wdn_facebook").children('a').attr({'href': "http://www.facebook.com/share.php?u="+encodeURIComponent(window.location)});
                /* https://dev.twitter.com/docs/tweet-button */
                WDN.jQuery("#wdn_twitter").children('a').attr({'href': "http://twitter.com/share?text=Great+content+from+%23UNL&via=unlnews&url="+encodeURIComponent(window.location)});
           } catch(f) {}
            
            WDN.jQuery('a#wdn_createGoURL').click(function() {
                WDN.jQuery(this).text('Creating...');
                WDN.socialmediashare.createURL(window.location.href, 
                    function(data) {
                		data = data.replace(/http:\/\//g,'');
                        WDN.jQuery('.socialmedia li:first-child').empty().html("<input type='text' id='goURLResponse' value='"+data+"' />");
                        WDN.jQuery('#goURLResponse').focus().select();
                    }
                );
                return false;
            });
            //change the href to a goURL with GA campaign tagging
            var utm_source = "";
            var utm_campaign = "wdn_social";
            var utm_medium = "share_this";
            WDN.jQuery('.socialmedia a:not(#wdn_createGoURL)').click(function() {
                utm_source = WDN.jQuery(this).parent('li').attr('id');
                gaTagging = "utm_campaign="+utm_campaign+"&utm_medium="+utm_medium+"&utm_source="+utm_source;
                //Let's build the URL to be shrunk
                thisPage = new String(window.location.href);
                
                WDN.socialmediashare.createURL(
                    WDN.socialmediashare.buildGAURL(thisPage, gaTagging),
                    function(data) { //now we have a GoURL, let's replace the href with this new URL.
                        var strLocation = encodeURIComponent(window.location);
                        var regExpURL = new RegExp(strLocation);
                        WDN.log("regExpURL: "+regExpURL);
                        var currentHref = WDN.jQuery('#'+utm_source).children('a').attr('href');
                        WDN.log("currentHref: "+currentHref);
                        WDN.jQuery('#'+utm_source).attr({href : currentHref.replace(regExpURL, data)});
                        window.location.href = WDN.jQuery('#'+utm_source).attr('href');
                    }
                );
                return false;
            });
        },
        buildGAURL : function(url, gaTagging) { 
        	if (url.indexOf('?') != -1) { //check to see if has a ?, if not then go ahead with the ?. Otherwise add with &
                url = url+"&"+gaTagging;
            } else {
                url = url+"?"+gaTagging;
            }
        	return url;
        },
        createURL : function(createThisURL, callback, failure) { //function to create a GoURL
        	failure = failure || function() {};
        	WDN.post(
        		"http://go.unl.edu/api_create.php", 
                {theURL: createThisURL},
                function(data) {
                    WDN.log("current URL: "+createThisURL+" GoURL: "+data);
                    if (data != "There was an error. ") {
                        callback(data);
                    } else {
                    	failure();
                    }
                }
            );
        }
    };
}();