<?php
// Set up the list of all the javascript files
$files = array(
'jquery',
'wdn',
// 'xmlhttp',
'wdn_ajax',
'navigation',
'search',
'toolbar',
//'toolbar_weather',
//'toolbar_events',
//'toolbar_peoplefinder',
//'toolbar_webcams',
'tooltip',
'analytics',
'plugins/hoverIntent/jQuery.hoverIntent',
'plugins/rating/jquery.rating',
'plugins/colorbox/jquery.colorbox',
'plugins/qtip/jquery.qtip',
'idm',
'tabs',
'feedback',
'socialmediashare',
'unlalert',
'global_functions',
'mobile_detect',
);

$all = '';
$loaded = '';

foreach ($files as $file) {
    $filename = dirname(__FILE__)."/../scripts/$file.js";
    $all .= file_get_contents($filename).PHP_EOL;
    if ($file == 'wdn') {
        $all .= 'WDN.jQuery = jQuery.noConflict(true);WDN.loadedJS["/wdn/templates_3.0/scripts/jquery.js"]=1;WDN.template_path = "/";'.PHP_EOL;
    }
    if ($file !== 'jquery'){
        $all .= 'WDN.loadedJS["/wdn/templates_3.0/scripts/'.$file.'.js"]=1;'.PHP_EOL;
    }
}

$all = $all.PHP_EOL.'WDN.initializeTemplate();';
// the next line will remove all WDN.log(...); statements
$all = preg_replace('/WDN\.log\s*\(.+\);/','//debug statement removed',$all);

file_put_contents(dirname(__FILE__).'/../scripts/all_uncompressed.js', $all);

// YUI Compressor
//exec('java -jar '.dirname(__FILE__).'/yuicompressor-2.4.2.jar -o '.dirname(__FILE__).'/../scripts/all.js '.dirname(__FILE__).'/../scripts/all_uncompressed.js');

// Closure compiler
exec('java -jar '.dirname(__FILE__).'/compiler.jar --js='.dirname(__FILE__).'/../scripts/all_uncompressed.js --js_output_file='.dirname(__FILE__).'/../scripts/all.js');

$compressed = '/**
 * This file is part of the UNL WDN templates.
 * @see http://wdn.unl.edu/
 * $Id$
 */'.PHP_EOL.file_get_contents(dirname(__FILE__).'/../scripts/all.js');

file_put_contents(dirname(__FILE__).'/../scripts/all.js', $compressed);

flush();
ob_start();
include dirname(__FILE__).'/compressCSS.php';

$css = ob_get_clean();
file_put_contents(dirname(__FILE__).'/../css/all.css', $css);

ob_start();
include dirname(__FILE__).'/compressDtCSS.php';

$css = ob_get_clean();
file_put_contents(dirname(__FILE__).'/../css/designtime.css', $css);
?>
