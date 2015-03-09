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
					$progress,
					submitted = false,
					postReady = false,
					autoSubmitTimeout,
					searchHost = 'www1.unl.edu', // domain of UNL Search app
					searchPath = '/search/', // path to UNL Search app
					searchOrigin = window.location.protocol + '//' + searchHost,
					searchAction = searchOrigin + searchPath,
					allowSearchParams = ['u', 'cx'],  // QS Params allowed by UNL Search app
					siteHomepage = nav.getSiteHomepage(),
					localSearch = getLocalSearch();

				// give up if the search form has been unexpectedly removed
				if (!domSearchForm.length) {
					return;
				}

				// ensure the default action is the UNL Search app
				if (domSearchForm[0].action !== searchAction) {
					domSearchForm.attr('action', searchAction)
				}

				if (localSearch && localSearch.indexOf(searchAction + '?') === 0) {
					// attempt to parse the allowed UNL Search parameter overrides allowed
					var localSearchParams;
					try {
						if (window.URLSearchParams) {
							localSearchParams = new URLSearchParams(localSearch.slice(localSearch.indexOf('?') + 1));

							for (var i = 0; i < allowSearchParams.length; i++) {
								if (localSearchParams.has(allowSearchParams[i])) {
									domSearchForm.append($('<input>', {
										type: "hidden",
										name: allowSearchParams[i],
										value: localSearchParams.get(allowSearchParams[i])
									}));
								}
							}
						} else {
							var paramPair;
							localSearchParams = localSearch.slice(localSearch.indexOf('?') + 1).split('&');
							for (var i = 0; i < localSearchParams.length; i++) {
								paramPair = localSearchParams[i].split('=');
								if (allowSearchParams.indexOf(paramPair[0]) >= 0) {
									domSearchForm.append($('<input>', {
										type: "hidden",
										name: paramPair[0],
										value: decodeURIComponent(paramPair[1])
									}));
								}
							}
						}
					} catch (ex){
						WDN.log(ex);
					}
				} else if (siteHomepage && !(/^https?:\/\/www\.unl\.edu\/$/.test(siteHomepage))) {
					// otherwise default to adding a local param for this site's homepage (but not UNL top)
					domSearchForm.append($('<input>', {
						type: "hidden",
						name: "u",
						value: siteHomepage
					}));
				}

				// add a parameter for triggering the iframe compatible rendering
				domEmbed = $('<input>', {
					type: "hidden",
					name: "embed",
					value: 1
				});
				domSearchForm.append(domEmbed);

				// add an event listener to support the iframe rendering
				domQ.on('keyup', function(e0) {
					// ONLY for "desktop" presentation
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

				$progress = $('<progress>', {id: 'wdn_search_progress'}).text('Loading...');

				domSearchForm.on('submit', function(e) {
					// disable iframe and return if not in "desktop" presentation
					if (!isFullNav()) {
						this.target = '';
						domEmbed.prop('disabled', true);
						return;
					}

					// lazy create the search iframe
					if (!$unlSearch) {
						$unlSearch = $('<iframe>', {
							name: 'unlsearch',
							id: 'wdn_search_frame',
							title: 'Search results'
						});

						domSearchForm.parent().append($unlSearch).append($progress);

						$unlSearch.on('load', function() {
							if (!submitted) {
								return;
							}

							$progress.hide();
							postReady = true; // iframe should be ready to post messages to
						});
					}

					// enable the iframe search params
					domEmbed.prop('disabled', false);
					this.target = 'unlsearch';
					$(this).parent().addClass('active');
					$progress.show();

					if (!submitted) {
						submitted = true;
						return;
					}

					// support sending messages to iframe without reload
					if (postReady && $unlSearch[0].contentWindow.postMessage) {
						e.preventDefault();
						$unlSearch[0].contentWindow.postMessage(domQ.val(), searchOrigin);
						$progress.hide();
					}
				});

				// listen for clicks on the document and hide the iframe if they didn't come from search interface
				$(document).on('click', function(e) {
					var $wdnSearch = domSearchForm.parent();
					if (!$wdnSearch.find(e.target).length) {
						$wdnSearch.removeClass('active');
					}
				});
			});
		}
	};
});
