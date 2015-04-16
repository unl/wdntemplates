define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var initd = false;

    var page = window.location.href;

    var goURLService = 'http://go.unl.edu/api_create.php';

    var templateCampaign = 'wdn_social';

    var templateMedium = 'share_this';

    var templateBody = encodeURIComponent('Check out this page from #UNL ');
    var templateVia = 'UNLincoln';

    var templateMail = 'mailto:?body=' + templateBody;
        // https://developers.facebook.com/docs/plugins/share-button
    var templateFacebook = 'https://www.facebook.com/sharer/sharer.php?u=';
        // https://dev.twitter.com/docs/tweet-button
    var templateTwitter = 'https://twitter.com/share?text=' + templateBody + '&via=' + templateVia;

    var templateLinkedin = 'http://www.linkedin.com/shareArticle?mini=true&amp;summary='+templateBody+'&amp;source=University%20of%20Nebraska%20-%20Lincoln';



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
                                    '<li class="outpost wdn_emailthis"><a href="mailto:?body={{body}}%20{{encodedUrl}}&amp;subject={{title}}" class="wdn-icon-mail" rel="nofollow">Email this page</a></li>'+
                                    '<li class="outpost wdn_facebook"><a href="https://www.facebook.com/sharer/sharer.php?u={{encodedUrl}}" class="wdn-icon-facebook" rel="nofollow">Share on Facebook</a></li>'+ // https://developers.facebook.com/docs/plugins/share-button
                                    '<li class="outpost wdn_twitter"><a href="https://twitter.com/share?text={{body}}&amp;via=UNLincoln&amp;url={{encodedUrl}}" class="wdn-icon-twitter" rel="nofollow">Share on Twitter</a></li>'+ // https://dev.twitter.com/docs/tweet-button
                                    '<li class="outpost"><a href="http://www.linkedin.com/shareArticle?mini=true&amp;url={{encodedUrl}}&amp;title={{title}}&amp;summary={{body}}&amp;source=University%20of%20Nebraska%20-%20Lincoln" rel="nofollow" target="_blank" class="wdn-icon-linkedin-squared" title="Share on LinkedIn">Share on LinkedIn</a></li>'+ //https://developer.linkedin.com/documents/share-linkedin
                                '</ul>'+
                            '</div>',

        createShareButton: function(container, url, hang, title, body){

            var buttonTemp = Plugin.shareButtonTemplate; // hold template in local variable
    
            if(container && url){ // if both container and url have been specified, make the widget. if not do nothing

                if((hang != "left") && (hang != "right")) { // check to see if the "hang" parameter is not "left" or "right". if it isn't we can assume it isn't being used and rearrange the other parameters accordingly
                    body = title;
                    title = hang;
                    hang = undefined;   
                }

                title = typeof title !== 'undefined' ? title : "Default title"; // set defaults for optional parameters 
                body = typeof body !== 'undefined' ? body : "Check out this page from #UNL";
                hang = typeof hang !== 'undefined' ? hang : "left";

                buttonTemp = buttonTemp.replace(/{{url}}/g, url); // find all places within the widget template with {{double bracketted placeholders}} and replace them with the appropreiate content 
                buttonTemp = buttonTemp.replace(/{{encodedUrl}}/g, encodeURIComponent(url));
                buttonTemp = buttonTemp.replace(/{{title}}/g, encodeURIComponent(title));
                buttonTemp = buttonTemp.replace(/{{body}}/g, encodeURIComponent(body));
                buttonTemp = buttonTemp.replace(/{{id}}/g, container+"-wdn-share-toggle");
                buttonTemp = buttonTemp.replace(/{{hang}}/g, encodeURIComponent(hang));

                $("#"+container).html(buttonTemp); // set the html of the container to our newly created widget. 

                $("#"+container+' .wdn_createGoURL').click(function(e) { // add event listner to get a goURL to each widget 
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

    assembleLink = function(shareId, subject, url, isShort) {
            var encodedUrl = encodeURIComponent(url),
                encodedSubject = encodeURIComponent(subject);

            switch (shareId) {
                case 'wdn_emailthis':
                    return templateMail + encodedUrl + '&subject=' + encodedSubject;
                    break;
                case 'wdn_facebook':
                    return templateFacebook + encodedUrl;
                    break;
                case 'wdn_twitter':
                    return templateTwitter + '&url=' + encodedUrl + (isShort ? ('&counturl=' + encodedPage) : '');
                    break;
                case 'wdn_linkedin':
                    return templateLinkedin + '&url=' + encodedUrl + '&subject=' + encodedSubject;
                    break;
            }

            return '';
        };

    setLocation = function(url) {
            window.location.href = url;
        };

	return Plugin;
});
