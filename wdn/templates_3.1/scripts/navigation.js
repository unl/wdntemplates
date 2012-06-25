WDN.navigation = (function() {
    var lastWidth,
    	lockHover = false,
    	snifferServer = 'http://www1.unl.edu/wdn/templates_3.0/scripts/',
    	desktopInitd = false;
    return {

        preferredState : 0,

        currentState : -1,

        /**
         * URL determined to be this site's homepage
         */
        siteHomepage : false,

        /**
         * DOM element for the "HOME" LI
         */
        homepageLI : false,

        /**
         * Stores an expand/collapse timeout.
         */
        timeout : false,

        /**
         * The delay before expand occurs
         */
        expandDelay : 400,

        /**
         * The delay before collapse occurs
         */
        collapseDelay : 120,

        changeSiteNavDelay : 400,

        /**
         * Initialize the navigation, and determine what the correct state
         * should be (expanded/collapsed).
         */
        initialize : function() {
        	lastWidth = document.documentElement.offsetWidth;
        	var widthScript = WDN.getCurrentWidthScript();
        	if (widthScript == '320') {
        		WDN.navigation.setupMobile();
        		return;
        	}
        	
            if (WDN.jQuery('body').hasClass('popup') || !WDN.jQuery('#breadcrumbs > ul > li').length) {
                // This page has no navigation
                return;
            }

            if (!desktopInitd) {
	            WDN.navigation.determineSelectedBreadcrumb();
	            WDN.navigation.linkSiteTitle();
            }
            
            if (WDN.jQuery('body').hasClass('document') || !WDN.jQuery('#navigation > ul > li').length) {
            	// The rest deals with navigation elements not in document
            	return;
            }

            if (!desktopInitd) {
            	// Store the current state of the cookie
	            if (WDN.getCookie('n') == 1) {
	                WDN.navigation.preferredState = 1;
	            }
            }

            WDN.log('let us fix the presentation');
            WDN.navigation.fixPresentation();

            if (!desktopInitd) {
	            // add an expand toggler UI element
	            var $toggler = WDN.jQuery('<div class="expand_toggle"><a href="#" title="Click to expand/collapse navigation" /></div>').prependTo('#wdn_navigation_wrapper');
	            $toggler.children('a').click(function(evt) {
	                if (WDN.navigation.currentState === 0) {
	                    WDN.navigation.expand();
	                } else {
	                    WDN.navigation.collapse();
	                }
	                return false;
	            });
	            $toggler.hover(function() {
	                lockHover = !lockHover;
	                WDN.jQuery('#wdn_navigation_bar').mouseout();
	            }, function() {
	                lockHover = !lockHover;
	                WDN.jQuery('#wdn_navigation_bar').mouseover();
	            });
	
	            // add the pinned state UI element
	            var $pin = WDN.jQuery('<div class="pin_state"><a href="#" /></div>').appendTo('#wdn_navigation_wrapper');
	            $pin.children('a').click(function(evt) {
	                WDN.navigation.setPreferredState(evt);
	                return false;
	            });
            }
            
            WDN.jQuery('#navigation > ul > li > a').focusin(function(){
                WDN.navigation.expand();
            })
            .focus(function(){
            	WDN.navigation.switchSiteNavigation(WDN.jQuery(WDN.navigation.homepageLI).children('a').get(0), false);
        	});

            WDN.navigation.initializePreferredState();
            
            WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/hoverIntent/jQuery.hoverIntent.min.js'), function() {
                WDN.jQuery('#breadcrumbs ul li a').hoverIntent({
                    over:        WDN.navigation.switchSiteNavigation,
                    out:         function() {
                    	WDN.jQuery('#navigation > ul > li').removeClass('highlight');
                    },
                    sensitivity: 1, // Mouse must not move
                    interval:    120
                });
            });
            
            desktopInitd = true;
        },
        
        /**
         * This function should determine which breadcrumb should be selected.
         */
        determineSelectedBreadcrumb : function() {
        	// First we search for a defined homepage.
        	var $homeLink = WDN.jQuery('link[rel=home]');
        	if ($homeLink.length) {
        		WDN.log('Setting homepage to ' + WDN.navigation.siteHomepage);
        		WDN.navigation.siteHomepage = WDN.toAbs($homeLink.attr('href'), window.location.toString());
        	}
        	
        	var $breadcrumbs = WDN.jQuery('#breadcrumbs > ul > li');
        	if (!$breadcrumbs.length) {
        		WDN.log('This page is missing breadcrumbs');
        		return;
        	}
        	
        	$breadcrumbs.removeClass('selected');
        	
        	if (WDN.navigation.siteHomepage === false) {
        		WDN.log('No homepage set!');
        		if ($breadcrumbs.length < 2) {
        			WDN.navigation.setHomepageLI($breadcrumbs[0]);
        		} else {
        			// Right now, stupidly select the second element.
        			WDN.navigation.setHomepageLI($breadcrumbs[1]);
        		}
        	} else {
        		WDN.log('Homepage has been set.');
        		WDN.jQuery('> a', $breadcrumbs).each(function() {
    				if (this.href == WDN.navigation.siteHomepage) {
    					WDN.navigation.setHomepageLI(WDN.jQuery(this).parent());
    					return false;
    				}
        		});
        		
        		if (!$breadcrumbs.filter('.selected').length) {
        			WDN.log('We are on the current homepage.');
        			WDN.navigation.setHomepageLI($breadcrumbs[$breadcrumbs.length-1]);
        		}
        	}
        	
        	WDN.jQuery('> a', $breadcrumbs).last().parent().addClass('last-link');
        },
        
        setHomepageLI: function(li) {
        	WDN.navigation.homepageLI = li;
            var $li = WDN.jQuery(li);
            $li.addClass('selected');
            
            var $homeCrumbLink = $li.children('a');
            
            if (!WDN.navigation.siteHomepage) {
            	if ($homeCrumbLink.length) {
            		WDN.navigation.siteHomepage = WDN.toAbs($homeCrumbLink.attr('href'), window.location.toString());
            	} else {
            		WDN.navigation.siteHomepage = window.location.toString();
            	}
            }
            
            if (!$homeCrumbLink.length) {
            	$li.wrapInner(WDN.jQuery('<a/>', {href : WDN.navigation.siteHomepage}));
            }
        },
        
        /**
         * This function will check for/add a link to the homepage in the site title.
         */
        linkSiteTitle: function() {
        	var $siteTitle = WDN.jQuery('#wdn_site_title');
        	
        	// check if the link already exists
            if (!WDN.navigation.siteHomepage || $siteTitle.children('a').length) {
                return;
            }
            
            // create the link using whatever the Homepage is set to
            $siteTitle.contents().filter(function() {
            	return this.nodeType == 3;
            }).first().wrap(WDN.jQuery('<a/>', {href : WDN.navigation.siteHomepage}));
        },

        /**
         * This function cleans up the navigation visual presentations
         */
        fixPresentation : function() {
        	WDN.jQuery('#wdn_navigation_wrapper').removeClass('empty-secondary');
        	
            var primaries = WDN.jQuery('#navigation > ul > li');
            var primaryCount = primaries.length, fakePrimaries = [];
            while (primaryCount % 6 > 0) {
                fakePrimaries.push(WDN.jQuery('<li class="empty"><a /><ul class="empty"><li/></ul></li>')[0]);
                primaryCount++;
            }
            WDN.jQuery('#navigation > ul').append(fakePrimaries);
            primaries = WDN.jQuery('#navigation > ul > li');

            var secondaries = primaries.has('ul');
            if (secondaries.length) {
                primaries.not(':has(ul)').each(function(){
                    WDN.jQuery(this).append('<ul class="empty"><li/></ul>');
                });
            }

            // css3 selector fixes
            var $html = WDN.jQuery(document.documentElement),
            	$bar_starts = WDN.jQuery('#navigation > ul > li:nth-child(6n+1)');
            if ($html.hasClass('no-css-nthchild')) {
                $bar_starts.addClass('start');
                WDN.jQuery('#navigation > ul > li:nth-child(6n+6)').addClass('end');
                WDN.jQuery('#navigation > ul > li:nth-child(n+7)').addClass('mid-bar');
                $bar_starts.last().prevAll().addClass('top-bars');
            }
            if ($html.hasClass('no-css-lastchild')) {
                WDN.jQuery('#navigation > ul > li ul li:last-child').addClass('last');
            }

            var ah = [];
            var primaryLinks = WDN.jQuery('> a', primaries).css({
            	'padding-top' : '',
                'padding-bottom' : ''
            });
            primaryLinks.each(function(i){
                var row = Math.floor(i/6);
                var height = WDN.jQuery(this).outerHeight();
                if (!ah[row] || height > ah[row]) {
                    ah[row] = height;
                }
            });

            primaryLinks.each(function(i){
                var row = Math.floor(i/6);
                var height = WDN.jQuery(this).outerHeight();
                var pad = parseFloat(WDN.jQuery(this).css('padding-top'));
                if (height < ah[row]) {
                    var ah_temp = (ah[row] - height) / 2,
                    	new_ah = [Math.floor(ah_temp), Math.ceil(ah_temp)];

                    WDN.jQuery(this).css({
                        'padding-top' : new_ah[0] + pad + 'px',
                        'padding-bottom' : new_ah[1] + pad + 'px'
                    });
                }
            });

            var secondaryLists = WDN.jQuery('> ul', primaries),
        		recalcSecondaryHeight = function() {
		            var ul_h = [];
		            secondaryLists.css('height', '').each(function(i){
		                var row = Math.floor(i/6), height = WDN.jQuery(this).height();
		                if (!ul_h[row] || height > ul_h[row]) {
		                    ul_h[row] = height;
		                }
		            });
		            //loop through again and apply new height
		            secondaryLists.each(function(i){
		                var row = Math.floor(i/6);
		                WDN.jQuery(this).css({'height':ul_h[row]+'px'});
		            });
	            };
            
            if (WDN.navigation.currentState == 0) {
            	WDN.jQuery('#navigation').bind('expand', recalcSecondaryHeight);
            } else {
            	recalcSecondaryHeight();
            }

            // look for no secondary links
            if (!WDN.jQuery('li > a', secondaryLists).length) {
            	WDN.jQuery('#wdn_navigation_wrapper').addClass('empty-secondary');
            } else { // look for entire empty rows
	            $bar_starts.each(function() {
	            	var $primary_bar = WDN.jQuery(this).nextUntil(':nth-child(6n+1)').andSelf();
	            	if (!WDN.jQuery('> ul li > a', $primary_bar).length) {
	            		$primary_bar.addClass('row-empty');
	            	}
	            });
            }

            // Fix liquid box-sizing
            if (WDN.jQuery('body').hasClass('liquid') && $html.hasClass('no-boxsizing')) {
                // Fix box-size
                var firstRun = true;
                var resizeFunc = function() {
                    var $wrapper = WDN.jQuery('#wdn_navigation_wrapper');

                    $wrapper.css('width', '');
                    $wrapper.css('padding-right', 0);
                    $wrapper.each(function() {
                        var contentWidth = WDN.jQuery(this).width();
                        var outerWidth = WDN.jQuery(this).outerWidth();
                        WDN.jQuery(this).css('width', contentWidth * 2 - outerWidth);
                    });

                };
                resizeFunc();
                WDN.jQuery(window).unbind('resize.wdn_navigation').bind('resize.wdn_navigation', resizeFunc);
            }

            WDN.log('we have fixed the presentation.');
        },
        
        /**
         * This function determines the user's preference for navigation.
         * There are two options, expanded or collapsed.
         */
        initializePreferredState : function() {
            WDN.log('initializepreferredstate, current state is '+WDN.navigation.currentState);

            WDN.jQuery('#navigation').addClass('disableTransition');
            var mouseout;
            var pinUI = WDN.jQuery('#wdn_navigation_wrapper .pin_state a');

            if (WDN.navigation.preferredState == 1) {
                mouseout = WDN.jQuery.noop;
                pinUI.attr('title', 'Click to un-pin');
                WDN.navigation.expand();
            } else {
                mouseout = function() {
                    if (!lockHover) {
                        WDN.navigation.startCollapseDelay();
                    }
                };
                pinUI.attr('title', 'Click to pin open');
                WDN.navigation.collapse(false);
            }

            WDN.navigation.applyStateFixes();

            var endCount = 0;
            if (Modernizr.csstransitions) {
                WDN.jQuery('#navigation').bind(
                    'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd',
                    function(event) {
                    	endCount++;
                        if (WDN.navigation.currentState == 1 && endCount >= 6) {
                            WDN.navigation.transitionEnd();
                            endCount = 0;
                        }
                    }
                );
            }

            WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/hoverIntent/jQuery.hoverIntent.min.js'), function() {
	            WDN.jQuery('#wdn_navigation_bar').hoverIntent({
	                over: function() {
	                    if (!lockHover) {
	                        WDN.navigation.expand();
	                    }
	                },
	                out:         mouseout,
	                timeout:     WDN.navigation.expandDelay,
	                sensitivity: 1, // Mouse must not move
	                interval:    120
	            });
            });
            
            WDN.jQuery('#navigation').removeClass('disableTransition');
            
            WDN.navigation.navReady(true);
        },

        applyStateFixes : function() {
        	var $cWrapper = WDN.jQuery('#wdn_content_wrapper');
            $cWrapper.css('margin-top', '');

            if (WDN.navigation.preferredState == 1) {
                WDN.navigation.setWrapperPState('pinned');
            } else {
                WDN.navigation.setWrapperPState('unpinned');
                
                if (WDN.navigation.currentState === 0) {
	                var nav_height = WDN.jQuery('#wdn_navigation_wrapper').outerHeight(true), 
	                	defaultMargin = parseInt($cWrapper.css('margin-top'), 10);
	                
	                if (nav_height > defaultMargin) {
	                	$cWrapper.css('margin-top', nav_height);
	                }
                }
            }
        },
        
        setWrapperPState : function(css_class) {
        	var prefix = 'nav_', states = ['changing', 'unpinned', 'pinned'];
        	WDN.jQuery('#wdn_wrapper').removeClass(prefix + states.join(' ' + prefix)).addClass(prefix + css_class);
        },
        
        navReady : function(ready) {
        	var $wrapper = WDN.jQuery('#wdn_wrapper');
        	if (ready) {
        		$wrapper.addClass('nav_ready');
        	} else {
        		$wrapper.removeClass('nav_ready');
        	}
        },
        
        setPreferredState : function(event) {
            WDN.log('set preferred state');
            if (WDN.getCookie('n')!=1) {
                WDN.log('Setting preferred navigation state OPEN');

                WDN.setCookie('n',1,1209600); // 2 weeks
                WDN.navigation.preferredState = 1;
                WDN.analytics.trackNavigationPreferredState("Open");
            } else {
                WDN.log('Setting preferred navigation state CLOSED');
                WDN.setCookie('n',0,-100);
                WDN.navigation.preferredState = 0;
                WDN.analytics.trackNavigationPreferredState("Closed");
            }
            WDN.navigation.initializePreferredState();
        },

        setWrapperClass : function(css_class) {
            var $wrapper = WDN.jQuery('#wdn_wrapper'), offClass, prefix = 'nav_';
            $wrapper.removeClass(prefix + 'changing');
            offClass = css_class == 'collapsed' ? 'expanded' : 'collapsed';
            $wrapper.removeClass(prefix + offClass).addClass(prefix + css_class);
        },
        
        /**
         * Expand the navigation section.
         */
        expand : function() {
            WDN.log('expand called');
            if (WDN.navigation.currentState === 1) {
                return;
            }

            if (WDN.navigation.currentState !== -1 && WDN.navigation.preferredState != 1 && Modernizr.csstransitions) {
                WDN.navigation.setWrapperClass('changing');
            } else {
                WDN.navigation.transitionEnd();
            }

            WDN.navigation.currentState = 1;
        },
        
        /**
         * A function to signal the end of navigation expansion
         */
        transitionEnd: function() {
        	WDN.navigation.setWrapperClass('expanded');
        	WDN.jQuery('#navigation').trigger('expand').unbind('expand');
        },
        
        /**
         * Set a delay for collapsing the navigation.
         */
        startCollapseDelay: function(event) {
        	WDN.log('start collapse delay');
        	clearTimeout(WDN.navigation.timeout);
        	if (WDN.navigation.currentState === 0 || WDN.navigation.preferredState == 1) {
        		// Already collapsed, or, prefer to stay open
        		return;
        	}
        	WDN.navigation.timeout = setTimeout(WDN.navigation.collapse, WDN.navigation.collapseDelay);
        },

        /**
         * Collapse the navigation
         */
        collapse : function(switchNav) {
            WDN.log('collapse called');
            if (WDN.navigation.currentState === 0) {
                return;
            }

            WDN.navigation.setWrapperClass('collapsed');
            WDN.navigation.currentState = 0;
            
            if (switchNav !== false) {
                WDN.navigation.switchSiteNavigation(WDN.jQuery(WDN.navigation.homepageLI).children('a').get(0), false);
            }
        },

        switchSiteNavigation : function(event, expand) {
            WDN.log('Switch site nav called');
            if (expand === undefined) {
                expand = true;
            }
            var breadcrumb = event.target || event;
            
            if (!breadcrumb) {
            	return false;
            }
            
            var breadcrumbParent = WDN.jQuery(breadcrumb).parent(),
            	$navList = WDN.jQuery('#navigation > ul');
            
            $navList.children('li').removeClass('highlight');
            
            if (breadcrumbParent.hasClass('selected')) {
                WDN.log('already showing this nav');
                return true;
            }
            
            var isAfterHome = !!breadcrumbParent.prevAll().filter(WDN.navigation.homepageLI).length,
            	oldSelected = WDN.jQuery('#breadcrumbs > ul > li.selected').first(),
            	foundInCurrent = false;
            
            // Look for link in existing/stored navigation
            if (isAfterHome) {
            	// If the home navigation is currently displayed
            	if (WDN.jQuery(WDN.navigation.homepageLI).hasClass('selected')) {
		            WDN.jQuery('a', $navList).each(function() {
		            	if (this.href == breadcrumb.href) {
		            		foundInCurrent = true;
		            		WDN.jQuery(this).parents('#navigation > ul > li').addClass('highlight');
		            		return false;
		            	}
		            });
		            
		            if (foundInCurrent) {
		            	WDN.log('Link found in home navigation');
		            	return true;
		            }
            	}
            	
            	// Check stored navigation up to selected
            	var $previousCrumbs = breadcrumbParent.prevUntil('.selected');
            	
	            $previousCrumbs.each(function() {
	            	var $storedNav = WDN.jQuery(this).children('div.storednav');
	            	
	            	if ($storedNav.length) {
	            		WDN.jQuery('a', $storedNav.children()).each(function() {
	            			if (this.href == breadcrumb.href) {
	            				foundInCurrent = true;
	            				var tempPrimary = WDN.jQuery(this).parents('div.storednav > ul > li');
	            				tempPrimary.addClass('highlight');
	            				
	            				WDN.navigation.setNavigationContents($storedNav.children().clone(), expand);
	            				
	            				tempPrimary.removeClass('highlight');
	            				
	            				return false;
	            			}
	            		});
	            	}
	            	
	            	if (foundInCurrent) {
	            		oldSelected.removeClass('selected');
        				WDN.jQuery(this).addClass('selected');
        				
	            		return false;
	            	}
	            });
	            
	            if (foundInCurrent) {
	            	WDN.log('Link found in stored navigation');
	            	return true;
	            }
            }

            var $storedNav = WDN.jQuery(breadcrumb).siblings('div.storednav'),
	            oldNavCompare = $navList.clone()
		    		.find('li.empty').remove().end()
		    		.find('*').removeAttr('style').end()
		    		.find('a').each(function() {
		    			WDN.jQuery(this).attr('href', this.href);
		    		}).end()
		    		.html();
            
            if ($storedNav.length) {
            	WDN.log("Already got it.");
            	// We've already grabbed the nav for this link
            	var $storedChildren = $storedNav.children();
            	
            	if (!$storedChildren.length) {
            		WDN.log('Duplicated navigation previously loaded');
            		return true;
            	}
            	
            	if (isAfterHome) {
	            	var newNavCompare = $storedChildren.clone()
	            		.find('li.empty').remove().end()
			    		.find('*').removeAttr('style').end()
			    		.find('a').each(function() {
			    			WDN.jQuery(this).attr('href', this.href);
			    		}).end()
			    		.html();
	            	
	            	if (oldNavCompare == newNavCompare) {
	        			WDN.log('Duplicate navigation detected.');
	        			return true;
	            	}
            	}
            	
        		if (!WDN.jQuery('div.storednav', oldSelected).length) {
                    WDN.navigation.storeNav(oldSelected, $navList);
            	}
        		
        		oldSelected.removeClass('selected');
        		breadcrumbParent.addClass('selected');
        		
        		WDN.navigation.setNavigationContents($storedChildren.clone(), expand);
            	return true;
            }

            // Fetch the navigation
            WDN.jQuery('#breadcrumbs > ul > li').removeClass('pending');
            WDN.jQuery(breadcrumb).parent().addClass('pending');

            var nav_sniffer = snifferServer + 'navigationSniffer.php';
            nav_sniffer += '?u=' + escape(breadcrumb.href);
            WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
            WDN.get(nav_sniffer, '', function(data, textStatus) {
                try {
                    if (textStatus == 'success') {
                    	var $temp = WDN.jQuery('<div/>').append(data).children('ul');
                        
                        if (!isAfterHome || $temp.html() != oldNavCompare) {
                        	if (!WDN.jQuery('div.storednav', oldSelected).length) {
                                WDN.navigation.storeNav(oldSelected, $navList);
                        	}
                        	
                        	WDN.navigation.storeNav(breadcrumbParent, $temp.clone());
                        	
                        	if (breadcrumbParent.hasClass('pending')) {
                        		// Set the hovered breadcrumb link to selected
                        		oldSelected.removeClass('selected');
                                breadcrumbParent.removeClass('pending').addClass('selected');
                                
                                WDN.navigation.setNavigationContents($temp, expand);
                            }
                        } else {
                        	WDN.navigation.storeNav(breadcrumbParent, '');
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
        },
        
        storeNav : function(li, data) {
        	var storednavDiv = WDN.jQuery(li).children('div.storednav');
        	if (storednavDiv.length) {
        		storednavDiv.empty();
        	} else {
        		storednavDiv = WDN.jQuery('<div/>', {'class' : 'storednav'});
        		WDN.jQuery(li).append(storednavDiv);
        	}
        	storednavDiv.append(data);
        },

        setNavigationContents : function(contents, expand) {
            WDN.log('setNavigationContents called');
            WDN.jQuery('#navigation').addClass('disableTransition');
            WDN.jQuery('#navigation')
            	.children('ul').remove().end()
            	.prepend(contents);

            WDN.navigation.currentState = -1;
            WDN.navigation.setWrapperClass('expanded');
            WDN.navigation.fixPresentation();
            WDN.navigation.collapse(false);
            WDN.navigation.applyStateFixes();

            WDN.jQuery('#navigation').removeClass('disableTransition');

            if (expand) {
                WDN.navigation.expand();
            }
        },
        
        setupMobile: function() {
        	var navigation = document.getElementById("navigation"),
				primaryNav = navigation.getElementsByTagName('ul'),
				triggerEvent;
        	
			if(!primaryNav.length){
				navigation.className = 'disabled';
				return;
			}
			
//			if (Modernizr.touch) {
//				triggerEvent = 'touchstart';
//			} else {
				triggerEvent = 'click';
//			}
			
			var primaryNavs = primaryNav[0].children,
				showPrimary = function() {
					navigation.className = 'primary active';
					navigation.removeEventListener(triggerEvent, showPrimary, false);
					navigation.addEventListener(triggerEvent, traverseNavigation, false);
				},
				showSecondary = function(event) {
					event.stopPropagation();
					for (var i=0; i < primaryNavs.length; i++){
						primaryNavs[i].className = primaryNavs[i].className.replace(/(^|\s)active(\s|$)/, '');
					}
					this.className += ' active';
					navigation.className = navigation.className.replace(/(^|\s)primary(\s|$)/, '') + ' secondary';
				},
				traverseNavigation = function() {
					if (navigation.className.match(/(^|\s)primary(\s|$)/)) { //we're showing the primary nav, so close it
						navigation.className = '';
						navigation.removeEventListener(triggerEvent, traverseNavigation, false);
						navigation.addEventListener(triggerEvent, showPrimary, false);
					} else { // we're showing the secondary nav, close it and trigger primary
						for (var i=0; i < primaryNavs.length; i++){
							primaryNavs[i].className = primaryNavs[i].className.replace(/(^|\s)active(\s|$)/, '');
						};
						navigation.className = 'primary active';
					}
				};
			
			//Bind the click/tap to the navigation bar to present user with navigation and ability to close navigation.
			navigation.addEventListener(triggerEvent, showPrimary, false);
			
			navigation.ondestroy = function() {
				this.ondestroy = null;
				
				navigation.className = '';
				
				this.removeEventListener(triggerEvent, showPrimary, false);
				this.removeEventListener(triggerEvent, traverseNavigation, false);
				
				for (var i = 0; i < primaryNavs.length; i++) {
					primaryNavs[i].className = primaryNavs[i].className.replace(/(^|\s)(active|hasSecondary)(\s|$)/, '');
					primaryNavs[i].removeEventListener(triggerEvent, showSecondary, false);
				}
			};
			
			for (var i=0; i < primaryNavs.length; i++) {
				if (primaryNavs[i].className.match(/(^|\s)empty(\s|$)/)) {
					continue;
				}
				primaryNavs[i].addEventListener(triggerEvent, showSecondary, false);
				
				var secondaries = primaryNavs[i].getElementsByTagName('ul');
				if (secondaries.length && !secondaries[0].className.match(/(^|\s)empty(\s|$)/)){
					primaryNavs[i].className += ' hasSecondary';
				}
			};
        },
        
        destroyMobile: function() {
        	var navigation = document.getElementById("navigation");
		
			if (navigation.ondestroy){
				navigation.ondestroy();
			}
        },
        
        destroy: function(widthScript) {
        	if (widthScript == '320') {
        		WDN.navigation.destroyMobile();
        		return;
        	}
        	
        	WDN.navigation.currentState = -1;
        	
        	WDN.navigation.navReady(false);
        	
        	// unfix presentation
        	WDN.jQuery('#navigation').unbind();
        	
        	WDN.jQuery('#navigation > ul > li > a').unbind('focusin').unbind('focus').css({
        		'padding-top': '',
        		'padding-bottom': ''
        	});
        	
        	WDN.jQuery('#navigation > ul > li > ul').css('height', '');
        	
        	WDN.jQuery('#wdn_wrapper').removeClass('nav_collapsed nav_expanded nav_changing nav_pinned nav_unpinned');
        	
        	WDN.jQuery('#wdn_content_wrapper').css('margin-top', '');
        	
        	WDN.jQuery('#wdn_navigation_bar').unbind();
        	
        	WDN.jQuery('#breadcrumbs ul li a').unbind();
        },
        
        onResize: function(oldWidthScript, newWidthScript) {
        	if (!oldWidthScript) {
        		if (WDN.getCurrentWidthScript() == '768') {
        			var newWidth = WDN.jQuery(document.documentElement).width();
                	if (lastWidth === newWidth) {
                		return;
                	}
                	lastWidth = newWidth;
        			WDN.navigation.fixPresentation();
        			WDN.navigation.applyStateFixes();
        		}
        		return;
        	}
        	
        	WDN.navigation.destroy(oldWidthScript);
        	WDN.navigation.initialize();
        }
    };
})();
