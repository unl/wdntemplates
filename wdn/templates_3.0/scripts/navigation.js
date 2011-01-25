WDN.navigation = function() {
    var expandedHeight = 0;
    var $ = WDN.jQuery;
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
            if ($('body').hasClass('popup')
    			|| $('body').hasClass('document')
    			|| $('#breadcrumbs ul li').size() == 0) {
            	// This page has no navigation
                return;
            }

            if ($('#navigation-close').length > 0) {
            	// Already initialized
                return;
            }
            

            $('#navigation').append('<div id="navigation-close"></div>');
            $('#navigation').append('<div id="navigation-expand-collapse"><span></span></div>');
            $('#navigation-expand-collapse').click(WDN.navigation.setPreferredState);
            $('#navigation-close').click(WDN.navigation.collapse);
            WDN.navigation.determineSelectedBreadcrumb();
            WDN.navigation.linkSiteTitle();

            // Store the current state of the cookie
            if (WDN.getCookie('n') == 1) {
                WDN.navigation.preferredState = 1;
            }
            
            WDN.loadJS('wdn/templates_3.0/scripts/plugins/hoverIntent/jQuery.hoverIntent.js', function() {
            	$('#breadcrumbs ul li a').hoverIntent({
                	over:        WDN.navigation.switchSiteNavigation,
                	out:         function(){},
                	timeout:     WDN.navigation.changeSiteNavDelay,
                	sensitivity: 1, // Mouse must not move
                	interval:    120
                });
            	WDN.navigation.initializePreferredState();
            });
            
            //adds the curved end to the right side of the breadcrumbs bar in IE
            if ($.browser.msie) {
                $('#breadcrumbs').append('<span></span>');
                $('#breadcrumbs span').css({'height':'35px', 'width':'8px','position':'absolute','top':'0', 'right':'-3px','margin':'0 0 0 100%','background':'url("'+WDN.template_path+'wdn/templates_3.0/css/navigation/images/breadcrumbBarSprite2.png") 0 -72px no-repeat'});
            }
        },
        
        /**
         * This function should determine which breadcrumb should be selected.
         */
        determineSelectedBreadcrumb : function() {
            // First we search for a defined homepage.
            
            if ($('link[rel=home]').length) {
                WDN.navigation.siteHomepage = WDN.toAbs($('link[rel=home]').attr('href'), window.location.toString());
                WDN.log('Setting homepage to '+WDN.navigation.siteHomepage);
            }
            
            if (WDN.navigation.siteHomepage === false) {
                WDN.log('No homepage set!');
                // Right now, stupidly select the second element.
                WDN.navigation.setHomepageLI($('#breadcrumbs > ul >  li:nth-child(2)'));
            } else {
                WDN.log('Homepage has been set.');
                // Make all the hrefs absolute.
                $('#breadcrumbs > ul > li > a').each(
                        function() {
                            if (this.href == WDN.navigation.siteHomepage) {
                                WDN.navigation.setHomepageLI($(this).parent());
                                return false;
                            }
                        }
                    );
                if ($('#breadcrumbs > ul > li.selected').size() < 1) {
                    WDN.log('We are on the current homepage.');
                    WDN.navigation.setHomepageLI($('#breadcrumbs > ul > li:last-child'));
                }
            }
        },

        setHomepageLI: function(li)
        {
        	WDN.navigation.homepageLI = li;
        	$(li).addClass('selected');
        	if ($(li).children('a').size()) {
                // Found the homepage url in the breadcrumbs
                WDN.navigation.siteHomepage = $(li).find('a').attr('href');
            } else {
                // Assume it's the current page
                WDN.navigation.siteHomepage = window.location;
                $(li).wrapInner('<a href="'+WDN.navigation.siteHomepage+'"></a>');
            }
        },
        
        /**
         * This function will check for/add a link to the homepage in the site title.
         */
        
        linkSiteTitle: function() {
            // check if the link already exists
            if ($("#titlegraphic h1 a").length > 0) {
                return;
            }
            // create the link using whatever the Homepage is set to
            $("#titlegraphic h1").wrapInner('<a href="' + WDN.navigation.siteHomepage +'" />');
        },
        
        /**
         * Expand the navigation section.
         */
        expand : function() {
            WDN.log('expand called');
            $('#navigation-close').show();
            WDN.navigation.setWrapperClass('expanded');
            WDN.navigation.currentState = 1;
            WDN.navigation.updateHelperText();
            $('#navigation ul:first li:nth-child(6) a:visible:first').css('width','86%');
        },
        
        updateHelperText : function() {
            if (WDN.navigation.preferredState == 1) {
                $('#navigation-expand-collapse span').text('click to always hide full navigation');
            } else {
                if (WDN.navigation.currentState === 0) {
                    $('#navigation-expand-collapse span').text('roll over for full navigation');
                } else {
                    $('#navigation-expand-collapse span').text('click to always show full navigation');
                }
            }
        },
        
        /**
         * Collapse the navigation
         */
        collapse : function(animate) {
            WDN.log('collapse called');
            if (WDN.navigation.currentState === 0) {
                return;
            }
            if (expandedHeight === 0) {
                //expandedHeight = $('#navigation').height();
            }
            $('#navigation-close').hide();
            $('#navigation-expand-collapse span').text('roll over for full navigation');
            $('#navigation ul:first li:nth-child(6) a:visible:first').css('width','100%');
            WDN.navigation.setWrapperClass('collapsed');
            WDN.navigation.currentState = 0;
            WDN.navigation.switchSiteNavigation($(WDN.navigation.homepageLI).find('a:first-child'), false);
        },
        
        /**
         * Set a delay for collapsing the navigation.
         */
        startCollapseDelay: function(event) {
            WDN.log('start collapse delay');
            clearTimeout(WDN.navigation.timeout);
            if (WDN.navigation.currentState === 0
            	|| WDN.navigation.preferredState == 1) {
            	// Already collapsed, or, prefer to stay open
                return;
            }
            WDN.navigation.timeout = setTimeout(WDN.navigation.collapse, WDN.navigation.collapseDelay);
        },
        
        setPreferredState : function(event) {
            WDN.log('set preferred state');
            if (WDN.getCookie('n')!=1) {
                WDN.log('Setting preferred navigation state OPEN');
                // Remove the hover function?
                //$('#wdn_navigation_bar').hover();
                
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
            var mouseout = $.noop;
            if (WDN.navigation.preferredState==1) {
                WDN.navigation.setWrapperClass('pinned');
                WDN.navigation.expand();
            } else {
                WDN.navigation.collapse();
                mouseout = WDN.navigation.startCollapseDelay;
            }
            
            $('#wdn_navigation_bar').hoverIntent({
            	over:        WDN.navigation.expand,
            	out:         mouseout,
            	timeout:     WDN.navigation.expandDelay,
            	sensitivity: 1, // Mouse must not move
            	interval:    120
            });
            $('#wdn_content_wrapper,#header').hover(
                    WDN.navigation.startCollapseDelay);
            WDN.navigation.updateHelperText();
        },
        
        switchSiteNavigation : function(event, expand) {
            WDN.log('Switch site nav called');
            var breadcrumb = (event.target)?event.target:event;
            if ($(breadcrumb).parent().hasClass('selected')) {
                WDN.log('already showing this nav');
                return true;
            }

            var height = $('#navigation > ul').height() || 50;

            if (!$(breadcrumb).siblings('div.storednav').length && $('#navigation > ul').length) {
                WDN.log('Storing it');
                // Store the current navigation
                WDN.navigation.storeNav($('#breadcrumbs ul > li.selected:first'), $('#navigation > ul'));
            }
            
            // Set the hovered breadcrumb link to selected
            $('#breadcrumbs ul li.selected').removeClass('selected');
            $(breadcrumb).parent().addClass('selected');
            // Check for stored navigation
            if ($(breadcrumb).siblings('div.storednav').length) {
                WDN.log("Already got it.");
                // We've already grabbed the nav for this link
                WDN.navigation.setNavigationContents($(breadcrumb).siblings('div.storednav').children().clone(), expand);
                return true;
            }
            
            $('#navloading').remove();
            $('#navigation').append('<div id="navloading" style="height:'+height+'px;"></div>');
            
            var nav_sniffer = 'http://www1.unl.edu/wdn/templates_3.0/scripts/navigationSniffer.php?u=';
            nav_sniffer = nav_sniffer+escape(WDN.toAbs(breadcrumb.href, window.location));
            WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
            WDN.get(nav_sniffer, '', function(data, textStatus) {
                try {
                    if (textStatus == 'success') {
                    	var breadcrumbParent = $(breadcrumb).parent();
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
            $('#navloading').remove();
            $('#navigation').children('ul').remove()
            	.end().prepend(contents);
            if (!expand) {
            	return;
            }
            WDN.navigation.currentState = -1;
            WDN.navigation.expand();
        },
        
        setWrapperClass : function(css_class) {
            WDN.log('Adding class '+css_class);
            if (css_class=='collapsed') {
                $('#wdn_wrapper').removeClass('nav_pinned').removeClass('nav_expanded').addClass('nav_'+css_class);
                return;
            }
            
            $('#wdn_wrapper').removeClass('nav_collapsed').addClass('nav_'+css_class);
        },
        
        storeNav : function(li, data) {
        	var storednavDiv = $(li).children('div.storednav');
        	if (storednavDiv.length) {
        		storednavDiv.empty();
        	} else {
        		storednavDiv = $('<div class="storednav"/>');
        		$(li).append(storednavDiv);
        	}
        	storednavDiv.append(data);
        }
    };
}();