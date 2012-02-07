WDN.navigation = (function() {
    var expandedHeight = 0,
    	ul_h, lockHover = false,
    	snifferServer = 'http://www1.unl.edu/wdn/templates_3.0/scripts/';
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
         * @todo determine what it should be
         */
        initialize : function() {
            if (WDN.jQuery('body').hasClass('popup')
                || WDN.jQuery('#breadcrumbs ul li').size() == 0) {
                // This page has no navigation
                return;
            }

            WDN.navigation.determineSelectedBreadcrumb();
            // find the last-link in breadcrumbs
            WDN.jQuery('#breadcrumbs > ul > li > a').last().parent().addClass('last-link');
            WDN.navigation.linkSiteTitle();
            
            if (WDN.jQuery('body').hasClass('document')) {
            	// The rest deals with navigation elements not in document
            	return;
            }

            // Store the current state of the cookie
            if (WDN.getCookie('n') == 1) {
                WDN.navigation.preferredState = 1;
            }

            WDN.log('let us fix the presentation');
            WDN.navigation.fixPresentation();

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
            
            WDN.jQuery('#navigation > ul > li > a').focusin(function(){
                WDN.navigation.expand();
            })
            .focus(function(){
            	WDN.navigation.switchSiteNavigation(WDN.jQuery(WDN.navigation.homepageLI).children('a:first-child'), false);
        	});

            WDN.navigation.initializePreferredState();
            
            WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/hoverIntent/jQuery.hoverIntent.js'), function() {
                WDN.jQuery('#breadcrumbs ul li a').hoverIntent({
                    over:        WDN.navigation.switchSiteNavigation,
                    out:         function(){},
                    timeout:     WDN.navigation.changeSiteNavDelay,
                    sensitivity: 1, // Mouse must not move
                    interval:    120
                });
            });
        },

        /**
         * This function cleans up the navigation visual presentations
         */
        fixPresentation : function() {
        	WDN.jQuery('#wdn_navigation_wrapper').removeClass('empty-secondary');
        	
            var primaries = WDN.jQuery('#navigation > ul > li');
            var primaryCount = primaries.length;
            while (primaryCount % 6 > 0) {
                WDN.jQuery('#navigation > ul').append('<li class="empty"><a /><ul><li/></ul></li>');
                primaryCount++;
            }
            primaries = WDN.jQuery('#navigation > ul > li');

            var secondaries = primaries.has('ul');
            if (secondaries.length) {
                primaries.not(':has(ul)').each(function(){
                    WDN.jQuery(this).append('<ul><li/></ul>');
                });
            }

            // css3 selector fixes
            var $html = WDN.jQuery(document.documentElement),
            	$bar_starts = WDN.jQuery('#navigation > ul > li:nth-child(6n+1)');
            if ($html.hasClass('no-css-nth-child')) {
                $bar_starts.addClass('start');
                WDN.jQuery('#navigation > ul > li:nth-child(6n+6)').addClass('end');
                WDN.jQuery('#navigation > ul > li:nth-child(n+7)').addClass('mid-bar');
                $bar_starts.last().prevAll().addClass('top-bars');
                WDN.jQuery('#navigation > ul > li ul li:last-child').addClass('last');
            }

            var ah = [];
            var primaryLinks = WDN.jQuery('> a', primaries);
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

            ul_h = [];
            var secondaryLists = WDN.jQuery('> ul', primaries);
            secondaryLists.each(function(i){
                var row = Math.floor(i/6), height;
                if (WDN.jQuery('body').hasClass('liquid') && $html.hasClass('boxsizing')) {
                    height = WDN.jQuery(this).outerHeight();
                } else {
                    height = WDN.jQuery(this).height();
                }
                if (!ul_h[row] || height > ul_h[row]) {
                    ul_h[row] = height;
                }
            });
            //loop through again and apply new height
            secondaryLists.each(function(i){
                var row = Math.floor(i/6);
                WDN.jQuery(this).css({'height':ul_h[row]+'px'});
            });

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
                WDN.jQuery(window).unbind('resize').bind('resize', resizeFunc);
            }

            WDN.log('we have fixed the presentation.');
        },

        transitionEnd: function() {
            WDN.navigation.setWrapperClass('expanded');
        },

        /**
         * This function should determine which breadcrumb should be selected.
         */
        determineSelectedBreadcrumb : function() {
            // First we search for a defined homepage.

            if (WDN.jQuery('link[rel=home]').length) {
                WDN.navigation.siteHomepage = WDN.toAbs(WDN.jQuery('link[rel=home]').attr('href'), window.location.toString());
                WDN.log('Setting homepage to '+WDN.navigation.siteHomepage);
            }

            if (WDN.navigation.siteHomepage === false) {
                WDN.log('No homepage set!');
                if (WDN.jQuery('#breadcrumbs > ul > li').size() == 1) {
                	WDN.navigation.setHomepageLI(WDN.jQuery('#breadcrumbs > ul > li:nth-child(1)'));
                } else {
                	// Right now, stupidly select the second element.
                	WDN.navigation.setHomepageLI(WDN.jQuery('#breadcrumbs > ul > li:nth-child(2)'));
                }
            } else {
                WDN.log('Homepage has been set.');
                // Make all the hrefs absolute.
                WDN.jQuery('#breadcrumbs > ul > li > a').each(
                        function() {
                            if (this.href == WDN.navigation.siteHomepage) {
                                WDN.navigation.setHomepageLI(WDN.jQuery(this).parent());
                                return false;
                            }
                        }
                    );
                if (WDN.jQuery('#breadcrumbs > ul > li.selected').size() < 1) {
                    WDN.log('We are on the current homepage.');
                    WDN.navigation.setHomepageLI(WDN.jQuery('#breadcrumbs > ul > li:last-child'));
                }
            }
        },

        setHomepageLI: function(li) {
            WDN.navigation.homepageLI = li;
            WDN.jQuery(li).addClass('selected');
            if (WDN.jQuery(li).children('a').size()) {
                // Found the homepage url in the breadcrumbs
                WDN.navigation.siteHomepage = WDN.jQuery(li).find('a').attr('href');
            } else {
                // Assume it's the current page
                WDN.navigation.siteHomepage = window.location;
                WDN.jQuery(li).wrapInner('<a href="'+WDN.navigation.siteHomepage+'"></a>');
            }
        },

        /**
         * This function will check for/add a link to the homepage in the site title.
         */

        linkSiteTitle: function() {
            // check if the link already exists
            if (WDN.jQuery("#titlegraphic h1 a").length > 0 || !WDN.navigation.siteHomepage) {
                return;
            }
            // create the link using whatever the Homepage is set to
            WDN.jQuery("#titlegraphic h1").wrapInner('<a href="' + WDN.navigation.siteHomepage +'" />');
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
                WDN.navigation.switchSiteNavigation(WDN.jQuery(WDN.navigation.homepageLI).children('a:first-child'), false);
            }
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

        setPreferredState : function(event) {
            WDN.log('set preferred state');
            if (WDN.getCookie('n')!=1) {
                WDN.log('Setting preferred navigation state OPEN');

                WDN.setCookie('n',1,1209600);
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

            if (Modernizr.csstransitions) {
                WDN.jQuery('#navigation').bind(
                    'webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd',
                    function(event) {
                        if (WDN.navigation.currentState == 1) {
                            WDN.navigation.transitionEnd();
                        }
                    }
                );
            }

            WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/hoverIntent/jQuery.hoverIntent.js'), function() {
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
                var nav_height = WDN.jQuery('#wdn_navigation_wrapper').outerHeight(true), 
                	defaultMargin = parseInt($cWrapper.css('margin-top'), 10);
                
                if (nav_height > defaultMargin) {
                	$cWrapper.css('margin-top', nav_height);
                }
            }
        },

        switchSiteNavigation : function(event, expand) {
            WDN.log('Switch site nav called');
            if (expand === undefined) {
                expand = true;
            }
            var breadcrumb = (event.target) ? event.target : event;
            if (WDN.jQuery(breadcrumb).parent().hasClass('selected')) {
                WDN.log('already showing this nav');
                return true;
            }

            var dimms = {
        		width: WDN.jQuery('#navigation > ul').width() || 960,
    			height: WDN.jQuery('#navigation > ul').height() || 50
            };
            var oldSelected = WDN.jQuery('#breadcrumbs > ul > li.selected:first');

            if (!WDN.jQuery('div.storednav', oldSelected).length && WDN.jQuery('#navigation > ul').length) {
                WDN.log('Storing it');
                // Store the current navigation
                WDN.navigation.storeNav(oldSelected, WDN.jQuery('#navigation > ul'));
            } else {
                WDN.jQuery('#navigation > ul').remove();
            }

            // Set the hovered breadcrumb link to selected
            oldSelected.removeClass('selected');
            WDN.jQuery(breadcrumb).parent().addClass('selected');
            // Check for stored navigation
            if (WDN.jQuery(breadcrumb).siblings('div.storednav').length) {
                WDN.log("Already got it.");
                // We've already grabbed the nav for this link
                WDN.navigation.setNavigationContents(WDN.jQuery(breadcrumb).siblings('div.storednav').children().clone(), expand);
                return true;
            }

            WDN.jQuery('#navloading').remove();
            WDN.jQuery('<div id="navloading" />').css(dimms).appendTo('#navigation');
            WDN.jQuery('#wdn_navigation_wrapper').addClass('nav-loading');

            var nav_sniffer = snifferServer + 'navigationSniffer.php';
            nav_sniffer += '?u=' + escape(WDN.toAbs(breadcrumb.href, window.location));
            WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
            WDN.get(nav_sniffer, '', function(data, textStatus) {
                try {
                    if (textStatus == 'success') {
                        var breadcrumbParent = WDN.jQuery(breadcrumb).parent();
                        WDN.navigation.storeNav(breadcrumbParent, data);
                        if (breadcrumbParent.hasClass('selected')) {
                            WDN.navigation.setNavigationContents(data, expand);
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

        setNavigationContents : function(contents, expand) {
            WDN.log('setNavigationContents called');
            WDN.jQuery('#wdn_navigation_wrapper').removeClass('nav-loading');
            WDN.jQuery('#navigation').addClass('disableTransition');
            WDN.jQuery('#navloading').remove();
            WDN.jQuery('#navigation').children('ul').remove()
                .end().prepend(contents);

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

        setWrapperClass : function(css_class) {
            var $wrapper = WDN.jQuery('#wdn_wrapper');
            $wrapper.removeClass('nav_changing');

            if (css_class=='collapsed') {
                $wrapper.removeClass('nav_expanded nav_changing').addClass('nav_'+css_class);
                return;
            }

            $wrapper.removeClass('nav_collapsed').addClass('nav_'+css_class);
        },

        setWrapperPState : function(css_class) {
            WDN.jQuery('#wdn_wrapper').removeClass('nav_changing nav_unpinned nav_pinned').addClass('nav_' + css_class);
        },
        
        navReady : function(ready) {
        	var $wrapper = WDN.jQuery('#wdn_wrapper');
        	if (ready) {
        		$wrapper.addClass('nav_ready');
        	} else {
        		$wrapper.removeClass('nav_ready');
        	}
        },

        storeNav : function(li, data) {
            var storednavDiv = WDN.jQuery(li).children('div.storednav');
            if (storednavDiv.length) {
                storednavDiv.empty();
            } else {
                storednavDiv = WDN.jQuery('<div class="storednav"/>');
                WDN.jQuery(li).append(storednavDiv);
            }
            storednavDiv.append(data);
        }
    };
})();