define(['jquery', 'wdn', 'require', 'modernizr', 'navigation'], function($, WDN, require, Modernizr, nav) {
	var autoSearchDebounceDelay = 1000;

	function getLocalSearch() {
		var link = $('link[rel=search]');
		if (link.length && link[link.length - 1].type != 'application/opensearchdescription+xml') {
			return link[link.length - 1].href;
		}

		return false;
	}

	var initd = false;

	var isFullNav = function() {
		return Modernizr.mq('(min-width: 700px)') || !Modernizr.mq('only all');
	};

	return {
		initialize : function() {
			if (initd) {
				return;
			}
			initd = true;

			$(function() {
				var domQ = $('#wdn_search_query'),
					domSearchForm = $('#wdn_search_form'),
					domEmbed,
					$unlSearch,
					$progress,
					submitted = false,
					postReady = false,
					autoSubmitTimeout,
					searchHost = 'search.unl.edu', // domain of UNL Search app
					searchPath = '/', // path to UNL Search app
					searchOrigin = 'https://' + searchHost,
					searchAction = searchOrigin + searchPath,
					searchFrameAction = searchAction + '?embed=1',
					allowSearchParams = ['u', 'cx'],  // QS Params allowed by UNL Search app
					siteHomepage = nav.getSiteHomepage(),
					localSearch = getLocalSearch();

				// give up if the search form has been unexpectedly removed
				if (!domSearchForm.length) {
					return;
				}

				// ensure the default action is the UNL Search app
				if (domSearchForm[0].action !== searchAction) {
					domSearchForm.attr('action', searchAction);
				}

				if (localSearch && localSearch.indexOf(searchAction + '?') === 0) {
					// attempt to parse the allowed UNL Search parameter overrides allowed
					var localSearchParams;
					var i;
					try {
						if (window.URLSearchParams) {
							localSearchParams = new URLSearchParams(localSearch.slice(localSearch.indexOf('?') + 1));

							for (i = 0; i < allowSearchParams.length; i++) {
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
							for (i = 0; i < localSearchParams.length; i++) {
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
					searchFrameAction += '&u=' + encodeURIComponent(siteHomepage);
				}

				// create a loading indicator
				$progress = $('<progress>', {id: 'wdn_search_progress'}).text('Loading...');

				// add a parameter for triggering the iframe compatible rendering
				domEmbed = $('<input>', {
					type: "hidden",
					name: "embed",
					value: 1
				});
				domSearchForm.append(domEmbed);

				var createSearchFrame = function() {
					// lazy create the search iframe
					if (!$unlSearch) {
						$unlSearch = $('<iframe>', {
							name: 'unlsearch',
							id: 'wdn_search_frame',
							title: 'Search results',
							src: searchFrameAction
						});

						domSearchForm.parent().append($unlSearch).append($progress);

						$unlSearch.on('load', function() {
							postReady = true; // iframe should be ready to post messages to
						});
					}
				};

				var activateSearch = function() {
					domSearchForm.parent().addClass('active');
					$progress.show();
				};

				var postSearchMessage = function(query) {
					$unlSearch[0].contentWindow.postMessage(query, searchOrigin);
					$progress.hide();
				};

				var closeSearch = function() {
					domSearchForm.parent().removeClass('active');
					domSearchForm[0].reset();
				};

				// add an event listener to support the iframe rendering
				domQ.on('keyup', function(e) {
					// ONLY for "desktop" presentation
					if (!isFullNav()) {
						return;
					}

					var keyCode = e.keyCode;

					if (keyCode === 27) {
						//Close on escape
						closeSearch();
						return;
					}

					// ignore non-printable keys (blacklist)
					if ((keyCode !== 32 && keyCode < 48) ||
						(keyCode > 90 && keyCode < 96) ||
						(keyCode > 111 && keyCode < 186 && keyCode !== 173) ||
						(keyCode > 192 && keyCode < 219) ||
						(keyCode > 222)
					) {
						return;
					}

					clearTimeout(autoSubmitTimeout);

					if ($(this).val()) {
						// activate search UI
						createSearchFrame();
						activateSearch();

						// debounce auto-submit
						autoSubmitTimeout = setTimeout(function() {
							domSearchForm.trigger('submit', 'auto');
						}, autoSearchDebounceDelay);
					}
				});

				domSearchForm.on('submit', function(e, source) {
					// disable iframe and return if not in "desktop" presentation
					if (!isFullNav()) {
						this.target = '';
						domEmbed.prop('disabled', true);
						return;
					}

					// enable the iframe search params
					createSearchFrame();
					activateSearch();
					domEmbed.prop('disabled', false);
					this.target = 'unlsearch';

					if ('auto' !== source) {
						//a11y: send focus to the results if manually submitted
						$unlSearch.focus();
					}

					// support sending messages to iframe without reload
					if (postReady) {
						e.preventDefault();
						postSearchMessage(domQ.val());
					}
				});

				//Close search on escape while the iframe has focus
				$(window).on('message', function(e) {
					var originalEvent = e.originalEvent;

					if ('wdn.search.close' != originalEvent.data) {
						//Make sure this is our event
						return;
					}

					if (searchOrigin != originalEvent.origin) {
						//Verify the origin
						return;
					}

					closeSearch();
				});

				//Close search on escape
				$(document).on('keydown', function(e) {
					if (e.keyCode === 27) {
						//Close on escape
						closeSearch();
					}
				});

				// listen for clicks on the document and hide the iframe if they didn't come from search interface
				$(document).on('click', function(e) {
					var $wdnSearch = domSearchForm.parent();
					if (!$wdnSearch.find(e.target).length) {
						closeSearch();
					}
				});
			});
		}
	};
});
