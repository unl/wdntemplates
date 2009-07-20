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

$parts = parse_url($_GET['u']);

$clean_url = $parts['scheme'].'://'.$parts['host'].$parts['path'];

if ($page = @file_get_contents($clean_url)) {
	$dom = new DOMDocument();
	if (!@$dom->loadHTML($page)) {
		throwError('Bad html');
	}
	$xpath = new DOMXpath($dom);
	$element = $xpath->query('//*[@id="navigation"]/ul[1]|//*[@id="navigation"]/*/ul[1]');
	if ($element->length) {
		$navigation = simplexml_import_dom($element->item(0));
		echo removeRelativePaths($navigation->asXML(), $clean_url);
	}
} else {
	throwError();
}

function removeRelativePaths($html, $base_url)
{
    $needles = array('href="', 'src="', 'background="');
    $new_base_url = $base_url;
    $base_url_parts = parse_url($base_url);
    
    if (substr($base_url,-1) != '/') {
        $path = pathinfo($base_url_parts['path']);
    	$new_base_url = substr($new_base_url, 0, strlen($new_base_url)-strlen($path['basename']));
    }

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


function throwError($msg = '')
{
	header("HTTP/1.0 500 Could not process request");
	echo $msg;
	exit();
}

