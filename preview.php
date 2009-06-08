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
    if (substr($base_url,-1) != '/') {
    	$base_url .= '/';
    }
    $new_base_url = $base_url;
    $base_url_parts = parse_url($base_url);

    foreach ($needles as $needle) {
        $new_txt = '';
        while ($pos = strpos($html, $needle)) {
            $pos += strlen($needle);
            if (substr($html,$pos,7) != 'http://'
                 && substr($html,$pos,8) != 'https://'
                 && substr($html,$pos,6) != 'ftp://'
                 && substr($html,$pos,9) != 'mailto://') {
                 if (substr($html,$pos,1) == '/') {
                     $new_base_url = $base_url_parts['scheme'].'://'.$base_url_parts['host'];
                 }
                 $new_txt .= substr($html,0,$pos).$new_base_url;
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

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
    "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html version="-//W3C//DTD XHTML 1.1//EN"
      xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.w3.org/1999/xhtml
                          http://www.w3.org/MarkUp/SCHEMA/xhtml11.xsd">

<head>
    <link rel="stylesheet" type="text/css" media="screen" href="wdn/templates_3.0/css/debug.css" />
    <link rel="stylesheet" type="text/css" media="print" href="wdn/templates_3.0/css/print.css" />
    <link rel="shortcut icon" href="wdn/templates_3.0/images/favicon.ico" />
    <script type="text/javascript" src="wdn/templates_3.0/scripts/debug.js"></script>
    <!--[if IE 7]>
        <link rel="stylesheet" type="text/css" media="screen" href="wdn/templates_3.0/css/ie.css" />
    <![endif]-->
    
    <?php echo $p->doctitle; ?>
    
    <?php echo $p->head; ?>
</head>
<body class="fixed">
<p class="skipnav"> <a class="skipnav" href="#maincontent">Skip Navigation</a> </p>
<div id="wdn_wrapper">
    <div id="header">
        <a href="http://www.unl.edu/" title="UNL website"><img src="wdn/templates_3.0/images/logo.png" alt="UNL graphic identifier" id="logo" /></a>
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
            <li><a href="http://www1.unl.edu/feeds/" class="feed" title="Subscribe to RSS feeds">Feeds</a></li>
            <li><a href="http://forecast.weather.gov/MapClick.php?CityName=Lincoln&amp;state=NE&amp;site=OAX" class="weather" title="Weather">Weather</a></li>
            <li><a href="http://events.unl.edu/" class="calendar" title="Events">Events</a></li>
            <li><a href="http://peoplefinder.unl.edu/" class="directory" title="Peoplefinder">Peoplefinder</a></li>
            <li><a href="http://www.unl.edu/unlpub/cam/cam1.shtml" class="camera" title="Campus Cameras">Camera</a></li>
        </ul>
    </div>
    <div id="wdn_navigation_bar">
    
        <div id="breadcrumbs">
            <?php echo $p->breadcrumbs; ?>
        </div>
        
        <div id="wdn_navigation_wrapper">
            <div id="navigation">
                <?php echo $p->navlinks; ?>
                <!-- End Navigation Markup -->
            </div>
        </div>
    </div>
    
    <div id="wdn_content_wrapper">
    
        <div id="titlegraphic">
            <?php echo $p->titlegraphic; ?>
        </div>
        
        <div id="maincontent">
            <?php echo $p->maincontentarea; ?>
            <div class="clear"></div>
        </div> <!-- end of maincontent -->
        
        <div id="footer">
            <div id="footer_floater">
            </div>
            <div class="footer_col">
            <h3>Your Feedback</h3>
            (feedback form)
            </div>
            
            <div class="footer_col">
            <h3>Now On UNL.edu</h3>
            <?php echo $p->leftRandomPromo; ?>
            </div>
            
            <div class="footer_col">
            <?php echo $p->leftcollinks; ?>
            </div>
            
            <div class="footer_col">
            <h3>Contacting Us</h3>
            <p><strong>University Communications</strong><br />
            WICK 17<br />
            Lincoln  NE  68583-0218</p>
            
            </div>
            <?php echo $p->optionalfooter; ?>
                   
            <div id="wdn_copyright">
                <?php echo $p->footercontent; ?>
                <ul>
                    <li><a href="http://validator.unl.edu/check/referer">W3C</a></li>
                    <li><a href="http://jigsaw.w3.org/css-validator/check/referer">CSS</a></li>
                </ul>
                <a href="http://www.unl.edu/" title="UNL Home" id="wdn_unl_wordmark"><img src="wdn/templates_3.0/css/footer/images/wordmark.png" alt="UNL's wordmark" /></a>
            </div>
        </div>
    
    </div>
    <div style="clear:both;"> </div>
</div>
</body>
</html>
