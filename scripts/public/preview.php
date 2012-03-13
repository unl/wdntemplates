<?php

if (empty($_GET['u'])
    || !filter_var($_GET['u'], FILTER_VALIDATE_URL, FILTER_FLAG_PATH_REQUIRED)) {
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

function throwError($message = 'Error')
{
    $header = "HTTP/1.0 500 Server Error";
    header($header);
    echo $message;
    exit();
}

set_include_path('phar://' . __DIR__ . '/UNL_Templates-1.2.0.phar/UNL_Templates-1.2.0/src'.PATH_SEPARATOR.'phar://' . __DIR__ . '/UNL_Templates-1.2.0.phar/UNL_Templates-1.2.0/php');

require_once 'UNL/Templates.php';
require_once 'UNL/Templates/Scanner.php';

$scanned_page = new UNL_Templates_Scanner(file_get_contents($_GET['u']));

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
    $scanned_page->$key = removeRelativePaths($scanned_page->$key, $_GET['u']);
}

$scanned_page->titlegraphic = str_replace(array('<h1>', '</h1>'), array('<span id="wdn_site_title">', '</span>'), $scanned_page->titlegraphic);

?>
<!DOCTYPE html>
<!--[if IEMobile 7 ]><html class="ie iem7"><![endif]-->
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"><![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"><![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"><![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7) ]><html class="ie" lang="en"><![endif]-->
<!--[if !(IEMobile) | !(IE)]><!--><html lang="en"><!-- InstanceBegin template="/Templates/php.fixed.dwt.php" codeOutsideHTMLIsLocked="false" --><!--<![endif]-->
<head>
<?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/metanfavico.html'; ?>
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

    $Id: php.fixed.dwt.php | ea2608181e2b6604db76106fd982b39218ddcb8b | Fri Mar 9 12:20:43 2012 -0600 | Kevin Abel  $
-->
<?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/scriptsandstyles.html'; ?>
<!-- InstanceBeginEditable name="doctitle" -->
<?php echo $scanned_page->doctitle; ?>
<!-- InstanceEndEditable -->
<!-- InstanceBeginEditable name="head" -->
<!-- Place optional header elements here -->
<?php echo $scanned_page->head; ?>
<!-- InstanceEndEditable -->
<!-- InstanceParam name="class" type="text" value="fixed" -->
</head>
<body class="fixed" data-version="3.1">
    <nav class="skipnav">
        <a class="skipnav" href="#maincontent">Skip Navigation</a>
    </nav>
    <div id="wdn_wrapper">
        <header id="header" role="banner">
            <a id="logo" href="http://www.unl.edu/" title="UNL website">UNL</a>
            <span id="wdn_institution_title">University of Nebraska&ndash;Lincoln</span>
            <span id="wdn_site_title"><!-- InstanceBeginEditable name="titlegraphic" -->
            <?php echo $scanned_page->titlegraphic; ?>
            <!-- InstanceEndEditable --></span>
            <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/idm.html'; ?>
            <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/wdnTools.html'; ?>
        </header>
        <div id="wdn_navigation_bar">
            <nav id="breadcrumbs">
                <!-- WDN: see glossary item 'breadcrumbs' -->
                <h3 class="wdn_list_descriptor hidden">Breadcrumbs</h3>
                <!-- InstanceBeginEditable name="breadcrumbs" -->
                <?php echo (isset($scanned_page->breadcrumbs))?$scanned_page->breadcrumbs:''; ?>
                <!-- InstanceEndEditable -->
            </nav>
            <div id="wdn_navigation_wrapper">
                <nav id="navigation" role="navigation">
                    <h3 class="wdn_list_descriptor hidden">Navigation</h3>
                    <!-- InstanceBeginEditable name="navlinks" -->
                    <?php echo (isset($scanned_page->navlinks))?$scanned_page->navlinks:''; ?>
                    <!-- InstanceEndEditable -->
                </nav>
            </div>
        </div>
        <div id="wdn_content_wrapper">
            <div id="pagetitle">
                <!-- InstanceBeginEditable name="pagetitle" -->
                <?php echo $scanned_page->pagetitle; ?>
                <!-- InstanceEndEditable -->
            </div>
            <div id="maincontent" role="main">
                <!--THIS IS THE MAIN CONTENT AREA; WDN: see glossary item 'main content area' -->
                <!-- InstanceBeginEditable name="maincontentarea" -->
                  <?php echo $scanned_page->maincontentarea; ?>
                  <!-- InstanceEndEditable -->
                <div class="clear"></div>
                <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/noscript.html'; ?>
                <!--THIS IS THE END OF THE MAIN CONTENT AREA.-->
            </div>
        </div>
        <footer id="footer">
            <div id="footer_floater"></div>
            <div class="footer_col" id="wdn_footer_feedback">
                <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/feedback.html'; ?>
            </div>
            <div class="footer_col" id="wdn_footer_related">
                <!-- InstanceBeginEditable name="leftcollinks" -->
                <?php echo (isset($scanned_page->leftcollinks))?$scanned_page->leftcollinks:''; ?>
                <!-- InstanceEndEditable --></div>
            <div class="footer_col" id="wdn_footer_contact">
                <!-- InstanceBeginEditable name="contactinfo" -->
                <?php echo (isset($scanned_page->contactinfo))?$scanned_page->contactinfo:''; ?>
                <!-- InstanceEndEditable --></div>
            <div class="footer_col" id="wdn_footer_share">
                <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/socialmediashare.html'; ?>
            </div>
            <!-- InstanceBeginEditable name="optionalfooter" -->
            <!-- InstanceEndEditable -->
            <div id="wdn_copyright">
                <div>
                    <!-- InstanceBeginEditable name="footercontent" -->
                    <?php echo (isset($scanned_page->footercontent))?$scanned_page->footercontent:''; ?>
                    <!-- InstanceEndEditable -->
                    <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/wdn.html'; ?>
                </div>
                <?php include dirname(__DIR__) . '/../wdn/templates_3.1/includes/logos.html'; ?>
            </div>
        </footer>
    </div>
</body>
<!-- InstanceEnd --></html>
