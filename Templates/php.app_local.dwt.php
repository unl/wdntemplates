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
    <?php wdnInclude("/wdn/templates_5.0/includes/global/head-1.html"); ?>
    <!--
      Membership and regular participation in the UNL Web Developer Network is required to use the UNLedu Web Framework. Visit the WDN site at http://wdn.unl.edu/. Register for our mailing list and add your site or server to UNLwebaudit.
      All framework code is the property of the UNL Web Developer Network. The code seen in a source code view is not, and may not be used as, a template. You may not use this code, a reverse-engineered version of this code, or its associated visual presentation in whole or in part to create a derivative work.
      This message may not be removed from any pages based on the UNLedu Web Framework.

      $Id$
    -->
    <!-- InstanceBeginEditable name="doctitle" -->
    <title>App Sub-Theme</title>
    <!-- InstanceEndEditable -->
    <?php wdnInclude("/wdn/templates_5.0/includes/global/head-2-local.html"); ?>
    <!-- InstanceBeginEditable name="head" -->
    <!-- Place optional header elements here -->
    <!-- InstanceEndEditable -->
    <!-- TemplateParam name="class" type="text" value="" -->
</head>
<body class="@@(_document['class'])@@ unl app" data-version="$HTML_VERSION$">
<?php wdnInclude("/wdn/templates_5.0/includes/global/skip-nav.html"); ?>
<header class="dcf-header" id="dcf-header" role="banner">
    <?php wdnInclude("/wdn/templates_5.0/includes/global/header-global-1.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/idm.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/search.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/header-global-2.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/logo-lockup-1.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/site-affiliation-1.html"); ?>
    <!-- InstanceBeginEditable name="affiliation" -->
    <!-- InstanceEndEditable -->
    <?php wdnInclude("/wdn/templates_5.0/includes/global/site-affiliation-2.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/site-title-1.html"); ?>
    <!-- InstanceBeginEditable name="titlegraphic" -->
    <a class="unl-site-title-short" href="https://www.unl.edu/">
        Web Application
    </a>
    <!-- InstanceEndEditable -->
    <?php wdnInclude("/wdn/templates_5.0/includes/global/site-title-2.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/logo-lockup-2.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/nav-toggle-group.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/nav-menu-1.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/nav-menu-child-app-1.html"); ?>
    <!-- InstanceBeginEditable name="appcontrols" -->
    <?php wdnInclude("/wdn/templates_5.0/includes/local/app-controls.html"); ?>
    <!-- InstanceEndEditable -->
    <?php wdnInclude("/wdn/templates_5.0/includes/global/nav-menu-child-app-2.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/nav-menu-2.html"); ?>
    <?php wdnInclude("/wdn/templates_5.0/includes/global/app-search-1.html"); ?>
    <!-- InstanceBeginEditable name="appsearch" -->
    <?php wdnInclude("/wdn/templates_5.0/includes/local/app-search.html"); ?>
    <!-- InstanceEndEditable -->
    <?php wdnInclude("/wdn/templates_5.0/includes/global/app-search-2.html"); ?>
</header>

<main class="dcf-wrapper" id="dcf-main" role="main" tabindex="-1">
    <!-- InstanceBeginEditable name="maincontentarea" -->
    <p>Impress your audience with awesome content!</p>
    <!-- InstanceEndEditable -->
</main>
<footer class="dcf-footer" id="dcf-footer" role="contentinfo">
    <?php wdnInclude("/wdn/templates_5.0/includes/global/footer-global-1.html"); ?>
    <!-- InstanceBeginEditable name="contactinfo" -->
    <?php wdnInclude("/wdn/templates_5.0/includes/local/footer-local.html"); ?>
    <!-- InstanceEndEditable -->
    <?php wdnInclude("/wdn/templates_5.0/includes/global/footer-global-2.html"); ?>
</footer>
<?php wdnInclude("/wdn/templates_5.0/includes/global/noscript.html"); ?>
<?php wdnInclude("/wdn/templates_5.0/includes/global/js-body-local.html"); ?>
</body>
</html>
