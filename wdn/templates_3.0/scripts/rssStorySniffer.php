<?php

if (empty($_GET['u'])) {
	throwError();
}




$parts = parse_url($_GET['u']);

$clean_url = $parts['scheme'].'://'.$parts['host'].$parts['path'];

if ($page = @file_get_contents($clean_url)) {
	$dom = new DOMDocument();
	if (!@$dom->loadHTML($page)) {
		throwError('Bad html');
	}
	$xpath = new DOMXpath($dom);
	
	if($_GET['col'] = 1)
		$element = $xpath->query('//*[@id="maincontent"]');
	else if($_GET['col'] = 2)
		$element = $xpath->query('//*[@id="maincontent"]//*');
	else if($_GET['col'] = 3)
		$element = $xpath->query('//*[@id="maincontent"]');
	else if($_GET['col'] = 4)
		$element = $xpath->query('//*[@id="maincontent"]');
	else
		throwError();
	
	
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


function throwError($msg = '')
{
	header("HTTP/1.0 500 Could not process request");
	echo $msg;
	exit();
}

