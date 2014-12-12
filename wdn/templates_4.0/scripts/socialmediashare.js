define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var initd = false,

		page = window.location.href,
		encodedPage = encodeURIComponent(page),

		goURLService = 'http://go.unl.edu/api_create.php',

		templateBody = encodeURIComponent('Check out this page from #UNL '),
		templateVia = 'UNLincoln',
		templateCampaign = 'wdn_social',
		templateMedium = 'share_this',

		templateMail = 'mailto:?body=' + templateBody,
		// https://developers.facebook.com/docs/plugins/share-button
		templateFacebook = 'https://www.facebook.com/sharer/sharer.php?u=',
		// https://dev.twitter.com/docs/tweet-button
		templateTwitter = 'https://twitter.com/share?text=' + templateBody + '&via=' + templateVia,
        //https://developer.linkedin.com/documents/share-linkedin
		templateLinkedin = 'http://www.linkedin.com/shareArticle?mini=true&summary= '+ templateBody + '&source=' + templateVia,

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
					return templateLinkedin + '&url=' + encodedUrl + '&title=' + encodedSubject
					break;

			}

			return '';
		},

		setLocation = function(url) {
			window.location.href = url;
		};

	var Plugin = {
        initialize : function() {
        	if (!initd) {
        		$(function() {
        			var subject = $('h1').first().text();

        			$('#wdn_createGoURL').click(function(e) {
        				var $this = $(this);

        				$this.text('Fetching...');
        				Plugin.createURL(page, function(goURL) {
        					var $result = $('<input>', {type:'text', id:'goURLResponse', value:goURL, readonly:'readonly'});
        					$this.parent().empty().append($result);
        					$result.focus().select();
        				}, function() {
        					$this.text('Request failed. Try again later.');
        				});

        				e.preventDefault();
        			});

        			$('.outpost a').each(function() {
        				var $this = $(this),
        					shareId = $this.parent().attr('id'),
	        				gaTagging = [
					             'utm_campaign=',
					             templateCampaign,
					             '&utm_medium=',
					             templateMedium,
					             '&utm_source=',
					             shareId
				             ].join(''),
				             url = page + (page.indexOf('?') >= 0 ? '&' : '?') + gaTagging,
				             href = assembleLink(shareId, subject, url);

        				$this.attr('href', href);

        				$this.one('click', function(e) {
        					Plugin.createURL(url, function(goURL) {
        						href = assembleLink(shareId, subject, goURL);
        						$this.attr('href');
        						setLocation(href);
            				}, function() {
            					setLocation(href);
            				});

        					e.preventDefault();
        				});
        			});
        		});

        		initd = true;
        	}
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
