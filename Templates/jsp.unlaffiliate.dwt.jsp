<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
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
<link rel="stylesheet" type="text/css" media="screen" href="/wdn/templates_3.1/css/all.css" />
<link rel="stylesheet" type="text/css" media="print" href="/wdn/templates_3.1/css/print.css" />
<link rel="stylesheet" type="text/css" media="screen" href="../sharedcode/affiliate.css" />
<script type="text/javascript" src="/wdn/templates_3.1/scripts/all.js"></script>
<jsp:include page="/wdn/templates_3.1/includes/browserspecifics.html" />
<jsp:include page="/wdn/templates_3.1/includes/metanfavico.html" />
<!-- TemplateBeginEditable name="doctitle" -->
<title>UNL | Department | New Page</title>
<!-- TemplateEndEditable --><!-- TemplateBeginEditable name="head" -->
<!-- Place optional header elements here -->
<!-- TemplateEndEditable -->
</head>
<body class="fixed">
<p class="skipnav"> <a class="skipnav" href="#maincontent">Skip Navigation</a> </p>
<div id="wdn_wrapper">
    <div id="header"> 	
		<!-- TemplateBeginEditable name="sitebranding" -->
		<div id="affiliate_note"><a href="http://www.unl.edu" title="University of Nebraska&ndash;Lincoln">An affiliate of the University of Nebraska&ndash;Lincoln</a></div>
		<a href="/" title="Through the Eyes of the Child Initiative"><img src="../sharedcode/affiliate_imgs/affiliate_logo.png" alt="Through the Eyes of the Child Initiative" id="logo" /></a>
    	<h1>Through the Eyes of the Child Initiative</h1>
		<div id='tag_line'>A Nebraska Supreme Court Initiative</div>
		<!-- TemplateEndEditable -->
		<jsp:include page="/wdn/templates_3.1/includes/wdnTools.html" />
    </div>
    <div id="wdn_navigation_bar">
        <div id="breadcrumbs">
            <!-- WDN: see glossary item 'breadcrumbs' -->
            <!-- TemplateBeginEditable name="breadcrumbs" -->
            <ul>
                <li><a href="http://www.unl.edu/" title="University of Nebraska&ndash;Lincoln">UNL</a></li>
                <li>Department</li>
            </ul>
            <!-- TemplateEndEditable --></div>
        <div id="wdn_navigation_wrapper">
            <div id="navigation"><!-- TemplateBeginEditable name="navlinks" -->
                <%@ include file="../sharedcode/navigation.html" %>
                <!-- TemplateEndEditable --></div>
        </div>
    </div>
    <div id="wdn_content_wrapper">
        <div id="titlegraphic"><!-- TemplateBeginEditable name="titlegraphic" -->
            <h1>Department</h1>
            <!-- TemplateEndEditable --></div>
        <div id="pagetitle"><!-- TemplateBeginEditable name="pagetitle" --> <!-- TemplateEndEditable --></div>
        <div id="maincontent">
            <!--THIS IS THE MAIN CONTENT AREA; WDN: see glossary item 'main content area' -->
            <!-- TemplateBeginEditable name="maincontentarea" -->
            <p>Place your content here.<br />
                Remember to validate your pages before publishing! Sample layouts are available through the <a href="http://wdn.unl.edu//">Web Developer Network</a>. <br />
                <a href="http://validator.unl.edu/check/referer">Check this page</a> </p>
            <!-- TemplateEndEditable -->
            <div class="clear"></div>
            <jsp:include page="/wdn/templates_3.1/includes/noscript.html" />
            <!--THIS IS THE END OF THE MAIN CONTENT AREA.-->
        </div>
        <div id="footer">
            <div id="footer_floater"></div>
            <div class="footer_col">
                <jsp:include page="/wdn/templates_3.1/includes/feedback.html" />
            </div>
            <div class="footer_col"><!-- TemplateBeginEditable name="leftcollinks" -->
                <%@ include file="../sharedcode/relatedLinks.html" %>
                <!-- TemplateEndEditable --></div>
            <div class="footer_col"><!-- TemplateBeginEditable name="contactinfo" -->
                <%@ include file="../sharedcode/footerContactInfo.html" %>
                <!-- TemplateEndEditable --></div>
            <div class="footer_col">
                <jsp:include page="/wdn/templates_3.1/includes/socialmediashare.html" />
            </div>
            <!-- TemplateBeginEditable name="optionalfooter" --> <!-- TemplateEndEditable -->
            <div id="wdn_copyright"><!-- TemplateBeginEditable name="footercontent" -->
                <%@ include file="../sharedcode/footer.html" %>
                <!-- TemplateEndEditable -->
                <jsp:include page="/wdn/templates_3.1/includes/wdn.html" />
            </div>
        </div>
    </div>
    <div id="wdn_wrapper_footer"> </div>
</div>
</body>
</html>
