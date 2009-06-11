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
    && !preg_match('/huskeralum\.com/', $_GET['u'])) {
    throwError('Requested host is not allowed');
}
require_once 'UNL/Templates.php';
require_once 'UNL/Templates/Scanner.php';

$p = new UNL_Templates_Scanner(file_get_contents($_GET['u']));

$p->breadcrumbs = str_replace('<a href="http://admissions.unl.edu/apply/" title="apply now"><img src="/ucomm/templatedependents/templatecss/images/badge_applynow.png" alt="apply now" id="badge" /></a>',
							  '',
								$p->breadcrumbs);

function removeRelativePaths($html, $base_url)
{

    $needles = array('href="', 'src="', 'background="','href=\'','src=\'');
    $base_url = new SplFileInfo($base_url);
    $base_url = $base_url->getPath().'/';

    foreach ($needles as $needle) {
        $new_txt = '';
        while ($pos = strpos($html, $needle)) {
            $pos += strlen($needle);
            if (substr($html,$pos,7) != 'http://'
                 && substr($html,$pos,8) != 'https://'
                 && substr($html,$pos,6) != 'ftp://'
                 && substr($html,$pos,9) != 'mailto://') {
                 $new_txt .= substr($html,0,$pos).$base_url;
            } else {
                $new_txt .= substr($html,0,$pos);
            }
            $html = substr($html,$pos);
        }
        $html = $new_txt.$html;
    }
    return $html;
}

foreach (array('maincontentarea','head') as $key) {
	$p->$key = removeRelativePaths($p->$key, $_GET['u']);
}
if ( stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml") ) {
  header("Content-type: application/xhtml+xml");
}
else {
  header("Content-type: text/html");
}

echo '<?xml version="1.0" encoding="UTF-8"?>'.PHP_EOL;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
    "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html version="-//W3C//DTD XHTML 1.1//EN"
      xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.w3.org/1999/xhtml
                          http://www.w3.org/MarkUp/SCHEMA/xhtml11.xsd">
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
    
    $Id: fixed.dwt 253 2009-06-09 18:00:03Z bbieber2 $
-->
<link rel="stylesheet" type="text/css" media="screen" href="wdn/templates_3.0/css/debug.css" />
<link rel="stylesheet" type="text/css" media="print" href="wdn/templates_3.0/css/print.css" />
<script type="text/javascript" src="/wdn/templates_3.0/scripts/debug.js"></script>
<!--[if IE 7]>
    <link rel="stylesheet" type="text/css" media="screen" href="wdn/templates_3.0/css/ie.css" />
<![endif]-->
<meta name="author" content="University of Nebraska-Lincoln | Web Developer Network" />
<meta http-equiv="content-language" content="en" />
<meta name="language" content="en" />
<link rel="shortcut icon" href="wdn/templates_3.0/images/favicon.ico" />
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

        <div id="wdn_search">
    <form id="wdn_search_form" action="http://www.google.com/u/UNL1?sa=Google+Search&amp;q=" method="get">
        <fieldset>
            <label for="q">Search this site, all UNL or for a person</label>
            <input accesskey="f" id="q" alt="Search string" name="q" type="text" />
            <input class="search" type="image" alt="Search" src="wdn/templates_3.0/css/header/images/searchMagnifyGlass.png" />
        </fieldset>
    </form>

</div>
<ul id="wdn_tool_links">
    <li><a href="http://www1.unl.edu/feeds/" class="feed"
        title="Subscribe to RSS feeds">Feeds</a></li>
    <li><a
        href="http://forecast.weather.gov/MapClick.php?CityName=Lincoln&amp;state=NE&amp;site=OAX"
        class="weather" title="Weather">Weather</a></li>
    <li><a href="http://events.unl.edu/" class="calendar"
        title="Events">Events</a></li>
    <li><a href="http://peoplefinder.unl.edu/" class="directory"
        title="Peoplefinder">Peoplefinder</a></li>
    <li><a href="http://www.unl.edu/unlpub/cam/cam1.shtml"
        class="camera" title="Campus Cameras">Camera</a></li>

</ul>
    </div>
    <div id="wdn_navigation_bar">
        <div id="breadcrumbs">
            <!-- WDN: see glossary item 'breadcrumbs' -->
            <!-- InstanceBeginEditable name="breadcrumbs" -->
            <?php echo $p->breadcrumbs; ?>
        <!-- InstanceEndEditable --></div>
        <div id="wdn_navigation_wrapper">
            <div id="navigation"><!-- InstanceBeginEditable name="navlinks" -->
                <?php echo $p->navlinks; ?>
                <!-- InstanceEndEditable --></div>
        </div>
    </div>

    <div id="wdn_content_wrapper">
        <div id="titlegraphic"><!-- InstanceBeginEditable name="titlegraphic" -->
            <?php echo $p->titlegraphic; ?>
            <!-- InstanceEndEditable --></div>
        <div id="maincontent">
            <!--THIS IS THE MAIN CONTENT AREA; WDN: see glossary item 'main content area' -->
            <!-- InstanceBeginEditable name="maincontentarea" -->
            <?php echo $p->maincontentarea; ?>
            <!-- InstanceEndEditable -->
            <div class="clear"></div>
            <noscript>
<p>
Your browser does not appear to support JavaScript, or you have turned JavaScript off. You may use unl.edu without enabling JavaScript, but certain functions may not be available.
</p>

</noscript>
            <!--THIS IS THE END OF THE MAIN CONTENT AREA.-->
        </div>
        <div id="footer">
            <div id="footer_floater">
            </div>
            <div class="footer_col">
            <h3>Your Feedback</h3>
            (feedback form)
            </div>
            
            <div class="footer_col"><!-- InstanceBeginEditable name="leftRandomPromo" -->
            <h3>Now On UNL.edu</h3>
            <?php echo $p->leftRandomPromo; ?>
            <!-- InstanceEndEditable --></div>
            <div class="footer_col"><!-- InstanceBeginEditable name="leftcollinks" -->
            <?php echo $p->leftcollinks; ?>
            <!-- InstanceEndEditable --></div>
            <div class="footer_col">
            <h3>Contacting Us</h3>
            <p><strong>University Communications</strong><br />
            WICK 17<br />
            Lincoln  NE  68583-0218</p>
            
            </div>
            <!-- InstanceBeginEditable name="optionalfooter" -->
            <?php echo $p->optionalfooter; ?>
            <!-- InstanceEndEditable -->
            <div id="wdn_copyright"><!-- InstanceBeginEditable name="footercontent" -->
                <?php echo $p->footercontent; ?>
                <ul>
                    <li><a href="http://validator.unl.edu/check/referer">W3C</a></li>
                    <li><a href="http://jigsaw.w3.org/css-validator/check/referer">CSS</a></li>
                </ul>
                <!-- InstanceEndEditable -->
                <a href="http://www.unl.edu/" title="UNL Home" id="wdn_unl_wordmark"><img src="wdn/templates_3.0/css/footer/images/wordmark.png" alt="UNL's wordmark" /></a>
            </div>
        </div>
    </div>

    <div id="wdn_wrapper_footer"> </div>
</div>
</body>
<!-- InstanceEnd --></html>
