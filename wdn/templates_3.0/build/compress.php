<?php
// Set up the list of all the javascript files
$files = array(
'wdn',
'xmlhttp',
'navigation',
'search',
'toolbar',
'toolbar_weather',
'toolbar_events',
'toolbar_peoplefinder',
'toolbar_webcams',
'plugins/rating/jquery.rating',
'feedback',
'global_functions',
);

$all = '';
$loaded = '';
$pre_compressed = '';

foreach (array('jquery') as $already_compressed) {
    $pre_compressed .= file_get_contents(dirname(__FILE__)."/../scripts/$already_compressed.js").PHP_EOL;
    $loaded .= 'WDN.loadedJS["wdn/templates_3.0/scripts/'.$already_compressed.'.js"]=true;'.PHP_EOL;
}

require_once dirname(__FILE__).'/JavaScriptPacker.php';
foreach ($files as $file) {
    $packer = new JavaScriptPacker(file_get_contents(dirname(__FILE__)."/../scripts/$file.js"), 'Normal', true, false);
    $all .= '//'.$file.PHP_EOL.$packer->pack();
    if ($file == 'wdn') {
        $all .= 'WDN.jQuery = jQuery.noConflict(true);';
    }
    $loaded .= 'WDN.loadedJS["wdn/templates_3.0/scripts/'.$file.'.js"]=true;'.PHP_EOL;
}

$loaded .= 'WDN.template_path = "/";'.PHP_EOL;

$compressed = $pre_compressed.PHP_EOL.$all.PHP_EOL.$loaded.'WDN.initializeTemplate();';

$compressed = '/**
 * This file is part of the UNL WDN templates.
 * http://wdn.unl.edu/
 * $Id$
 */'.PHP_EOL.$compressed;

file_put_contents(dirname(__FILE__).'/../scripts/all.js', $compressed);

flush();
ob_start();
include dirname(__FILE__).'/compressCSS.php';

$css = ob_get_clean();
file_put_contents(dirname(__FILE__).'/../css/all.css', $css);
?>
