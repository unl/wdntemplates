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
'tooltip',
'analytics',
'plugins/rating/jquery.rating',
'plugins/colorbox/jquery.colorbox',
'plugins/qtip/jquery.qtip',
'idm',
'tabs',
'feedback',
'socialmediashare',
'unlalert',
'global_functions',
);

$all = '';
$loaded = '';
$pre_compressed = '';

foreach (array('jquery') as $already_compressed) {
    $pre_compressed .= file_get_contents(dirname(__FILE__)."/../scripts/$already_compressed.js").PHP_EOL;
}

require_once dirname(__FILE__).'/JavaScriptPacker.php';
foreach ($files as $file) {
    $filename = dirname(__FILE__)."/../scripts/$file.js";
    $all .= file_get_contents($filename).PHP_EOL;
    if ($file == 'wdn') {
        $all .= 'WDN.jQuery = jQuery.noConflict(true);WDN.loadedJS["wdn/templates_3.0/scripts/jquery.js"]=true;WDN.template_path = "/";'.PHP_EOL;
    }
    $all .= 'WDN.loadedJS["wdn/templates_3.0/scripts/'.$file.'.js"]=true;'.PHP_EOL;
}
$packer = new JavaScriptPacker($all, 'Normal', true, false);
$all = $packer->pack();

$compressed = $pre_compressed.PHP_EOL.$all.PHP_EOL.'WDN.initializeTemplate();';

$compressed = '/**
 * This file is part of the UNL WDN templates.
 * @see http://wdn.unl.edu/
 * $Id$
 */'.PHP_EOL.$compressed;

file_put_contents(dirname(__FILE__).'/../scripts/all.js', $compressed);

flush();
ob_start();
include dirname(__FILE__).'/compressCSS.php';

$css = ob_get_clean();
file_put_contents(dirname(__FILE__).'/../css/all.css', $css);
?>
