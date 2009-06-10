<?php
// Set up the list of all the javascript files
$files = array(
'wdn',
'xmlhttp',
'navigation',
'search',
'toolbar',
'plugins/colorbox/jquery.colorbox',
'plugins/rating/jquery.rating',
'global_functions',
);

$all = '';
$loaded = 'WDN.loadedJS["wdn/templates_3.0/scripts/jquery.js"]=true;'.PHP_EOL;

require_once dirname(__FILE__).'/JavaScriptPacker.php';
foreach ($files as $file) {
    $packer = new JavaScriptPacker(file_get_contents(dirname(__FILE__)."/../scripts/$file.js"), 'Normal', true, false);
    $all .= '//'.$file.PHP_EOL.$packer->pack();
    $loaded .= 'WDN.loadedJS["wdn/templates_3.0/scripts/'.$file.'.js"]=true;'.PHP_EOL;
}

$all .= PHP_EOL.$loaded.'WDN.initializeTemplate();';

$compressed = file_get_contents(dirname(__FILE__)."/../scripts/jquery.js").PHP_EOL.$all;

file_put_contents(dirname(__FILE__).'/../scripts/all.js', $compressed);

flush();
ob_start();
include dirname(__FILE__).'/compressCSS.php';

$css = ob_get_clean();
file_put_contents(dirname(__FILE__).'/../css/all.css', $css);
?>