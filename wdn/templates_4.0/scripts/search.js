define(['jquery', 'wdn', 'require', 'modernizr', 'navigation'], function($, WDN, require, Modernizr, nav) {
	function getLocalSearch() {
		var link = $('link[rel=search]');
		if (link.length && link[link.length - 1].type != 'application/opensearchdescription+xml') {
			return link[link.length - 1].href;
		}

		return false;
	}

	var isFullNav = function() {
		return Modernizr.mq('(min-width: 700px)') || !Modernizr.mq('only all');
	};

	return {
		initialize : function() {
			$(function() {
				var domQ = $('#wdn_search_query'),
					domSearchForm = $('#wdn_search_form'),
					domEmbed,
					$unlSearch,
					submitted = false,
					postReady = false,
					autoSubmitTimeout,
					searchOrigin = '//www1.unl.edu',
					siteHomepage = nav.getSiteHomepage();

				/**
			     * Add the experimental text-to-speech
			     */
	            domQ.attr('x-webkit-speech', 'x-webkit-speech');

				var localSearch = getLocalSearch();
				if (localSearch) {
					// Change form action to the local search
					var qsPos = localSearch.indexOf('?'), hashes, hash, htmlUpdate = $();
					if (qsPos > -1) {
						hashes = localSearch.slice(qsPos + 1).split('&');
						for (var i = 0; i < hashes.length; i++) {
							hash = hashes[i].split('=');
							htmlUpdate = htmlUpdate.add($('<input>', {
								type: "hidden",
								name: hash[0],
								value: decodeURIComponent(hash[1])
							}));
						}
						domSearchForm.append(htmlUpdate);
					}

					domSearchForm.attr('action', localSearch);
				} else {
					if (siteHomepage && siteHomepage !== 'http://www.unl.edu/') {
						domSearchForm.append($('<input>', {
							type: "hidden",
							name: "u",
							value: siteHomepage
						}));
					}

					domEmbed = $('<input>', {
						type: "hidden",
						name: "embed",
						value: 1
					});
					domSearchForm.append(domEmbed);

					$unlSearch = $('<iframe>', {
						name: 'unlsearch',
						id: 'wdn_search_frame',
					});
					domSearchForm.parent().append($unlSearch);

					domQ.on('keyup', function(e0) {
						if (!isFullNav()) {
							return;
						}

						clearTimeout(autoSubmitTimeout);
						if ($(this).val()) {
							autoSubmitTimeout = setTimeout(function() {
								domSearchForm.submit();
							}, 300);
						}
					});

					$unlSearch.on('load', function() {
						if (!submitted) {
							return;
						}

						postReady = true;
					});

					domSearchForm.on('submit', function(e) {
						if (!isFullNav()) {
							this.target = '';
							domEmbed.prop('disabled', true);
							return;
						}

						domEmbed.prop('disabled', false);
						this.target = 'unlsearch';
						$(this).parent().addClass('active');

						if (!submitted) {
							submitted = true;
							return;
						}

						if (postReady && $unlSearch[0].contentWindow.postMessage) {
							e.preventDefault();
							$unlSearch[0].contentWindow.postMessage(domQ.val(), window.location.protocol + searchOrigin);
						}
					});

					$(document).on('click', function(e) {
						var $wdnSearch = domSearchForm.parent();
						if (!$wdnSearch.find(e.target).length) {
							$wdnSearch.removeClass('active');
						}
					});
				}

				var localPlaceholder = WDN.getPluginParam('search', 'placeholder');
				if (localPlaceholder) {
					domQ.attr('placeholder', localPlaceholder);
				}
			});
		}
	};
});
