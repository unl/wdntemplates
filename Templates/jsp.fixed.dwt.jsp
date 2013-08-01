<!DOCTYPE html>
<!--[if IEMobile 7 ]><html class="ie iem7"><![endif]-->
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"><![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"><![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"><![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7) ]><html class="ie" lang="en"><![endif]-->
<!--[if !(IEMobile) | !(IE)]><!--><html lang="en"><!--<![endif]-->
<head>
<jsp:include page="/wdn/templates_4.0/includes/metanfavico.html" />
<!--
    Membership and regular participation in the UNL Web Developer Network
    is required to use the UNL templates. Visit the WDN site at 
    http://wdn.unl.edu/. Click the WDN Registry link to log in and
    register your unl.edu site.
    All UNL template code is the property of the UNL Web Developer Network.
    The code seen in a source code view is not, and may not be used as, a 
    template. You may not use this code, a reverse-engineered version of 
    this code, or its associated visual presentation in whole or in part to
    create a derivative work.
    This message may not be removed from any pages based on the UNL site template.
    
    $Id$
-->
<jsp:include page="/wdn/templates_4.0/includes/scriptsandstyles.html" />
<!-- TemplateBeginEditable name="doctitle" -->
<title>Use a descriptive page title | Optional Site Title (use for context) | University of Nebraska&ndash;Lincoln</title>
<!-- TemplateEndEditable -->
<!-- TemplateBeginEditable name="head" -->
<!-- Place optional header elements here -->

<!-- TemplateEndEditable -->
<!-- TemplateParam name="class" type="text" value="" -->
</head>
<body class="@@(_document['class'])@@" data-version="$HTML_VERSION$">
    <jsp:include page="/wdn/templates_4.0/includes/skipnav.html" />
    <div id="wdn_wrapper">
        <input type="checkbox" id="wdn_menu_toggle" value="Show navigation menu" class="wdn-content-slide wdn-input-driver" />
        <jsp:include page="/wdn/templates_4.0/includes/noscript-padding.html" />
        <header id="header" role="banner" class="wdn-content-slide wdn-band">
            <jsp:include page="/wdn/templates_4.0/includes/wdnResources.html" />
            <div class="wdn-inner-wrapper">
                <jsp:include page="/wdn/templates_4.0/includes/logo.html" />
                <div id="wdn_resources">
                    <jsp:include page="/wdn/templates_4.0/includes/idm.html" />
                    <jsp:include page="/wdn/templates_4.0/includes/wdnTools.html" />
                </div>
                <span id="wdn_institution_title">University of Nebraska&ndash;Lincoln</span>
            </div>
            <jsp:include page="/wdn/templates_4.0/includes/apps.html" />
            <div class="wdn-inner-wrapper">
                <div id="wdn_site_title">
                    <span><!-- TemplateBeginEditable name="titlegraphic" -->The Title of My Site<!-- TemplateEndEditable --></span>
                </div>
            </div>
        </header>
        <div id="wdn_navigation_bar" role="navigation" class="wdn-band">
            <nav id="breadcrumbs" class="wdn-inner-wrapper">
                <!-- WDN: see glossary item 'breadcrumbs' -->
                <h3 class="wdn_list_descriptor wdn-text-hidden">Breadcrumbs</h3>
                <!-- TemplateBeginEditable name="breadcrumbs" -->
                <ul>
                    <li><a href="http://www.unl.edu/" title="University of Nebraska&ndash;Lincoln" class="wdn-icon-home">UNL</a></li>
                    <li class="selected"><a href="http://architecture.unl.edu/" title="College of Architecture">College of Architecture</a></li>
                    <li>Home</li>
                </ul>
                <!-- TemplateEndEditable -->
            </nav>
            <div id="wdn_navigation_wrapper">
                <nav id="navigation" role="navigation" class="wdn-band">
                    <h3 class="wdn_list_descriptor wdn-text-hidden">Navigation</h3>
                    <!-- TemplateBeginEditable name="navlinks" -->
                    <%@ include file="../sharedcode/navigation.html" %>
                    <!-- TemplateEndEditable -->
                    <label for="wdn_menu_toggle" class="wdn-icon-menu">Menu</label>
                </nav>
            </div>
        </div>
        <!-- Navigation Trigger -->
        <div class="wdn-menu-trigger wdn-content-slide">
            <label for="wdn_menu_toggle" class="wdn-icon-menu">Menu</label>
        </div>
        <!-- End navigation trigger -->
        <div id="wdn_content_wrapper" role="main" class="wdn-content-slide">
            <div class="wdn-band">
                <div class="wdn-inner-wrapper">
                    <div id="pagetitle">
                        <!-- TemplateBeginEditable name="pagetitle" -->
                        <!-- TemplateEndEditable -->
                    </div>
                </div>
            </div>
            <div id="maincontent" class="wdn-main">
                <!--THIS IS THE MAIN CONTENT AREA; WDN: see glossary item 'main content area' -->
                <!-- TemplateBeginEditable name="maincontentarea" -->
                
                <!-- TemplateEndEditable -->
                <!--THIS IS THE END OF THE MAIN CONTENT AREA.-->
            </div>
        </div>
        <div class="wdn-band wdn-content-slide" id="wdn_optional_footer">
            <div class="wdn-inner-wrapper">
                <!-- TemplateBeginEditable name="optionalfooter" -->
                <!-- TemplateEndEditable -->
            </div>
        </div>
        <footer id="footer" role="contentinfo" class="wdn-content-slide">
            <div class="wdn-band" id="wdn_footer_related">
                <div class="wdn-inner-wrapper">
                    <!-- TemplateBeginEditable name="leftcollinks" -->
                    <%@ include file="../sharedcode/relatedLinks.html" %>
                    <!-- TemplateEndEditable -->
                </div>
            </div>
            <div class="wdn-band">
                <div class="wdn-inner-wrapper">
                    <div class="footer_col" id="wdn_footer_contact">
                        <h3>Contact Us</h3>
                        <div class="wdn-contact-wrapper">
                            <!-- TemplateBeginEditable name="contactinfo" -->
                            <%@ include file="../sharedcode/footerContactInfo.html" %>
                            <!-- TemplateEndEditable -->
                        </div>
                    </div>
                    <div id="wdn_copyright">
                        <div class="wdn-footer-text">
                            <!-- TemplateBeginEditable name="footercontent" -->
                            <%@ include file="../sharedcode/footer.html" %>
                            <!-- TemplateEndEditable -->
                            <jsp:include page="/wdn/templates_4.0/includes/wdn.html" />
                        </div>
                    <jsp:include page="/wdn/templates_4.0/includes/logos.html" />
                    </div>
                </div>
            </div>
            <jsp:include page="/wdn/templates_4.0/includes/footer_floater.html" />
        </footer>
        <jsp:include page="/wdn/templates_4.0/includes/noscript.html" />
    </div>
</body>
</html>
