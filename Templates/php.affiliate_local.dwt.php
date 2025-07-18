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
<html lang="en">
    <head>
        <?php wdnInclude("/wdn/templates_6.0/includes/global/head-1.html"); ?>
        <!--
          Membership and regular participation in the University of Nebraska-Lincoln (UNL) Web Developer Network (WDN) is required to use the UNLedu Web Framework. Visit the WDN site at https://wdn.unl.edu/. Register for our mailing list and add your site or server to UNL Web Audit.
          All framework code is the property of the UNL Web Developer Network. The code seen in a source code view is not, and may not be used as, a template. You may not use this code, a reverse-engineered version of this code, or its associated visual presentation in whole or in part to create a derivative work.
          This message may not be removed from any pages based on the UNLedu Web Framework.

          $Id$
        -->
        <!-- TemplateBeginEditable name="doctitle" -->
        <title>Use a descriptive page title | Optional Site Title (use for context) | University of Nebraska&ndash;Lincoln</title>
        <!-- TemplateEndEditable -->
        <?php wdnInclude("/wdn/templates_6.0/includes/global/affiliate-head-2-local.html"); ?>
        <!-- TemplateBeginEditable name="head" -->
        <!-- Place optional header elements here -->
        <link rel="stylesheet" href="/wdn/templates_6.0/includes/local/affiliate-custom.css">
        <link rel="icon" href="/wdn/templates_6.0/includes/global/favicon/favicon.ico" sizes="any">
        <link rel="icon" href="/wdn/templates_6.0/includes/global/favicon/icon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/wdn/templates_6.0/includes/global/favicon/apple-touch-icon.png">
        <link rel="manifest" href="/wdn/templates_6.0/includes/global/favicon/manifest.webmanifest">
        <meta name="theme-color" content="#d00000">
        <!-- TemplateEndEditable -->
        <!-- TemplateParam name="class" type="text" value="" -->
    </head>
    <body class="@@(_document['class'])@@ unl afilliate" data-version="$HTML_VERSION$" data-template="affiliate-local">
        <?php wdnInclude("/wdn/templates_6.0/includes/global/skip-nav.html"); ?>
        <header class="dcf-header" id="dcf-header" role="banner">
            <!-- TemplateBeginEditable name="affiliateheaderglobal" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-header-global-1.html"); ?>
            <!-- TemplateEndEditable -->
            <!-- TemplateBeginEditable name="affiliateidm" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-idm.html"); ?>
            <!-- TemplateEndEditable -->
            <!-- TemplateBeginEditable name="affiliatesearch" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-search.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/header-global-2.html"); ?>
            <!-- TemplateBeginEditable name="affiliatelogo" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-logo-lockup-1.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/site-affiliation-1.html"); ?>
            <!-- TemplateBeginEditable name="affiliation" -->
            <a href="#">My site affiliation</a>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/site-affiliation-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/site-title-1.html"); ?>
            <!-- TemplateBeginEditable name="titlegraphic" -->
            <a class="dcf-txt-h6" href="#">Title of my site</a>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/site-title-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/logo-lockup-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-container-1.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/affiliate-nav-toggle-group-1.html"); ?>
            <!-- TemplateBeginEditable name="affiliatemobilesearch" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-mobile-search.html"); ?>
            <!-- TemplateEndEditable -->
            <!-- TemplateBeginEditable name="affiliatemobileidm" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-mobile-idm.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/affiliate-nav-toggle-group-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-menu-1.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-local-1.html"); ?>
            <!-- TemplateBeginEditable name="navlinks" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/nav-local.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-local-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-menu-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-dialog-1.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-local-copy-dialog.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/cta-1.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/visit-1.html"); ?>
            <!-- TemplateBeginEditable name="navvisit" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/visit-local.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/visit-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/apply-1.html"); ?>
            <!-- TemplateBeginEditable name="navapply" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/apply-local.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/apply-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/give-1.html"); ?>
            <!-- TemplateBeginEditable name="navgive" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/give-local.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/give-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/cta-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-dialog-2.html"); ?>
            <?php wdnInclude("/wdn/templates_6.0/includes/global/nav-container-2-local.html"); ?>
        </header>
        <main class="dcf-main" id="dcf-main" role="main" tabindex="-1">
            <!-- TemplateBeginEditable name="highlighted" -->
            <!-- TemplateEndEditable -->
            <!-- TemplateBeginEditable name="hero" -->
            <div class="dcf-hero dcf-hero-default">
                <!-- TemplateEndEditable -->
                <div class="dcf-hero-group-1">
                    <div class="dcf-breadcrumbs-wrapper">
                        <nav class="dcf-breadcrumbs" id="dcf-breadcrumbs" role="navigation" aria-label="breadcrumbs">
                            <!-- TemplateBeginEditable name="breadcrumbs" -->
                            <ol>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Page Title</a></li>
                                <li><span aria-current="page">Current Page</span></li>
                            </ol>
                            <!-- TemplateEndEditable -->
                        </nav>
                    </div>
                    <header class="dcf-page-title" id="dcf-page-title">
                        <!-- TemplateBeginEditable name="pagetitle" -->
                        <h1>Please Title Your Page Here</h1>
                        <!-- TemplateEndEditable -->
                    </header>
                    <!-- TemplateBeginEditable name="herogroup1" -->
                    <!-- TemplateEndEditable -->
                </div>
                <!-- TemplateBeginEditable name="herogroup2" -->
                <div class="dcf-hero-group-2">
                </div>
                <!-- TemplateEndEditable -->
            </div>
            <div class="dcf-main-content dcf-wrapper">
                <!-- TemplateBeginEditable name="maincontentarea" -->
                <p>Impress your audience with awesome content!</p>
                <!-- TemplateEndEditable -->
            </div>
        </main>
        <footer class="dcf-footer" id="dcf-footer" role="contentinfo">
            <!-- TemplateBeginEditable name="optionalfooter" -->
            <!-- TemplateEndEditable -->
            <!-- TemplateBeginEditable name="contactinfo" -->
            <?php wdnInclude("/wdn/templates_6.0/includes/local/affiliate-footer.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_6.0/includes/global/noscript.html"); ?>
        </footer>
        <?php wdnInclude("/wdn/templates_6.0/includes/global/js-body-local.html"); ?>
        <!-- TemplateBeginEditable name="jsbody" -->
        <!-- Put your custom JavaScript here -->
        <!-- TemplateEndEditable -->
    </body>
</html>
