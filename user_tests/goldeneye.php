<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<link rel="home" href="http://www.unl.edu/" title="UNL" /> 
<link rel="stylesheet" type="text/css" media="screen"   href="../wdn/templates_3.0/css/debug.css" />
<link rel="stylesheet" type="text/css" media="print"    href="../wdn/templates_3.0/css/print.css" />
<script type="text/javascript" src="../wdn/templates_3.0/scripts/debug.js"></script>
<?php virtual("../sharedcode/localSiteLinks.html"); ?>
<?php virtual("../wdn/templates_3.0/includes/browserspecifics.html"); ?>
<?php virtual("../wdn/templates_3.0/includes/metanfavico.html"); ?>
<title>UNL | Template</title>
<link rel="stylesheet" type="text/css" media="screen"   href="nav_tests.css" />
</head>
<body class="fixed debug">
<p class="skipnav"><a class="skipnav" href="#maincontent">Skip
Navigation</a></p>
<div id="wdn_wrapper">
    <div id="header">
        <a href="http://www.unl.edu/" title="UNL website"><img src="../wdn/templates_3.0/images/logo.png" alt="UNL graphic identifier" id="logo" /></a>
        <h1>University of Nebraska&ndash;Lincoln</h1>
        <?php virtual("../wdn/templates_3.0/includes/wdnTools.html"); ?>
        <div id="wdn_identity_management"></div>
     </div>
    <div id="wdn_navigation_bar">
        <div id="breadcrumbs">
            <ul>
                <!-- WDN: see glossary item 'breadcrumbs' -->
                <li><a href="http://www.unl.edu/" title="University of Nebraska&ndash;Lincoln">UNL</a></li>
                <li class="selected"><a href="http://other.unl.edu/">Un-accessible site</a></li>
                <li><a href="http://admissions.unl.edu/">Admissions</a></li>
                <li><a href="http://admissions.unl.edu/visit.aspx">Visit</a></li>
                <li>This page</li>
            </ul>
        </div>
        <div id="wdn_navigation_wrapper">
            <div id="navigation">
                <?php virtual("../sharedcode/navigation.html"); ?>
                <!-- End Navigation Markup -->
            </div>
        </div>
    </div>
    <div id="wdn_content_wrapper">
        <div id="titlegraphic">
            <h1>Iterative Navigation Testing</h1>
        </div>
        <div id="pagetitle"><h2>Examples</h2></div>
        <div id="maincontent">
            <div id="heightPromo">
                <p>Your current exercise is below.</p>
            </div>
            <div id="exercise">
            
            </div>
            <!-- InstanceEndEditable --> 
            <a href="#" id="showTesting">show</a>
            <div class="clear"></div> 
            <noscript> 
            <p>
            Your browser does not appear to support JavaScript, or you have turned JavaScript off. You may use unl.edu without enabling JavaScript, but certain functions may not be available.
            </p>
            </noscript> 
        <!--THIS IS THE MAIN CONTENT AREA; WDN: see glossary item 'main content area' -->
           <?php virtual("../wdn/templates_3.0/includes/noscript.html"); ?>
        </div> <!-- end of maincontent -->        
        <div id="footer">
            <div id="footer_floater"></div>
            <div class="footer_col" id="footer_feedback">
                <?php virtual("../wdn/templates_3.0/includes/feedback.html"); ?>
            </div>
            <div class="footer_col">
                <?php virtual("../sharedcode/relatedLinks.html"); ?>
            </div>            
            <div class="footer_col">
                <?php virtual("../sharedcode/footerContactInfo.html"); ?>
            </div>
            <div class="footer_col">
                <?php virtual("../wdn/templates_3.0/includes/socialmediashare.html"); ?>
            </div>                   
            <div id="wdn_copyright">
                <?php virtual("../sharedcode/footer.html"); ?>                               
                <?php virtual("../wdn/templates_3.0/includes/wdn.html"); ?>
                | <a href="http://validator.unl.edu/check/referer">W3C</a> | <a href="http://jigsaw.w3.org/css-validator/check/referer">CSS</a>
                <a href="http://www.unl.edu/" title="UNL Home" id="wdn_unl_wordmark"><img src="../wdn/templates_3.0/css/footer/images/wordmark.png" alt="UNL's wordmark" /></a>
            </div>
        </div>    
    </div>
    <div style="clear:both;"> </div>
</div>
<?php virtual("test.html"); ?>
<script type="text/javascript" src="nav_tests.js"></script>
</body>
</html>