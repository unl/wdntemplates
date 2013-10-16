define(['jquery', 'wdn', 'modernizr', 'require'], function($, WDN, Modernizr, require) {
	
	
	var lockHover = false,
		initd = false,
		min = '',
		snifferServer = '//www1.unl.edu/wdn/templates_3.0/scripts/',
		fullNavBp = '(min-width: 700px)',
		hoverPlugin = 'plugins/hoverIntent/jquery.hoverIntent',
		swipePlugin = 'plugins/mobile/jquery.mobile.custom',
		expandSemaphore = false,
		expandDelay = 400,
		collapseDelay = 120,
		resizeThrottle = 500,
		homepageLI, siteHomepage, timeout, scrollTimeout, resizeTimeout,
		currentState = -1,
		cWrapSel = '#wdn_content_wrapper',
		wdnWrapSel = '#wdn_wrapper',
		breadSel = '#breadcrumbs',
		navSel = '#navigation',
		prmySel = '> ul > li',
		barStartSel = ':nth-child(6n+1)',
		navPrmySel = navSel + ' ' + prmySel,
		breadPrmySel = breadSel + ' ' + prmySel,
		menuTogSel = '#wdn_menu_toggle',
		padCss = 'padding-top',
		storeCls = 'storednav',
		empty2ndCls = 'empty-secondary',
		emptyRowCls = 'row-empty',
		sldCls = 'selected',
		hltCls = 'highlight';
	
	var isFullNav = function() {
		return Modernizr.mq(fullNavBp);
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
		
		$breadcrumbs.removeClass(sldCls);
		
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
			
			if (!$breadcrumbs.filter('.' + sldCls).length) {
				WDN.log('We are on the current homepage.');
				setHomepageLI($breadcrumbs[$breadcrumbs.length-1]);
			}
		}
		
		$('> a', $breadcrumbs).last().parent().addClass('last-link');
	};
	
	var setHomepageLI = function(li) {
		homepageLI = li;
		var $li = $(li);
		$li.addClass(sldCls);
		
		var $homeCrumbLink = $li.children('a');
		
		if (!siteHomepage) {
			if ($homeCrumbLink.length) {
				siteHomepage = $homeCrumbLink[0].href;
			} else {
				siteHomepage = window.location.toString();
			}
		}
		
		if (!$homeCrumbLink.length) {
			$li.wrapInner($('<a/>', {href : siteHomepage}));
		}
	};
	
	var linkSiteTitle = function() {
		var $siteTitle = $('#wdn_site_title > span'), $link;
		
		// check if the link already exists
		if (!siteHomepage || $siteTitle.children('a').length) {
			return;
		}
		
		$link = $siteTitle.children().not('span');
		if (!$link.length) {
			// remove excess space text nodes see #371
			$siteTitle.contents().filter(function() {
				return this.nodeType == 3 && /^\s*$/.test(this.nodeValue);
			}).remove();
			$link = $siteTitle.contents().filter(function() {
				return this.nodeType == 3;
			});
		}
		
		// create the link using whatever the Homepage is set to
		$link.wrap($('<a/>', {href : siteHomepage}));
	};
	
	var fixPresentation = function() {
		var primaries = $(navPrmySel),
			secondaryLists = $('> ul', primaries),
			primaryLinks = $('> a', primaries),
			$nav = $(navSel);
		
		$nav.off('expand');
		primaryLinks.css({
			'padding-top' : '',
			'padding-bottom' : ''
		});
		
		if (!isFullNav()) {
			secondaryLists.css('height', '');
			return;
		}
		
		var navWrap = $('#wdn_navigation_wrapper');
		navWrap.removeClass(empty2ndCls);
		
		var primaryCount = primaries.length, fakePrimaries = [];
		while (primaryCount % 6 > 0) {
			fakePrimaries.push($('<li class="empty"><a /><ul class="empty"><li/></ul></li>')[0]);
			primaryCount++;
		}
		if (fakePrimaries.length) {
			$('> ul', $nav).append(fakePrimaries);
			primaries = $(navPrmySel);
			primaryLinks = $('> a', primaries);
		}
		primaries.removeClass(emptyRowCls);

		var secondaries = primaries.has('ul');
		if (secondaries.length) {
			primaries.not(secondaries).each(function(){
				$(this).append('<ul class="empty"><li/></ul>');
			});
			secondaryLists = $('> ul', primaries);
		}
		
		// css3 selector fixes
		var $bar_starts = $(navPrmySel + barStartSel);
		if (!Modernizr['css-nthchild']) {
			$bar_starts.addClass('start');
			$(navPrmySel + ':nth-child(6n+6)').addClass('end');
			$(navPrmySel + ':nth-child(n+7)').addClass('mid-bar');
			$bar_starts.last().prevAll().addClass('top-bars');
		}
		if (!Modernizr['css-lastchild']) {
			$(navPrmySel + ' ul li:last-child').addClass('last');
		}

		var ah = [];
		primaryLinks.each(function(i){
			var row = Math.floor(i/6);
			var height = $(this).outerHeight();
			if (!ah[row] || height > ah[row]) {
				ah[row] = height;
			}
		});

		primaryLinks.each(function(i){
			var row = Math.floor(i/6),
				height = $(this).outerHeight(),
				pad = parseFloat($(this).css(padCss));

			if (height < ah[row]) {
				var ah_temp = (ah[row] - height) / 2,
					new_ah = [Math.floor(ah_temp), Math.ceil(ah_temp)];

				$(this).css({
					'padding-top' : new_ah[0] + pad + 'px',
					'padding-bottom' : new_ah[1] + pad + 'px'
				});
			}
		});

		var recalcSecondaryHeight = function() {
				WDN.log('fixing secondaries');
				var ul_h = [];
				secondaryLists.css('height', '').each(function(i){
					var row = Math.floor(i/6), height = $(this).height();
					if (!ul_h[row] || height > ul_h[row]) {
						ul_h[row] = height;
					}
				});
				//loop through again and apply new height
				secondaryLists.each(function(i){
					var row = Math.floor(i/6);
					$(this).css({'height':ul_h[row]+'px'});
				});
			};
		
		if (currentState == 0) {
			$nav.on('expand', recalcSecondaryHeight);
		} else {
			recalcSecondaryHeight();
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

		WDN.log('we have fixed the presentation.');
	};
	
	var applyStateFixes = function() {
		var $cWrapper = $(cWrapSel);
		$cWrapper.css(padCss, '');
		
		if (!isFullNav()) {
			return;
		}
		
		if (currentState === 0) {
			var nav_height = $(navSel).outerHeight();
			$cWrapper.css(padCss, nav_height);
		}
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
		
		$navList.children('li').removeClass(hltCls);
		
		if (breadcrumbParent.hasClass(sldCls)) {
			WDN.log('already showing this nav');
			return true;
		}
		
		var isAfterHome = !!breadcrumbParent.prevAll().filter(homepageLI).length,
			oldSelected = $(breadPrmySel + '.' + sldCls).first(),
			foundInCurrent = false,
			pendCls = 'pending';
		
		// Look for link in existing/stored navigation
		if (isAfterHome) {
			// If the home navigation is currently displayed
			if ($(homepageLI).hasClass(sldCls)) {
				$('a', $navList).each(function() {
					if (this.href == breadcrumb.href) {
						foundInCurrent = true;
						$(this).parents(navPrmySel).addClass(hltCls);
						return false;
					}
				});
				
				if (foundInCurrent) {
					WDN.log('Link found in home navigation');
					return true;
				}
			}
			
			// Check stored navigation up to selected
			var $previousCrumbs = breadcrumbParent.prevUntil('.' + sldCls);
			
			$previousCrumbs.each(function() {
				
				var $storedNav = $(this).children('.' + storeCls);
				
				if ($storedNav.length) {
					$('a', $storedNav.children()).each(function() {
						if (this.href == breadcrumb.href) {
							foundInCurrent = true;
							var tempPrimary = $(this).parents('.' + storeCls + ' ' + prmySel);
							tempPrimary.addClass(hltCls);
							
							setNavigationContents($storedNav.children().clone(), expand);
							
							tempPrimary.removeClass(hltCls);
							
							return false;
						}
					});
				}
				
				if (foundInCurrent) {
					oldSelected.removeClass(sldCls);
					$(this).addClass(sldCls);
					
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
			
			oldSelected.removeClass(sldCls);
			breadcrumbParent.addClass(sldCls);
			
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
							oldSelected.removeClass(sldCls);
							breadcrumbParent.removeClass(pendCls).addClass(sldCls);
							
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
	
	var setWrapperClass = function(css_class) {
		var $wrapper = $(wdnWrapSel), offClass, prefix = 'nav_';
		$wrapper.removeClass(prefix + 'changing');
		offClass = css_class == 'collapsed' ? 'expanded' : 'collapsed';
		$wrapper.removeClass(prefix + offClass).addClass(prefix + css_class);
	};
	
	var navReady = function(ready) {
		var $wrapper = $(wdnWrapSel), cls = 'nav_ready';
		if (ready) {
			$wrapper.addClass(cls);
		} else {
			$wrapper.removeClass(cls);
		}
	};
	
	var initializePreferredState = function() {
		WDN.log('initializepreferredstate, current state is '+ currentState);
		var mouseout = function() {
			if (!lockHover) {
				startCollapseDelay();
			}
		};
		Plugin.collapse(false);
		applyStateFixes();

		WDN.loadJQuery(function() {
			require([hoverPlugin + min], function() {
				$('#wdn_navigation_bar').hoverIntent({
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
						$(navPrmySel).removeClass(hltCls);
					},
					sensitivity: 1, // Mouse must not move
					interval:	120
				});
			});
		});
		
		navReady(true);
	};
	
	var Plugin = {
		initialize : function() {
			$(function () {
				if (!initd) {
					determineSelectedBreadcrumb();
					linkSiteTitle();
				}
				
				if ($('body').is('.document, .terminal') || !$(navPrmySel).length) {
					// The rest deals with navigation elements not in document
					return;
				}
				
				var body = $('body');
				if (!body.length || !body.is('.debug')) {
					min = '.min';
				}
	
				WDN.log('let us fix the presentation');
				fixPresentation();
				// the built JS will probably run before the web-font loads, so re-render on load
				$(window).load(fixPresentation);
	
				if (!initd) {
					// add an expand toggler UI element
					var $toggler = $(menuTogSel);
					$toggler.change(function() {
						lockHover = this.checked;
						if (currentState === 0) {
							Plugin.expand();
						} else {
							Plugin.collapse();
						}
					});
					
					require([swipePlugin + min], function() {
						$.event.special.swipe.horizontalDistanceThreshold = 75;
						$.event.special.swipe.verticalDistanceThreshold = 30;
						$('body').on('swiperight', function() {
							if (!isFullNav() && currentState === 0) {
								Plugin.expand();
							}
						});
						$('body').on('swipeleft', function() {
							if (!isFullNav() && currentState === 1) {
								Plugin.collapse();
							}
						});
					});
					
					var nav = $(navSel);
					nav.on('reshift', applyStateFixes);
					var onscroll = function() {
//						don't clear the timeout (wait for last event) as it causes poor UX
//						clearTimeout(scrollTimeout);
						scrollTimeout = setTimeout(function() {
							var breadcrumbs = $(breadSel), wrp = $(wdnWrapSel),
							cls = 'nav-scrolling', trig;
							
							if (isFullNav() && currentState !== 0) {
								Plugin.collapse();
							}
							
							if (isFullNav() && breadcrumbs.is(':visible')) {
								trig = breadcrumbs;
							} else {
								trig = $('#header');
							}
							
							if ($(window).scrollTop() >= trig.offset().top + trig.height()) {
								wrp.addClass(cls);
							} else {
								wrp.removeClass(cls);
							}
						}, 50);
					};
					// pin the navigation 
					onscroll();
					$(window).on('scroll', onscroll);
					
					var navWidth = nav.width();
					$(window).on('resize', function() {
						clearTimeout(resizeTimeout);
						resizeTimeout = setTimeout(function() {
							if (nav.width() === navWidth) {
								return;
							}
							navWidth = nav.width();
							
							fixPresentation();
							applyStateFixes();
						}, resizeThrottle);
					});
				
					$(navPrmySel + ' > a').focusin(function(){
						Plugin.expand();
					})
					.focus(function(){
						switchSiteNavigation($(homepageLI).children('a').get(0), false);
					});
		
					initializePreferredState();
				}
				
				initd = true;
			});
		},
		
		/**
		 * Expand the navigation section.
		 */
		expand : function() {
			WDN.log('expand called');
			if (expandSemaphore || currentState === 1) {
				return;
			}
			expandSemaphore = true;

			var expandEnd = function() {
				if (!isFullNav()) {
					// prevent content scrolling
					$('html').css({
						'height': '100%',
						'overflow': 'hidden' 
					});
					$(cWrapSel).on('touchmove', function(e) {
						e.preventDefault();
					});
				}
				
				setWrapperClass('expanded');
				$(navSel).trigger('expand').off('expand');
			};
			if (Plugin.currentState !== -1 && Modernizr.csstransitions) {
				setWrapperClass('changing');
				setTimeout(function() {
					expandEnd();
				}, 400);
			} else {
				expandEnd();
			}

			currentState = 1;
			$(menuTogSel)[0].checked = true;
			expandSemaphore = false;
		},

		/**
		 * Collapse the navigation
		 */
		collapse : function(switchNav) {
			WDN.log('collapse called');
			if (expandSemaphore || currentState === 0) {
				return;
			}
			expandSemaphore = true;

			
			setWrapperClass('collapsed');
			currentState = 0;
			$(menuTogSel)[0].checked = false;
			
			var go = function() {
				if (!isFullNav()) {
					// allow content scrolling
					$('html').css({
						'height': '',
						'overflow': '' 
					});
					$(cWrapSel).off('touchmove');
				}
				
				if (switchNav !== false) {
					switchSiteNavigation($(homepageLI).children('a').get(0), false);
				};
			};
				
			if (Modernizr.csstransitions) {
				setTimeout(go, 400);
			} else {
				go();
			}
			
			expandSemaphore = false;
		},
		
		getSiteHomepage : function() {
			return siteHomepage;
		},
		
		fetchSiteNavigation : function(url, complete) {
			var nav_sniffer = snifferServer + 'navigationSniffer.php';
			nav_sniffer += '?u=' + encodeURIComponent(url);
			WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
			$.get(nav_sniffer, '', complete);
		}
	};
	
	return Plugin;
});
