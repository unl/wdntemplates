<?php

if (empty($_GET['u'])) {
	throwError();
}

/**
 * @todo just gimme a regular expression someone.
 */
require_once 'Validate.php';
$v = new Validate();
if (!$v->uri($_GET['u'], array('allowed_schemes' => array('http', 'https')))) {
	throwError();
}

if (!preg_match('/\.unl\.edu/', $_GET['u'])
	&& !preg_match('/quiltstudy\.org/', $_GET['u'])
	&& !preg_match('/digital-community\.com/', $_GET['u'])
    && !preg_match('/huskeralum\.org/', $_GET['u'])
    && !preg_match('/huskeralum\.com/', $_GET['u'])
    && !preg_match('/throughtheeyes.org/', $_GET['u'])) {
    throwError('Requested host is not allowed');
}

function throwError($message = null)
{
	$header = "HTTP/1.0 500 Server Error";
	header($header);
	if ($message) {
		echo $message;
	} else {
		echo 'Error';
	}
	exit();
}
require_once 'UNL/Templates.php';
require_once 'UNL/Templates/Scanner.php';

$p = new UNL_Templates_Scanner(file_get_contents($_GET['u']));

$p->breadcrumbs = str_replace('<a href="http://admissions.unl.edu/apply/" title="apply now"><img src="/ucomm/templatedependents/templatecss/images/badge_applynow.png" alt="apply now" id="badge" /></a>',
							  '',
								$p->breadcrumbs);

function removeRelativePaths($html, $base_url)
{
    $needles = array('href="', 'src="', 'background="', 'loadCSS("', 'loadCSS(\'');
    $new_base_url = $base_url;
    $base_url_parts = parse_url($base_url);

    if (substr($base_url, -1) != '/') {
        $path = pathinfo($base_url_parts['path']);
        $new_base_url = substr($new_base_url, 0, strlen($new_base_url)-strlen($path['basename']));
    }

    foreach ($needles as $needle) {
        $new_txt = '';
        while ($pos = strpos($html, $needle)) {
            $pos += strlen($needle);
            if (substr($html, $pos, 7) != 'http://'
                && substr($html, $pos, 8) != 'https://'
                && substr($html, $pos, 6) != 'ftp://'
                && substr($html, $pos, 7) != 'mailto:'
                && substr($html, $pos, 1) != '#') {
                if (substr($html, $pos, 1) == '/') {
                    $new_txt .= substr($html, 0, $pos).$base_url_parts['scheme'].'://'.$base_url_parts['host'];
                } else {
                    $new_txt .= substr($html, 0, $pos).$new_base_url;
                }
            } else {
                $new_txt .= substr($html, 0, $pos);
            }
            $html = substr($html, $pos);
        }
        $html = $new_txt.$html;
    }
    return $html;
}

foreach (array('maincontentarea','head', 'doctitle') as $key) {
	$p->$key = str_replace(array('//<![CDATA[', '//]]>'), ' ', removeRelativePaths($p->$key, $_GET['u']));
}


echo ''.PHP_EOL;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
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
    
    $Id: fixed.dwt 414 2009-07-09 21:05:52Z bbieber2 $
-->
<link rel="stylesheet" type="text/css" media="screen" href="/wdn/templates_3.0/css/debug.css" />
<link rel="stylesheet" type="text/css" media="print" href="/wdn/templates_3.0/css/print.css" />
<script type="text/javascript" src="/wdn/templates_3.0/scripts/debug.js"></script>
<?php include 'wdn/templates_3.0/includes/browserspecifics.html'; ?>
<?php include 'wdn/templates_3.0/includes/metanfavico.html'; ?>
<!-- InstanceBeginEditable name="doctitle" -->
<?php echo $p->doctitle; ?>

<!-- InstanceEndEditable --><!-- InstanceBeginEditable name="head" -->
<!-- Place optional header elements here -->
<?php echo $p->head; ?>
<!-- InstanceEndEditable -->
</head>
<body class="fixed">
<p class="skipnav"> <a class="skipnav" href="#maincontent">Skip Navigation</a> </p>
<div id="wdn_wrapper">
    <div id="header"> <a href="http://www.unl.edu/" title="UNL website"><img src="/wdn/templates_3.0/images/logo.png" alt="UNL graphic identifier" id="logo" /></a>
        <h1>University of Nebraska&ndash;Lincoln</h1>
        <?php include_once 'wdn/templates_3.0/includes/wdnTools.html'; ?>
    </div>
    <div id="wdn_navigation_bar">
        <div id="breadcrumbs">
            <!-- WDN: see glossary item 'breadcrumbs' -->
            <!-- InstanceBeginEditable name="breadcrumbs" -->
            <?php echo (isset($p->breadcrumbs))?$p->breadcrumbs:''; ?>
        <!-- InstanceEndEditable --></div>
        <div id="wdn_navigation_wrapper">
            <div id="navigation"><!-- InstanceBeginEditable name="navlinks" -->
                <?php echo (isset($p->navlinks))?$p->navlinks:''; ?>
                <!-- InstanceEndEditable --></div>
        </div>
    </div>
    <div id="wdn_content_wrapper">
        <div id="titlegraphic"><!-- InstanceBeginEditable name="titlegraphic" -->
            <?php echo $p->titlegraphic; ?>
            <!-- InstanceEndEditable --></div>
        <div id="pagetitle"><!-- InstanceBeginEditable name="pagetitle" --><?php echo (isset($p->pagetitle))?$p->pagetitle:''; ?><!-- InstanceEndEditable --></div>
        <div id="maincontent">
            <!--THIS IS THE MAIN CONTENT AREA; WDN: see glossary item 'main content area' -->
            <!-- InstanceBeginEditable name="maincontentarea" -->
            <?php echo $p->maincontentarea; ?>
            <!-- InstanceEndEditable -->
            <div class="clear"></div>
            <?php include 'wdn/templates_3.0/includes/noscript.html'; ?>
            <!--THIS IS THE END OF THE MAIN CONTENT AREA.-->
        </div>
        <div id="footer">
            <div id="footer_floater"></div>
            <div class="footer_col">
                <?php include 'wdn/templates_3.0/includes/feedback.html'; ?>
            </div>
            <div class="footer_col"><!-- InstanceBeginEditable name="leftcollinks" -->
            <?php echo (isset($p->leftcollinks))?$p->leftcollinks:''; ?>
            <!-- InstanceEndEditable --></div>
            <div class="footer_col"><!-- InstanceBeginEditable name="contactinfo" -->
                <?php echo (isset($p->contactinfo))?$p->contactinfo:''; ?>
            <!-- InstanceEndEditable --></div>
            <div class="footer_col">
                <?php include 'wdn/templates_3.0/includes/socialmediashare.html'; ?>
            </div>
            <div id="wdn_copyright"><!-- InstanceBeginEditable name="footercontent" -->
                <?php echo (isset($p->footercontent))?$p->footercontent:''; ?>
                <!-- InstanceEndEditable -->
                <ul>
                    <li><a href="http://validator.unl.edu/check/referer">W3C</a></li>
                    <li><a href="http://jigsaw.w3.org/css-validator/check/referer?profile=css3">CSS</a></li>
                </ul>
                <?php include 'wdn/templates_3.0/includes/wdn.html'; ?>
                <a href="http://www.unl.edu/" title="UNL Home" id="wdn_unl_wordmark"><img src="/wdn/templates_3.0/css/footer/images/wordmark.png" alt="UNL's wordmark" /></a> </div>
        </div>
    </div>
    <div id="wdn_wrapper_footer"> </div>
</div>
</body>
<!-- InstanceEnd --></html>
