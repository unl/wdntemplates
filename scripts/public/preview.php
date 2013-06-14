<?php

ini_set('display_errors', true);

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

set_include_path('phar://' . __DIR__ . '/UNL_Templates-1.4.0RC1.phar/UNL_Templates-1.4.0RC1/src'.PATH_SEPARATOR.'phar://' . __DIR__ . '/UNL_Templates-1.4.0RC1.phar/UNL_Templates-1.4.0RC1/php');

require_once 'UNL/Templates.php';
require_once 'UNL/Templates/Version4.php';
require_once 'UNL/Templates/Scanner.php';
require_once 'UNL/DWT/Scanner.php';

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

// Grab the version four template from the local debug file
$four_template = new UNL_Templates_Scanner(file_get_contents(__DIR__ . '/../../debug.shtml'));

foreach ($scanned_page->getRegions() as $region) {
    if ($region instanceof UNL_DWT_Region && $region->type == 'string') {
        if (in_array($region->name, array('maincontentarea','head', 'doctitle'))) {
            $region->value = removeRelativePaths($region->value, $_GET['u']);
        }
        
        if ($region->name === 'titlegraphic') {
            $region->value = str_replace(array('<h1>', '</h1>'), array('', ''), $region->value);
        }
        
        $four_template->{$region->name} = $region->value;
    }
}

$four_template->maincontentarea = $four_template->maincontentarea;

// Create a helper object for making the include replacements
$version_four_helper = new UNL_Templates_Version4();

// Replace the #include statements
$html = $version_four_helper->makeIncludeReplacements((string)$four_template);

// echo the final HTML
echo $html;
