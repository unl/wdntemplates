define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var initd = false,

		page = window.location.href,

		goURLService = 'http://go.unl.edu/api_create.php',

		templateBody = encodeURIComponent('Check out this page from #UNL '),
		templateVia = 'UNLincoln',
		templateCampaign = 'wdn_social',
		templateMedium = 'share_this';

  

	var Plugin = {
        initialize : function() {
        	if (!initd) {
        		$(function() {
        			var subject = $('h1').first().text();
                    Plugin.createShareButton("wdn-main-share-button", page, subject); // use function within plugin to create share button for all main pages.
        		});

        		initd = true;
        	}
        },

        shareButtonTemplate:'<div class="wdn-share-button">'+ // add string to use as template for all share buttons
                                '<input type="checkbox" id="{{id}}" class="wdn_share_toggle wdn-input-driver" value="Show share options" />'+
                                '<label for="{{id}}" class="wdn-icon-share"><span class="wdn-text-hidden">Share This Page</span></label>'+
                                '<ul class="wdn-share-options wdn-hang-{{hang}}">'+
                                    '<li><a href="{{url}}" class="wdn-icon-link wdn_createGoURL" rel="nofollow">Get a Go URL</a></li>'+
                                    '<li class="outpost wdn_emailthis"><a href="mailto:?body={{body}}&amp;subject={{title}}" class="wdn-icon-mail" rel="nofollow">Email this page</a></li>'+
                                    '<li class="outpost wdn_facebook"><a href="https://www.facebook.com/sharer/sharer.php?u={{encodedUrl}}" class="wdn-icon-facebook" rel="nofollow">Share on Facebook</a></li>'+ // https://developers.facebook.com/docs/plugins/share-button
                                    '<li class="outpost wdn_twitter"><a href="https://twitter.com/share?text={{body}}&amp;via=UNLincoln&amp;url={{encodedUrl}}" class="wdn-icon-twitter" rel="nofollow">Share on Twitter</a></li>'+ // https://dev.twitter.com/docs/tweet-button
                                    '<li class="outpost"><a href="http://www.linkedin.com/shareArticle?mini=true&amp;url={{encodedUrl}}&amp;title={{title}}&amp;summary={{body}}&amp;source=University%20of%20Nebraska%20-%20Lincoln" rel="nofollow" target="_blank" class="wdn-icon-linkedin-squared" title="Share on LinkedIn">Share on LinkedIn</a></li>'+ //https://developer.linkedin.com/documents/share-linkedin
                                '</ul>'+
                            '</div>',

        createShareButton: function(container, url, title, body){

            var buttonTemp = Plugin.shareButtonTemplate;

            var count = $(".wdn_share_toggle").length;

            console.log(count);
    
            if(container && url){

                title = typeof title !== 'undefined' ? title : "Default title";
                body = typeof body !== 'undefined' ? body : "Check out this page from #UNL";

                buttonTemp = buttonTemp.replace(/{{url}}/g, url);
                buttonTemp = buttonTemp.replace(/{{encodedUrl}}/g, encodeURIComponent(url));
                buttonTemp = buttonTemp.replace(/{{title}}/g, encodeURIComponent(title));
                buttonTemp = buttonTemp.replace(/{{body}}/g, encodeURIComponent(body));
                buttonTemp = buttonTemp.replace(/{{id}}/g, container+"-wdn-share-toggle");

                $("#"+container).html(buttonTemp);

                $("#"+container+' .wdn_createGoURL').click(function(e) {
                    var $this = $(this);

                    $this.text('Fetching...');

                    Plugin.createURL($this.attr("href"), function(goURL) {
                        var $result = $('<input>', {type:'text', id:'goURLResponse', value:goURL, readonly:'readonly'});
                        $this.parent().empty().append($result);
                        $result.focus().select();
                    }, function(data) {
                        $this.text('Request failed. Try again later.');
                        console.log(data)
                    });

                    e.preventDefault();
                });

            };

        },

        createURL : function(createThisURL, callback, failure) { //function to create a GoURL
        	failure = failure || $.noop;

        	$.ajax({
        		url: goURLService,
        		type: 'post',
                data: {theURL: createThisURL},
                success: function(data) {
                    if (data != "There was an error. ") {
                    	WDN.log('current URL: ' + createThisURL + ' GoURL: ' + data);
                        callback(data);
                    } else {
                    	failure();
                    }
                },
                error: failure
        	});
        }
    };

	return Plugin;
});
