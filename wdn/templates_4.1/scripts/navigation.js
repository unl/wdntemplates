define(['jquery', 'wdn', 'modernizr', 'require'], function($, WDN, Modernizr, require) {
	"use strict";

	var snifferServer = 'https://www1.unl.edu/nav-proxy/';
	var fullNavBp = '(min-width: 700px)';
	var hoverPlugin = 'plugins/hoverIntent/jquery.hoverIntent';
	var expandDelay = 400;
	var collapseDelay = 120;
	var scrollThrottle = 50;
	var resizeThrottle = 100;
	var transitionDelay = 200; // this is 100ms + @nav-transition-duration from ../less/_mixins/vars.less

	// framework selectors
	var rootSelector = 'html';
	var contentWrapperSelector = '#wdn_content_wrapper';
	var navBarSelector = '#wdn_navigation_bar';
	var wdnWrapSel = '#wdn_wrapper';
	var headerSelector = '#header';
	var breadSel = '#breadcrumbs';
	var navSel = '#navigation';
	var prmySel = '> ul > li';
	var barStartSel = ':nth-child(6n+1)';
	var navPrmySel = navSel + ' ' + prmySel;
	var breadPrmySel = breadSel + ' ' + prmySel;
	var menuTogSel = '#wdn_menu_toggle';
	var stopSelector = '.document, .terminal';
	var navButton = '.wdn-nav-toggle';

	// state related variables
	var lockHover = false;
	var initd = false;
	var expandSemaphore = false;
	var currentState = -1;

	// string intern
	var expandEvent = 'expand';
	var cssPaddingTop = 'padding-top';
	var cssPaddingBottom = 'padding-bottom';
	var cssHeight = 'height';
	var cssOverflow = 'overflow';
	var storeCls = 'storednav';
	var empty2ndCls = 'empty-secondary';
	var emptyRowCls = 'row-empty';
	var selectedClass = 'selected';
	var highlightClass = 'highlight';
	var collapsedClass ='collapsed';
	var expandedClass = 'expanded';
	var changingClass ='changing';
	var scrollingClass ='nav-scrolling';
	var pixelUnit = 'px';

	// state caching variables
	var homepageCrumb;
	var $homepageCrumbLink;
	var siteHomepage;
	var timeout;
	var scrollTimeout;
	var resizeTimeout;

	var isFullNav = function() {
		return Modernizr.mq(fullNavBp);
	};

	// a workaround for fast renderers like chrome: #612
	var redrawWait = function(callback) {
		return setTimeout(callback, 0);
	};

	// the following 3 functions are pulled from the Underscore.js library.
	// License: MIT - Copyright (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	var _now = Date.now || function() {
		return new Date().getTime();
	};

	var throttle = function(func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function() {
			previous = options.leading === false ? 0 : _now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function() {
			var now = _now();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};

	var debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result;
		var later = function() {
			var last = _now() - timestamp;
			if (last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
					if (!timeout) context = args = null;
				}
			}
		};

		return function() {
			context = this;
			args = arguments;
			timestamp = _now();
			var callNow = immediate && !timeout;
			if (!timeout) timeout = setTimeout(later, wait);
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

	        return result;
		};
	};

	var determineSelectedBreadcrumb = function () {
		// First we search for a defined homepage.
		var $homeLink = $('link[rel=home]');
		if ($homeLink.length) {
			siteHomepage = $homeLink[0].href;
			WDN.log('Setting homepage to ' + siteHomepage);
		}

		var $breadcrumbs = $(breadPrmySel);
		if (!$breadcrumbs.length) {
			WDN.log('This page is missing breadcrumbs');
			return;
		}

		$breadcrumbs.removeClass(selectedClass);

		if (!siteHomepage) {
			WDN.log('No homepage set!');
			if ($breadcrumbs.length < 2) {
				setHomepageLI($breadcrumbs[0]);
			} else {
				// Right now, stupidly select the second element.
				setHomepageLI($breadcrumbs[1]);
			}
		} else {
			WDN.log('Homepage has been set.');
			$('> a', $breadcrumbs).each(function() {
				if (this.href == siteHomepage) {
					setHomepageLI($(this).parent()[0]);
					return false;
				}
			});

			if (!$breadcrumbs.filter('.' + selectedClass).length) {
				WDN.log('We are on the current homepage.');
				setHomepageLI($breadcrumbs[$breadcrumbs.length-1]);
			}
		}

		$('> a', $breadcrumbs).last().parent().addClass('last-link');
	};

	var setHomepageLI = function(li) {
		homepageCrumb = li;
		var $li = $(li);
		$li.addClass(selectedClass);

		$homepageCrumbLink = $li.children('a').eq(0);

		if (!siteHomepage) {
			if ($homepageCrumbLink.length) {
				siteHomepage = $homepageCrumbLink[0].href;
			} else {
				siteHomepage = window.location.toString();
			}
		}

		if (!$homepageCrumbLink.length) {
			$li.wrapInner($('<a>', {href : siteHomepage}));
			$homepageCrumbLink = $li.children('a').eq(0);
		}
	};

	var linkSiteTitle = function() {
		var $siteTitle = $('#wdn_site_title');
		var $link;

		if (!siteHomepage) {
			return;
		}

		// check if the link already exists
		$link = $siteTitle.children('a');
		if ($link.length) {
			$link.attr('href', siteHomepage);
		} else {
			$siteTitle.wrapInner($('<a>', {href : siteHomepage}));
		}
	};

	var fixPresentation = function(shiftContent) {
		var primaries = $(navPrmySel);
		var secondaryLists = $('> ul', primaries);
		var primaryLinks = $('> a', primaries);
		var $nav = $(navSel);
		var $cWrapper = $(contentWrapperSelector);
		var cssTemp = {};
		var $navBarLabels = $(navSel + ' > label > span[class^="wdn-icon"]');

		$nav.off(expandEvent);
		cssTemp[cssPaddingTop] = cssTemp[cssPaddingBottom] = '';
		primaryLinks.css(cssTemp);
		$navBarLabels.css(cssTemp);

		if (!isFullNav()) {
			$cWrapper.css(cssPaddingTop, '');
			secondaryLists.css(cssHeight, '');
			$nav.trigger('fixed', [$('.wdn-menu-trigger').outerHeight()]);
			return;
		}

		var navWrap = $('#wdn_navigation_wrapper');
		navWrap.removeClass(empty2ndCls);
		primaries.removeClass(emptyRowCls);

		var $bar_starts = $(navPrmySel + barStartSel);
		var navigationRowHeights = [];

		primaryLinks.each(function(i){
			var row = Math.floor(i/6);
			var height = $(this).outerHeight();
			if (!navigationRowHeights[row] || height > navigationRowHeights[row]) {
				navigationRowHeights[row] = height;
			}
		});

		var i = 0;
		var navigationRowHeight = 0;

		for (i = 0; i < navigationRowHeights.length; i++) {
			navigationRowHeight += navigationRowHeights[i];
		}

		primaryLinks.each(function(i){
			var row = Math.floor(i/6),
				height = $(this).outerHeight(),
				pad = parseFloat($(this).css(cssPaddingTop));

			if (height < navigationRowHeights[row]) {
				var navRowCellPadding = (navigationRowHeights[row] - height) / 2;
				cssTemp[cssPaddingTop] = Math.floor(navRowCellPadding + pad) + pixelUnit;
				cssTemp[cssPaddingBottom] = Math.ceil(navRowCellPadding + pad) + pixelUnit;

				$(this).css(cssTemp);
			}
		});

		cssTemp = {};
		$navBarLabels.each(function() {
			var row = 0;
			var height = $(this).outerHeight();
			var pad = parseFloat($(this).css(cssPaddingTop));

			// allow for 5 pixels of height variation
			if (height + 5 < navigationRowHeights[row]) {
				var barHalfPad = (navigationRowHeights[row] - height) / 2;
				cssTemp[cssPaddingTop] = Math.floor(barHalfPad + pad) + pixelUnit;
				$(this).css(cssTemp);
			}
		});

		var recalcSecondaryHeight = function() {
			WDN.log('fixing secondaries');
			var secondaryRowHeights = [];
			var pause = 'pause';

			$nav.addClass(pause);
			secondaryLists.css(cssHeight, '').each(function(i){
				var row = Math.floor(i/6), height = $(this).height();
				if (!secondaryRowHeights[row] || height > secondaryRowHeights[row]) {
					secondaryRowHeights[row] = height;
				}
			});
			redrawWait(function(){
				$nav.removeClass(pause);
			});
			//loop through again and apply new height
			secondaryLists.each(function(i){
				var row = Math.floor(i/6);
				$(this).css(cssHeight, secondaryRowHeights[row] + pixelUnit);
			});
		};

		if (currentState === 0) {
			$nav.on(expandEvent, recalcSecondaryHeight);
		} else {
			recalcSecondaryHeight();
		}

		if (shiftContent) {
			$cWrapper.css(cssPaddingTop, navigationRowHeight);
		}

		// look for no secondary links
		if (!$('li > a', secondaryLists).length) {
			navWrap.addClass(empty2ndCls);
		} else { // look for entire empty rows
			$bar_starts.each(function() {
				var $primary_bar = $(this).nextUntil(barStartSel).addBack();
				if (!$('> ul li > a', $primary_bar).length) {
					$primary_bar.addClass(emptyRowCls);
				}
			});
		}

		$nav.trigger('fixed', [navigationRowHeight]);
		WDN.log('we have fixed the presentation.');
	};

	var startCollapseDelay = function() {
		WDN.log('start collapse delay');
		clearTimeout(timeout);
		if (currentState === 0) {
			// Already collapsed
			return;
		}
		timeout = setTimeout(Plugin.collapse, collapseDelay);
	};

	var switchSiteNavigation = function(event, expand) {
		WDN.log('Switch site nav called');
		if (expand === undefined) {
			expand = true;
		}
		var breadcrumb = event.target || event;

		if (!breadcrumb) {
			return false;
		}

		var breadcrumbParent = $(breadcrumb).parent(),
			$navList = $(navSel + ' > ul');

		$navList.children('li').removeClass(highlightClass);

		if (!breadcrumbParent.length || breadcrumbParent.hasClass(selectedClass)) {
			WDN.log('already showing this nav');
			return true;
		}

		var isAfterHome = !!breadcrumbParent.prevAll().filter(homepageCrumb).length,
			oldSelected = $(breadPrmySel + '.' + selectedClass).first(),
			foundInCurrent = false,
			pendCls = 'pending';

		// Look for link in existing/stored navigation
		if (isAfterHome) {
			// If the home navigation is currently displayed
			if ($(homepageCrumb).hasClass(selectedClass)) {
				$('a', $navList).each(function() {
					if (this.href == breadcrumb.href) {
						foundInCurrent = true;
						$(this).parents(navPrmySel).addClass(highlightClass);
						return false;
					}
				});

				if (foundInCurrent) {
					WDN.log('Link found in home navigation');
					return true;
				}
			}

			// Check stored navigation up to selected
			var $previousCrumbs = breadcrumbParent.prevUntil('.' + selectedClass);

			$previousCrumbs.each(function() {

				var $storedNav = $(this).children('.' + storeCls);

				if ($storedNav.length) {
					$('a', $storedNav.children()).each(function() {
						if (this.href == breadcrumb.href) {
							foundInCurrent = true;
							var tempPrimary = $(this).parents('.' + storeCls + ' ' + prmySel);
							tempPrimary.addClass(highlightClass);

							setNavigationContents($storedNav.children().clone(), expand);

							tempPrimary.removeClass(highlightClass);

							return false;
						}
					});
				}

				if (foundInCurrent) {
					oldSelected.removeClass(selectedClass);
					$(this).addClass(selectedClass);

					return false;
				}
			});

			if (foundInCurrent) {
				WDN.log('Link found in stored navigation');
				return true;
			}
		}

		var sanitizeNav = function($list) {
			return $list
				.find('li.empty').remove().end()
				.find('*').removeAttr('style class').end()
				.find('a').each(function() {
					$(this).attr('href', this.href);
				}).end()
				.html();
		};

		var $storedNav = $(breadcrumb).siblings('.' + storeCls),
			oldNavCompare = sanitizeNav($navList.clone());

		if ($storedNav.length) {
			WDN.log("Already got it.");
			// We've already grabbed the nav for this link
			var $storedChildren = $storedNav.children();

			if (!$storedChildren.length) {
				WDN.log('Duplicated navigation previously loaded');
				return true;
			}

			if (isAfterHome) {
				var newNavCompare = sanitizeNav($storedChildren.clone());

				if (oldNavCompare == newNavCompare) {
					WDN.log('Duplicate navigation detected.');
					return true;
				}
			}

			if (!$('.' + storeCls, oldSelected).length) {
				storeNav(oldSelected, $navList);
			}

			oldSelected.removeClass(selectedClass);
			breadcrumbParent.addClass(selectedClass);

			setNavigationContents($storedChildren.clone(), expand);
			return true;
		}

		// Fetch the navigation
		$(breadPrmySel).removeClass(pendCls);
		$(breadcrumb).parent().addClass(pendCls);

		Plugin.fetchSiteNavigation(breadcrumb.href, function(data, textStatus) {
			try {
				if (textStatus == 'success') {
					var $temp = $('<div/>').append(data).children('ul');

					if (!isAfterHome || $temp.html() != oldNavCompare) {
						if (!$('.' + storeCls, oldSelected).length) {
							storeNav(oldSelected, $navList);
						}

						storeNav(breadcrumbParent, $temp.clone());

						if (breadcrumbParent.hasClass(pendCls)) {
							// Set the hovered breadcrumb link to selected
							oldSelected.removeClass(selectedClass);
							breadcrumbParent.removeClass(pendCls).addClass(selectedClass);

							setNavigationContents($temp, expand);
						}
					} else {
						storeNav(breadcrumbParent, '');
					}
				} else {
					// Error message
					WDN.log('Incorrect status code returned remotely retrieving navigation.');
					WDN.log(data);
					WDN.log(textStatus);
				}
			} catch(e) {
				WDN.log('Caught error remotely retrieving navigation.');
				WDN.log(e);
			}
		});
		return false;
	};

	var storeNav = function(li, data) {
		var storednavDiv = $(li).children('.' + storeCls);
		if (storednavDiv.length) {
			storednavDiv.empty();
		} else {
			storednavDiv = $('<div/>', {'class' : storeCls});
			$(li).append(storednavDiv);
		}
		storednavDiv.append(data);
	};

	var setNavigationContents = function(contents, expand) {
		WDN.log('setNavigationContents called');
		$(navSel)
			.children('ul').remove().end()
			.prepend(contents);

		fixPresentation();

		if (expand) {
			Plugin.expand();
		}
	};

	var setWrapperClass = function(onClass) {
		var $wrapper = $(wdnWrapSel);
		var offClass;
		var prefix = 'nav_';

		$wrapper.removeClass(prefix + changingClass);
		offClass = onClass === collapsedClass ? expandedClass : collapsedClass;
		$wrapper.removeClass(prefix + offClass).addClass(prefix + onClass);
	};

	var navReady = function(ready) {
		var $wrapper = $(wdnWrapSel), cls = 'nav_ready';
		if (ready) {
			$wrapper.addClass(cls);
		} else {
			$wrapper.removeClass(cls);
		}
	};

	var setRootScrollState = function() {
		var cssTemp = {};

		// allow content scrolling
		cssTemp[cssHeight] = cssTemp[cssOverflow] = '';

		if (!isFullNav()) {
			if (currentState !== 0) {

				// disable content scrolling
				cssTemp[cssHeight] = '100%';
				cssTemp[cssOverflow] = 'hidden';
			}
		}

		$(rootSelector).css(cssTemp);
	};

	var calculateHeaderOffset = function() {
		var $wrapper = $(wdnWrapSel);
		var $header = $(headerSelector);
		var barOffset = 0;
		var isFull = isFullNav();
		var cssMarginBottom = 'margin-bottom';

		// account for the fixed breadcrumb space
		if (isFull && $wrapper.hasClass(scrollingClass)) {
			barOffset = $(navBarSelector).outerHeight();
		}

		if (barOffset) {
			$header.css(cssMarginBottom, barOffset + pixelUnit);
		} else {
			$header.css(cssMarginBottom, '');
		}

		$header.trigger('fixedoffset', [barOffset]);
	};

	var fixNavButton = function() {

		var $navToggleLabel = $('.wdn-content-slide label[for="wdn_menu_toggle"]');

		//Remove the nav input
		//$(menuTogSel).hide();

		//handle the label (this should be a button when sends focus)
		var $navToggleButton = $('<button>');
		$navToggleButton.html('<span class="wdn-icon-menu" aria-hidden="true"></span><span class="wdn-text-hidden">Menu</span>'); //Make sure they have the same HTML contents
		$navToggleButton.addClass('wdn-nav-toggle');

		//Handle click events
		$([$navToggleButton]).each(function(index, $button) {
			$button.on('click', function() {
				toggleNav();
			});
		});

		$navToggleLabel.replaceWith($navToggleButton);

		$('#wdn_navigation_bar').before($('.wdn-menu-trigger'));

		//Make the navigation pragmatically focusable
		$(navSel).attr('tabindex', '-1');
	};

	var toggleNav = function() {
		var $navInput = $(menuTogSel);

		//toggle nav
		if ($navInput.is(':checked')) {
			Plugin.collapse();

			//Unlock hover
			lockHover = false;
		} else {
			Plugin.expand();

			//Lock hover
			lockHover = true;

			//Send focus
			$(navSel).focus();
		}
	};

	var Plugin = {
		initialize : function() {
			$(function () {
				if (!initd) {
					fixNavButton();
					determineSelectedBreadcrumb();
					linkSiteTitle();
				}

				if ($('body').is(stopSelector) || !$(navPrmySel).length) {
					// The rest deals with navigation elements not in document
					return;
				}

				WDN.log('let us fix the presentation');
				fixPresentation(true);
				// the built JS will probably run before the web-font loads, so re-render on load
				$(window).load(function() {
					fixPresentation(true);
				});

				if (!initd) {
					// add an expand toggler UI element
					var $toggler = $(menuTogSel);
					$toggler.change(function() {
						if (currentState === 0) {
							lockHover = true;
							Plugin.expand();
						} else {
							lockHover = false;
							Plugin.collapse();
						}
					});

					var nav = $(navSel);
					var onscroll = function() {
						var breadcrumbs = $(breadSel);
						var wrp = $(wdnWrapSel);
						var isFull = isFullNav();
						var trig = $(headerSelector);

						if (isFull && currentState === 1) {
							Plugin.collapse();
						}

						if ($(window).scrollTop() >= trig.offset().top + trig.outerHeight()) {
							wrp.addClass(scrollingClass);
						} else {
							wrp.removeClass(scrollingClass);
						}

						calculateHeaderOffset();
					};

					// pin the navigation
					onscroll();
					$(window).on('scroll', throttle(onscroll, scrollThrottle));

					var navWidth = nav.width();
					$(window).on('resize', debounce(function() {
						setRootScrollState();

						if (nav.width() === navWidth) {
							return;
						}
						navWidth = nav.width();

						fixPresentation(true);
						calculateHeaderOffset();
					}, resizeThrottle));

					$(navPrmySel + ' > a').focusin(function(){
						Plugin.expand();
					})
					.focus(function(){
						switchSiteNavigation($homepageCrumbLink[0], false);
					});

					$(navSel).focusout(function(event) {
						var $target = $(event.target);
						var $last = $(navSel + ' a').last();

						if ($target.is($last)) {
							Plugin.collapse();
						}
					});

					var mouseout = function() {
						if (!lockHover) {
							startCollapseDelay();
						}
					};
					Plugin.collapse(false);

					require([hoverPlugin], function() {
						$(navBarSelector).hoverIntent({
							over: function() {
								if (!lockHover) {
									Plugin.expand();
								}
							},
							out:		 mouseout,
							timeout:	 expandDelay,
							sensitivity: 1, // Mouse must not move
							interval:	120
						});

						$(breadPrmySel + ' a').hoverIntent({
							over: switchSiteNavigation,
							out: function() {
								$(navPrmySel).removeClass(highlightClass);
							},
							sensitivity: 1, // Mouse must not move
							interval:	120
						});
					});

					redrawWait(function(){
						navReady(true);
					});
				}

				initd = true;
			});
		},

		expand : function() {
			WDN.log('expand called');
			if (expandSemaphore || currentState === 1) {
				return;
			}
			expandSemaphore = true;

			$(menuTogSel)[0].checked = true;
			$(navButton).attr('aria-pressed', 'true');
			setWrapperClass(changingClass);

			var go = function() {
				currentState = 1;
				expandSemaphore = false;
				setRootScrollState();

				setWrapperClass(expandedClass);
				$(navSel).trigger(expandEvent).off(expandEvent);
			};

			if (Plugin.currentState !== -1) {
				setTimeout(go, transitionDelay);
			}
		},

		collapse : function(switchNav) {
			WDN.log('collapse called');
			if (expandSemaphore || currentState === 0) {
				return;
			}
			expandSemaphore = true;

			$(menuTogSel)[0].checked = false;
			$(navButton).removeAttr('aria-pressed');
			setWrapperClass(collapsedClass);

			var go = function() {
				currentState = 0;
				expandSemaphore = false;
				setRootScrollState();

				if (switchNav !== false) {
					switchSiteNavigation($homepageCrumbLink[0], false);
				}
			};

			if (switchNav !== false) {
				setTimeout(go, transitionDelay);
				return;
			}

			go();
		},

		getSiteHomepage : function() {
			return siteHomepage;
		},

		fetchSiteNavigation : function(url, complete) {
			var nav_sniffer = snifferServer;
			nav_sniffer += '?u=' + encodeURIComponent(url);
			WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
			$.get(nav_sniffer, '', complete);
		}
	};

	return Plugin;
});
