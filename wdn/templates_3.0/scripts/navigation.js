WDN.navigation = function() {
    var expandedHeight = 0;
    return {
        
        preferredState : 0,
        
        currentState : -1,
        
        navigation : Array(),
        
        siteHomepage : false,
        
        /**
         * Stores an expand/collapse timout.
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
                || WDN.jQuery('body').hasClass('document')) {
                return;
            }
            WDN.jQuery('#navigation').append('<div id="navigation-close"></div>');
            WDN.jQuery('#navigation').append('<div id="navigation-expand-collapse"><span></span></div>');
            WDN.jQuery('#navigation-expand-collapse').click(WDN.navigation.setPreferredState);
            WDN.jQuery('#navigation-close').click(WDN.navigation.collapse);
            WDN.navigation.determineSelectedBreadcrumb();
            WDN.jQuery('#breadcrumbs ul li a').hover(WDN.navigation.startChangeNavigationDelay);

            // Store the current state of the cookie
            if (WDN.getCookie('n') == 1) {
                WDN.navigation.preferredState = 1;
            }
            WDN.navigation.initializePreferredState();
            
            //adds the curved end to the right side of the breadcrumbs bar in IE
            if (WDN.jQuery.browser.msie) {
            	WDN.jQuery('#breadcrumbs').append('<span></span>');
            	WDN.jQuery('#breadcrumbs span').css({'height':'35px', 'width':'8px','position':'absolute','top':'0', 'right':'-3px','margin':'0 0 0 100%','background':'url("'+WDN.template_path+'wdn/templates_3.0/css/navigation/images/breadcrumbBarSprite2.png") 0 -72px no-repeat'});
            }
        },
        
        /**
         * This function should determine which breadcrumb should be selected.
         */
        determineSelectedBreadcrumb : function() {
            // First we search for a defined homepage.
            var pagelinks = document.getElementsByTagName('link');
            for (var i=0;i<pagelinks.length;i++) {
                var relatt = pagelinks[i].getAttribute('rel');
                if (relatt=='home') {
                	WDN.navigation.siteHomepage = WDN.toAbs(pagelinks[i].getAttribute('href'), window.location.toString());
                    WDN.log('Setting homepage to '+WDN.navigation.siteHomepage);
                }
            }
            
            if (WDN.navigation.siteHomepage == false) {
                WDN.log('No homepage set!');
                // Right now, stupidly select the second element.
                WDN.jQuery('#breadcrumbs > ul >  li:nth-child(2)').addClass('selected');
                if (WDN.jQuery('#breadcrumbs > ul > li.selected a').size()) {
                    // Found the homepage url in the breadcrumbs
                    WDN.navigation.siteHomepage = WDN.jQuery('#breadcrumbs > ul > li.selected').find('a').attr('href');
                } else {
                    // Assume it's the current page
                    WDN.navigation.siteHomepage = window.location;
                    WDN.jQuery('#breadcrumbs > ul > li.selected').wrapInner('<a href="'+WDN.navigation.siteHomepage+'"></a>');
                }
            } else {
                WDN.log('Homepage has been set.');
                // Make all the hrefs absolute.
                WDN.jQuery('#breadcrumbs > ul > li > a').each(
                        function() {
                            if (this.href == WDN.navigation.siteHomepage) {
                            	WDN.jQuery(this).parent().addClass('selected');
                                return false;
                            }
                        }
                    );
                if (WDN.jQuery('#breadcrumbs > ul > li.selected').size() < 1) {
	                WDN.log('We are on the current homepage.');
	                WDN.jQuery('#breadcrumbs > ul > li:last-child').addClass('selected');
	                WDN.jQuery('#breadcrumbs > ul > li.selected').wrapInner('<a href="'+WDN.navigation.siteHomepage+'"></a>');
                }
            }
            
            
        },
        
        /**
         * Expand the navigation section.
         */
        expand : function() {
            WDN.log('expand called');
            if (WDN.jQuery.browser.msie)
            	WDN.jQuery('#navigation-close').show();
            else
            	WDN.jQuery('#navigation-close').fadeIn();
            WDN.navigation.setWrapperClass('expanded');
            WDN.navigation.currentState = 1;
            WDN.navigation.updateHelperText();
        },
        
        updateHelperText : function() {
            if (WDN.navigation.preferredState == 1) {
            	WDN.jQuery('#navigation-expand-collapse span').text('click to always hide full navigation');
            } else {
                if (WDN.navigation.currentState == 0) {
                	WDN.jQuery('#navigation-expand-collapse span').text('roll over for full navigation');
                } else {
                	WDN.jQuery('#navigation-expand-collapse span').text('click to always show full navigation');
                }
            }
        },
        
        /**
         * Collapse the navigation
         */
        collapse : function(animate) {
            WDN.log('collapse called');
            if (WDN.navigation.currentState == 0) {
                return;
            }
            if (expandedHeight == 0) {
                //expandedHeight = WDN.jQuery('#navigation').height();
            }
            WDN.jQuery('#navigation-close').hide();
        	WDN.jQuery('#navigation-expand-collapse span').text('roll over for full navigation');
            WDN.navigation.setWrapperClass('collapsed');
            WDN.navigation.currentState = 0;
        },
        
        /**
         * Set a delay for expanding the navigation.
         */
        startExpandDelay : function (event) {
            WDN.log('start expand delay');
            clearTimeout(WDN.navigation.timeout);
            if (WDN.navigation.currentState == 1) {
                return;
            }
            WDN.navigation.timeout = setTimeout(WDN.navigation.expand, WDN.navigation.expandDelay);
        },
        
        /**
         * Set a delay for collapsing the navigation.
         */
        startCollapseDelay: function(event) {
            WDN.log('start collapse delay');
            clearTimeout(WDN.navigation.timeout);
            if (WDN.navigation.currentState == 0) {
                return;
            }
            if (WDN.navigation.preferredState == 1) {
                return;
            }
            WDN.navigation.timeout = setTimeout(WDN.navigation.collapse, WDN.navigation.collapseDelay);
        },
        
        startChangeNavigationDelay: function(breadcrumb) {
            WDN.navigation.startExpandDelay();
            WDN.navigation.timeout = setTimeout(function(){WDN.navigation.switchSiteNavigation(breadcrumb);}, WDN.navigation.changeSiteNavDelay);
        },
        
        setPreferredState : function(event) {
            WDN.log('set preferred state');
            if (WDN.getCookie('n')!=1) {
                WDN.log('Setting preferred navigation state OPEN');
                // Remove the hover function?
                //WDN.jQuery('#wdn_navigation_bar').hover();
                
                WDN.setCookie('n',1,5000);
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
            if (WDN.navigation.preferredState==1) {
                WDN.navigation.setWrapperClass('pinned');
                WDN.navigation.expand();
                var mouseout = null;
            } else {
            	WDN.jQuery('#navigation ul:first li:nth-child(6) a:visible:first').css({width:'95%'});
                WDN.navigation.collapse();
                var mouseout = WDN.navigation.startCollapseDelay;
            }
            WDN.jQuery('#wdn_navigation_bar').hover(
                    WDN.navigation.startExpandDelay,
                    mouseout);
            WDN.jQuery('#wdn_content_wrapper,#header').hover(
                    WDN.navigation.startCollapseDelay);
            WDN.navigation.updateHelperText();
        },
        
        switchSiteNavigation : function(breadcrumb) {
            WDN.log('Switch site nav called');
            
            if (WDN.jQuery(breadcrumb.target).parent().hasClass('selected')) {
                WDN.log('already showing this nav');
                return true;
            }

            if (WDN.jQuery('#breadcrumbs ul li.selected div.storednav').length == 0) {
            	WDN.log('Storing it');
	            // Store the current navigation
	            WDN.jQuery('#breadcrumbs ul > li.selected:first').append('<div class="storednav"><ul>'+WDN.jQuery('#navigation ul').html()+'</ul></div>');
            }
            
            // Set the hovered breadcrumb link to selected
            WDN.jQuery('#breadcrumbs ul li.selected').removeClass('selected');
            WDN.jQuery(breadcrumb.target).parent().addClass('selected');
            // Check for stored navigation
            if (WDN.jQuery(breadcrumb.target).parent().find('.storednav').length > 0) {
            	WDN.log("Already got it.");
                // We've already grabbed the nav for this link
                WDN.navigation.setNavigationContents(WDN.jQuery(breadcrumb.target).parent().find('.storednav').html());
                return true;
            }
            
            var height = WDN.jQuery('#navigation ul').height();
            WDN.jQuery('#navigation ul').hide();
            WDN.jQuery('#navloading').remove();
            WDN.jQuery('#navigation').append('<div id="navloading" style="height:'+height+'px;"></div>');
            
            var nav_sniffer = 'http://www1.unl.edu/wdn/test/wdn/templates_3.0/scripts/navigationSniffer.php?u=';
            nav_sniffer = nav_sniffer+escape(WDN.toAbs(breadcrumb.target.href, window.location));
            WDN.log('Attempting to retrieve navigation from '+nav_sniffer);
            WDN.get(nav_sniffer, '', function(data, textStatus) {
            	WDN.jQuery('#navloading').remove();
                try {
                    if (textStatus == 'success') {
                    	WDN.jQuery('#breadcrumbs ul li a[href="'+breadcrumb.currentTarget.href+'"').append('<div class="storednav">'+data+'</div>');
                            WDN.navigation.setNavigationContents(data);
                    } else {
                        // Error message
                        WDN.log('Incorrect status code returned remotely retrieving navigation.');
                        WDN.log(data);
                        WDN.log(textStatus);
                        WDN.navigation.setNavigationContents('An error occurred');
                    }
                } catch(e) {
                    WDN.log('Caught error remotely retrieving navigation.');
                    WDN.log(e);
                }
            });
            return false;
        },
        
        setNavigationContents : function(contents) {
            WDN.log('setNavigationContents called');
            WDN.jQuery('#navigation>ul').replaceWith(contents);
            WDN.navigation.currentState = -1;
            WDN.navigation.expand();
        },
        
        setWrapperClass : function(css_class) {
            WDN.log('Adding class '+css_class);
            if (css_class=='collapsed') {
            	WDN.jQuery('#wdn_wrapper').removeClass('nav_pinned');
            	WDN.jQuery('#wdn_wrapper').removeClass('nav_expanded');
            	WDN.jQuery('#wdn_wrapper').addClass('nav_'+css_class);
                return;
            }
            
            WDN.jQuery('#wdn_wrapper').removeClass('nav_collapsed');
            WDN.jQuery('#wdn_wrapper').addClass('nav_'+css_class);
            
        }
    };
}();

