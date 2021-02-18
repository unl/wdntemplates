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
<html class="dcf-no-js dcf-no-webp" lang="en">
    <head>
        <?php wdnInclude("/wdn/templates_5.3/includes/global/head-1.html"); ?>
        <!--
          Membership and regular participation in the University of Nebraska–Lincoln (UNL) Web Developer Network (WDN) is required to use the UNLedu Web Framework. Visit the WDN site at https://wdn.unl.edu/. Register for our mailing list and add your site or server to UNL Web Audit.
          All framework code is the property of the UNL Web Developer Network. The code seen in a source code view is not, and may not be used as, a template. You may not use this code, a reverse-engineered version of this code, or its associated visual presentation in whole or in part to create a derivative work.
          This message may not be removed from any pages based on the UNLedu Web Framework.

          $Id$
        -->
        <!-- TemplateBeginEditable name="doctitle" -->
        <title>App Sub-Theme</title>
        <!-- TemplateEndEditable -->
        <?php wdnInclude("/wdn/templates_5.3/includes/global/head-2-local.html"); ?>
        <!-- TemplateBeginEditable name="head" -->
        <!-- Place optional header elements here -->
        <!-- TemplateEndEditable -->
        <!-- TemplateParam name="class" type="text" value="debug" -->
    </head>
    <body class="@@(_document['class'])@@ unl app" data-version="$HTML_VERSION$">
        <?php wdnInclude("/wdn/templates_5.3/includes/global/skip-nav.html"); ?>
        <header class="dcf-header" id="dcf-header" role="banner">
            <?php wdnInclude("/wdn/templates_5.3/includes/global/header-global-1.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/cta-header-1.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/visit-header-1.html"); ?>
            <!-- InstanceBeginEditable name="headervisit" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/visit-local.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/visit-header-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/apply-header-1.html"); ?>
            <!-- InstanceBeginEditable name="headerapply" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/apply-local.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/apply-header-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/give-header-1.html"); ?>
            <!-- InstanceBeginEditable name="headergive" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/give-local.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/give-header-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/cta-header-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/idm.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/search.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/header-global-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/logo-lockup-1.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/site-affiliation-1.html"); ?>
            <!-- InstanceBeginEditable name="affiliation" -->
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/site-affiliation-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/site-title-1.html"); ?>
            <!-- InstanceBeginEditable name="titlegraphic" -->
            <a class="dcf-txt-h5" href="#">
              Web Application
            </a>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/site-title-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/logo-lockup-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/nav-toggle-group.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/nav-menu-1.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/nav-menu-child-app-1.html"); ?>
            <!-- InstanceBeginEditable name="appcontrols" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/app-controls.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/cta-nav-1.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/visit-nav-1.html"); ?>
            <!-- InstanceBeginEditable name="navvisit" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/visit-local.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/visit-nav-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/apply-nav-1.html"); ?>
            <!-- InstanceBeginEditable name="navapply" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/apply-local.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/apply-nav-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/give-nav-1.html"); ?>
            <!-- InstanceBeginEditable name="navgive" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/give-local.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/give-nav-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/cta-nav-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/nav-menu-child-app-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/nav-menu-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/app-search-1.html"); ?>
            <!-- InstanceBeginEditable name="appsearch" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/app-search.html"); ?>
            <!-- InstanceEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/app-search-2.html"); ?>
        </header>
        <main class="dcf-wrapper" id="dcf-main" role="main" tabindex="-1">
            <!-- InstanceBeginEditable name="highlighted" -->
            <!-- InstanceEndEditable -->
            <!-- TemplateBeginEditable name="maincontentarea" -->
            <p>Impress your audience with awesome content!</p>
            <!-- TemplateEndEditable -->
        </main>
        <footer class="dcf-footer" id="dcf-footer" role="contentinfo">
            <!-- TemplateBeginEditable name="optionalfooter" -->
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/footer-global-1.html"); ?>
            <!-- TemplateBeginEditable name="contactinfo" -->
            <?php wdnInclude("/wdn/templates_5.3/includes/local/footer-local.html"); ?>
            <!-- TemplateEndEditable -->
            <?php wdnInclude("/wdn/templates_5.3/includes/global/footer-global-2.html"); ?>
            <?php wdnInclude("/wdn/templates_5.3/includes/global/noscript.html"); ?>
        </footer>
        <?php wdnInclude("/wdn/templates_5.3/includes/global/js-body-local.html"); ?>
        <!-- TemplateBeginEditable name="jsbody" -->
        <!-- Put your custom JavaScript here -->
        <!-- TemplateEndEditable -->
    </body>
</html>
