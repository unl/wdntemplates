<?php
function wdnInclude($path)
{
    if (function_exists('virtual')) {
        return virtual($path);
    }

    $documentRoot = __DIR__;
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $documentRoot = $_SERVER['DOCUMENT_ROOT'];
    }

    return readfile($documentRoot . $path);
}
?>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
<?php wdnInclude("/wdn/templates_4.1/includes/metanfavico_local.html"); ?>
<!--
    Membership and regular participation in the UNL Web Developer Network is required to use the UNLedu Web Framework. Visit the WDN site at http://wdn.unl.edu/. Register for our mailing list and add your site or server to UNLwebaudit.
    All framework code is the property of the UNL Web Developer Network. The code seen in a source code view is not, and may not be used as, a template. You may not use this code, a reverse-engineered version of this code, or its associated visual presentation in whole or in part to create a derivative work.
    This message may not be removed from any pages based on the UNLedu Web Framework.

    $Id$
-->
<?php wdnInclude("/wdn/templates_4.1/includes/scriptsandstyles_debug.html"); ?>
<!-- TemplateBeginEditable name="doctitle" -->
<title>Use a descriptive page title | Optional Site Title (use for context) | UNL Affiliate</title>
<!-- TemplateEndEditable -->
<!-- TemplateBeginEditable name="head" -->
<link rel="stylesheet" type="text/css" media="screen" href="../sharedcode/affiliate.css" />
<link href="../sharedcode/affiliate_imgs/favicon.ico" rel="shortcut icon" />
<!-- TemplateEndEditable -->
<!-- TemplateParam name="class" type="text" value="debug" -->
</head>
<body class="@@(_document['class'])@@" data-version="$HTML_VERSION$">
    <?php wdnInclude("/wdn/templates_4.1/includes/skipnav.html"); ?>
    <div id="wdn_wrapper">
        <input type="checkbox" id="wdn_menu_toggle" value="Show navigation menu" class="wdn-content-slide wdn-input-driver" />
        <?php wdnInclude("/wdn/templates_4.1/includes/noscript-padding.html"); ?>
        <header id="header" role="banner" class="wdn-content-slide wdn-band">
            <div id="wdn_header_top">
                <span id="wdn_institution_title"><!-- TemplateBeginEditable name="sitebranding_affiliate" --><a href="http://www.unl.edu" title="University of Nebraska&ndash;Lincoln">An affiliate of the University of Nebraska&ndash;Lincoln</a><!-- TemplateEndEditable --></span>
                <div id="wdn_resources">
                    <?php wdnInclude("/wdn/templates_4.1/includes/wdnResources.html"); ?>
                    <?php wdnInclude("/wdn/templates_4.1/includes/idm.html"); ?>
                    <?php wdnInclude("/wdn/templates_4.1/includes/search.html"); ?>
                </div>
            </div>
            <div id="wdn_logo_lockup">
                <div class="wdn-inner-wrapper">
                    <!-- TemplateBeginEditable name="sitebranding_logo" -->
                    <?php wdnInclude("/wdn/templates_4.1/includes/logo.html"); ?>
                    <!-- TemplateEndEditable -->
                    <span id="wdn_site_affiliation"><!-- TemplateBeginEditable name="affiliation" -->My site affiliation<!-- TemplateEndEditable --></span>
                    <span id="wdn_site_title"><!-- TemplateBeginEditable name="titlegraphic" -->Title of my site<!-- TemplateEndEditable --></span>
                </div>
            </div>
        </header>
        <div id="wdn_navigation_bar" class="wdn-band">
            <nav id="breadcrumbs" class="wdn-inner-wrapper" role="navigation" aria-label="breadcrumbs">
                <!-- TemplateBeginEditable name="breadcrumbs" -->
                <ul>
                    <li><a href="#">Affiliate Home</a></li>
                </ul>
                <!-- TemplateEndEditable -->
            </nav>
            <div id="wdn_navigation_wrapper">
                <nav id="navigation" role="navigation" aria-label="main navigation">
                    <!-- TemplateBeginEditable name="navlinks" -->
                    <?php readfile("../sharedcode/navigation.html") ?>
                    <!-- TemplateEndEditable -->
                    <?php wdnInclude("/wdn/templates_4.1/includes/navigation-addons.html"); ?>
                </nav>
            </div>
        </div>
        <div class="wdn-menu-trigger wdn-content-slide">
            <label for="wdn_menu_toggle" class="wdn-icon-menu">Menu</label>
            <?php wdnInclude("/wdn/templates_4.1/includes/share.html"); ?>
        </div>
        <main id="wdn_content_wrapper" role="main" class="wdn-content-slide" tabindex="-1">
            <div id="maincontent" class="wdn-main">
                <div id="pagetitle">
                    <!-- TemplateBeginEditable name="pagetitle" -->
                    <h1>Please Title Your Page Here</h1>
                    <!-- TemplateEndEditable -->
                </div>
                <!-- TemplateBeginEditable name="maincontentarea" -->
                <div class="wdn-band">
                    <div class="wdn-inner-wrapper">
                        <p>Impress your audience with awesome content!</p>
                    </div>
                </div>
                <!-- TemplateEndEditable -->
            </div>
        </main>
        <footer id="footer" role="contentinfo" class="wdn-content-slide">
            <div id="wdn_optional_footer" class="wdn-band wdn-footer-optional">
                <div class="wdn-inner-wrapper">
                    <!-- TemplateBeginEditable name="optionalfooter" -->
                    <!-- TemplateEndEditable -->
                </div>
            </div>
            <div id="wdn_local_footer" class="wdn-band wdn-footer-local">
                <div class="wdn-inner-wrapper">
                    <!-- TemplateBeginEditable name="contactinfo" -->
                    <?php readfile("../sharedcode/localFooter.html") ?>
                    <!-- TemplateEndEditable -->
                    <!-- TemplateBeginEditable name="leftcollinks" -->
                    <!-- TemplateEndEditable -->
                </div>
            </div>
            <div id="wdn_global_footer" class="wdn-band wdn-footer-global">
                <div class="wdn-inner-wrapper">
                   <?php wdnInclude("/wdn/templates_4.1/includes/globalfooter.html"); ?>
                </div>
            </div>
        </footer>
        <?php wdnInclude("/wdn/templates_4.1/includes/noscript.html"); ?>
    </div>
    <?php wdnInclude("/wdn/templates_4.1/includes/body_scripts.html"); ?>
</body>
</html>
