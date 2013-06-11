define(['jquery', 'wdn', 'modernizr'], function($, WDN, Modernizr) {
	
	
    var lockHover = false,
        initd = false,
    	snifferServer = 'http://www1.unl.edu/wdn/templates_3.0/scripts/',
    	fullNavBp = '(min-width: 700px)',
    	hoverPlugin = 'plugins/hoverIntent/jquery.hoverIntent',
    	expandDelay = 400,
    	collapseDelay = 120,
    	changeSiteNavDelay = 400,
    	homepageLI, siteHomepage, timeout, scrollTimeout, transTimeout, resizeTimeout,
    	currentState = -1;
    
    var determineSelectedBreadcrumb = function () {
    	// First we search for a defined homepage.
    	var $homeLink = $('link[rel=home]');
    	if ($homeLink.length) {
    		siteHomepage = $homeLink[0].href;
    		WDN.log('Setting homepage to ' + siteHomepage);
    	}
    	
    	var $breadcrumbs = $('#breadcrumbs > ul > li');
    	if (!$breadcrumbs.length) {
    		WDN.log('This page is missing breadcrumbs');
    		return;
    	}
    	
    	$breadcrumbs.removeClass('selected');
    	
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
    		
    		if (!$breadcrumbs.filter('.selected').length) {
    			WDN.log('We are on the current homepage.');
    			setHomepageLI($breadcrumbs[$breadcrumbs.length-1]);
    		}
    	}
    	
    	$('> a', $breadcrumbs).last().parent().addClass('last-link');
    };
    
    var setHomepageLI = function(li) {
    	homepageLI = li;
        var $li = $(li);
        $li.addClass('selected');
        
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
    	var $siteTitle = $('#wdn_site_title > span');
    	
    	// check if the link already exists
        if (!siteHomepage || $siteTitle.children('a').length) {
            return;
        }
        
        // remove excess space text nodes see #371
        $siteTitle.contents().filter(function() {
        	return this.nodeType == 3 && /^\s*$/.test(this.nodeValue);
        }).remove();
        // create the link using whatever the Homepage is set to
        $siteTitle.contents().filter(function() {
        	return this.nodeType == 3;
        }).first().wrap($('<a/>', {href : siteHomepage}));
    };
    
    var fixPresentation = function() {
    	if (!Modernizr.mq(fullNavBp)) {
    		$('#navigation > ul > li > ul').css('height', '');
    		$('#navigation > ul > li > a').css({
            	'padding-top' : '',
                'padding-bottom' : ''
            });
        	return;
        }
    	
    	$('#wdn_navigation_wrapper').removeClass('empty-secondary');
    	
        var primaries = $('#navigation > ul > li');
        var primaryCount = primaries.length, fakePrimaries = [];
        while (primaryCount % 6 > 0) {
            fakePrimaries.push($('<li class="empty"><a /><ul class="empty"><li/></ul></li>')[0]);
            primaryCount++;
        }
        if (fakePrimaries.length) {
        	$('#navigation > ul').append(fakePrimaries);
        	primaries = $('#navigation > ul > li');
        }

        var secondaries = primaries.has('ul');
        if (secondaries.length) {
            primaries.not(':has(ul)').each(function(){
                $(this).append('<ul class="empty"><li/></ul>');
            });
        }
        
        // css3 selector fixes
        var $bar_starts = $('#navigation > ul > li:nth-child(6n+1)');
        if (!Modernizr['css-nthchild']) {
            $bar_starts.addClass('start');
            $('#navigation > ul > li:nth-child(6n+6)').addClass('end');
            $('#navigation > ul > li:nth-child(n+7)').addClass('mid-bar');
            $bar_starts.last().prevAll().addClass('top-bars');
        }
        if (!Modernizr['css-lastchild']) {
            $('#navigation > ul > li ul li:last-child').addClass('last');
        }

        var ah = [];
        var primaryLinks = $('> a', primaries).css({
        	'padding-top' : '',
            'padding-bottom' : ''
        });
        primaryLinks.each(function(i){
            var row = Math.floor(i/6);
            var height = $(this).outerHeight();
            if (!ah[row] || height > ah[row]) {
                ah[row] = height;
            }
        });

        primaryLinks.each(function(i){
            var row = Math.floor(i/6);
            var height = $(this).outerHeight();
            var pad = parseFloat($(this).css('padding-top'));
            if (height < ah[row]) {
                var ah_temp = (ah[row] - height) / 2,
                	new_ah = [Math.floor(ah_temp), Math.ceil(ah_temp)];

                $(this).css({
                    'padding-top' : new_ah[0] + pad + 'px',
                    'padding-bottom' : new_ah[1] + pad + 'px'
                });
            }
        });

        var secondaryLists = $('> ul', primaries),
    		recalcSecondaryHeight = function() {
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
        	$('#navigation').bind('expand', recalcSecondaryHeight);
        } else {
        	recalcSecondaryHeight();
        }

        // look for no secondary links
        if (!$('li > a', secondaryLists).length) {
        	$('#wdn_navigation_wrapper').addClass('empty-secondary');
        } else { // look for entire empty rows
            $bar_starts.each(function() {
            	var $primary_bar = $(this).nextUntil(':nth-child(6n+1)').andSelf();
            	if (!$('> ul li > a', $primary_bar).length) {
            		$primary_bar.addClass('row-empty');
            	}
            });
        }

        WDN.log('we have fixed the presentation.');
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
	        require([hoverPlugin], function() {
	            $('#wdn_navigation_bar').hoverIntent({
	                over: function() {
	                    if (!lockHover) {
	                        Plugin.expand();
	                    }
	                },
	                out:         mouseout,
	                timeout:     expandDelay,
	                sensitivity: 1, // Mouse must not move
	                interval:    120
	            });
	        });
        });
        
        navReady(true);
    };
    
    var applyStateFixes = function() {
    	var $cWrapper = $('#wdn_content_wrapper');
        $cWrapper.css('padding-top', '');
        
        if (!Modernizr.mq(fullNavBp)) {
        	return;
        }
        
        if (currentState === 0) {
            var nav_height = $('#navigation').outerHeight(true);
            $cWrapper.css('padding-top', nav_height);
        }
    };
    
    var startCollapseDelay = function(event) {
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
        	$navList = $('#navigation > ul');
        
        $navList.children('li').removeClass('highlight');
        
        if (breadcrumbParent.hasClass('selected')) {
            WDN.log('already showing this nav');
            return true;
        }
        
        var isAfterHome = !!breadcrumbParent.prevAll().filter(homepageLI).length,
        	oldSelected = $('#breadcrumbs > ul > li.selected').first(),
        	foundInCurrent = false;
        
        // Look for link in existing/stored navigation
        if (isAfterHome) {
        	// If the home navigation is currently displayed
        	if ($(homepageLI).hasClass('selected')) {
	            $('a', $navList).each(function() {
	            	if (this.href == breadcrumb.href) {
	            		foundInCurrent = true;
	            		$(this).parents('#navigation > ul > li').addClass('highlight');
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
            	var $storedNav = $(this).children('div.storednav');
            	
            	if ($storedNav.length) {
            		$('a', $storedNav.children()).each(function() {
            			if (this.href == breadcrumb.href) {
            				foundInCurrent = true;
            				var tempPrimary = $(this).parents('div.storednav > ul > li');
            				tempPrimary.addClass('highlight');
            				
            				setNavigationContents($storedNav.children().clone(), expand);
            				
            				tempPrimary.removeClass('highlight');
            				
            				return false;
            			}
            		});
            	}
            	
            	if (foundInCurrent) {
            		oldSelected.removeClass('selected');
    				$(this).addClass('selected');
    				
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

        var $storedNav = $(breadcrumb).siblings('div.storednav'),
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
        	
    		if (!$('div.storednav', oldSelected).length) {
                storeNav(oldSelected, $navList);
        	}
    		
    		oldSelected.removeClass('selected');
    		breadcrumbParent.addClass('selected');
    		
    		setNavigationContents($storedChildren.clone(), expand);
        	return true;
        }

        // Fetch the navigation
        $('#breadcrumbs > ul > li').removeClass('pending');
        $(breadcrumb).parent().addClass('pending');

        var nav_sniffer = snifferServer + 'navigationSniffer.php';
        nav_sniffer += '?u=' + escape(breadcrumb.href);
        WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
        $.get(nav_sniffer, '', function(data, textStatus) {
            try {
                if (textStatus == 'success') {
                	var $temp = $('<div/>').append(data).children('ul');
                    
                    if (!isAfterHome || $temp.html() != oldNavCompare) {
                    	if (!$('div.storednav', oldSelected).length) {
                            storeNav(oldSelected, $navList);
                    	}
                    	
                    	storeNav(breadcrumbParent, $temp.clone());
                    	
                    	if (breadcrumbParent.hasClass('pending')) {
                    		// Set the hovered breadcrumb link to selected
                    		oldSelected.removeClass('selected');
                            breadcrumbParent.removeClass('pending').addClass('selected');
                            
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
    	var storednavDiv = $(li).children('div.storednav');
    	if (storednavDiv.length) {
    		storednavDiv.empty();
    	} else {
    		storednavDiv = $('<div/>', {'class' : 'storednav'});
    		$(li).append(storednavDiv);
    	}
    	storednavDiv.append(data);
    };
    
    var setNavigationContents = function(contents, expand) {
    	WDN.log('setNavigationContents called');
        $('#navigation')
        	.children('ul').remove().end()
        	.prepend(contents);

        fixPresentation();

        if (expand) {
            Plugin.expand();
        }
    };
    
    var setWrapperClass = function(css_class) {
        var $wrapper = $('#wdn_wrapper'), offClass, prefix = 'nav_';
        $wrapper.removeClass(prefix + 'changing');
        offClass = css_class == 'collapsed' ? 'expanded' : 'collapsed';
        $wrapper.removeClass(prefix + offClass).addClass(prefix + css_class);
    };
    
    var navReady = function(ready) {
    	var $wrapper = $('#wdn_wrapper');
    	if (ready) {
    		$wrapper.addClass('nav_ready');
    	} else {
    		$wrapper.removeClass('nav_ready');
    	}
    };
    
    var destroy = function() {
    	navReady(false);
    	
    	// unfix presentation
    	$('#navigation').unbind();
    	
    	$('#navigation > ul > li > a').unbind('focusin').unbind('focus').css({
    		'padding-top': '',
    		'padding-bottom': ''
    	});
    	
    	$('#navigation > ul > li > ul').css('height', '');
    	
    	$('#wdn_wrapper').removeClass('nav_collapsed nav_expanded nav_changing nav_pinned nav_unpinned');
    	
    	$('#wdn_content_wrapper').css('margin-top', '');
    	
    	$('#wdn_navigation_bar').unbind();
    	
    	$('#breadcrumbs ul li a').unbind();
    };
    
    var Plugin = {
        initialize : function() {
        	if (!initd) {
	            determineSelectedBreadcrumb();
	            linkSiteTitle();
        	}
            
            if ($('body').is('.document, .terminal') || !$('#navigation > ul > li').length) {
            	// The rest deals with navigation elements not in document
            	return;
            }

            WDN.log('let us fix the presentation');
            fixPresentation();

            if (!initd) {
	            // add an expand toggler UI element
	            var $toggler = $('#wdn_menu_toggle');
	            $toggler.change(function(evt) {
	            	lockHover = this.checked;
	                if (currentState === 0) {
	                    Plugin.expand();
	                } else {
	                    Plugin.collapse();
	                }
	            });
	            
	            var onscroll = function() {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(function() {
                    	var breadcrumbs = $('#breadcrumbs'), nav = $('#navigation');
                        if ($(window).scrollTop() >= breadcrumbs.offset().top + breadcrumbs.height()) {
                        	if (currentState != 0) {
                        		Plugin.collapse();
                        	}
                            nav.addClass('nav-scrolling');
                        } else {
                            nav.removeClass('nav-scrolling'); 
                        }
                    }, 50);
	            };
	            // pin the navigation 
	            onscroll();
	            $(window).on('scroll', onscroll);
	            
	            $(window).on('resize', function() {
	            	clearTimeout(resizeTimeout);
	            	resizeTimeout = setTimeout(function() {
	            		fixPresentation();
	            		applyStateFixes();
	            	}, 500);
	            });
            }
            
            $('#navigation > ul > li > a').focusin(function(){
                Plugin.expand();
            })
            .focus(function(){
            	switchSiteNavigation($(homepageLI).children('a').get(0), false);
        	});

            initializePreferredState();
            
            WDN.loadJQuery(function() {
	            require([hoverPlugin], function() {
	                $('#breadcrumbs ul li a').hoverIntent({
	                    over:        switchSiteNavigation,
	                    out:         function() {
	                    	$('#navigation > ul > li').removeClass('highlight');
	                    },
	                    sensitivity: 1, // Mouse must not move
	                    interval:    120
	                });
	            });
            });
            
            initd = true;
        },
        
        /**
         * Expand the navigation section.
         */
        expand : function() {
            WDN.log('expand called');
            if (currentState === 1) {
                return;
            }

            var expandEnd = function() {
            	setWrapperClass('expanded');
            	$('#navigation').trigger('expand').unbind('expand');
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
            $('#wdn_menu_toggle')[0].checked = true;
        },

        /**
         * Collapse the navigation
         */
        collapse : function(switchNav) {
            WDN.log('collapse called');
            if (currentState === 0) {
                return;
            }

            setWrapperClass('collapsed');
            currentState = 0;
            $('#wdn_menu_toggle')[0].checked = false;
            
            if (switchNav !== false) {
            	var go = function() {
            		switchSiteNavigation($(homepageLI).children('a').get(0), false);
            	};
            	
            	if (Modernizr.csstransitions) {
            		setTimeout(go, 400);
            	} else {
            		go();
            	}
            }
        }
    };
    
    return Plugin;
});
