<?php

$files = array(
'jquery',
'wdn',
'xmlhttp',
'navigation',
'search',
'toolbar',
'plugins/colorbox/jquery.colorbox',
'global_functions',
);

$compressed = fopen(dirname(__FILE__).'/all.js', 'w');

$loaded = '';

foreach ($files as $file) {
    fwrite($compressed, file_get_contents(dirname(__FILE__)."/$file.js"));
    $loaded .= 'WDN.loadedJS["wdn/templates_3.0/scripts/'.$file.'"]=true;'.PHP_EOL;
}

fwrite($compressed, PHP_EOL.$loaded.'WDN.initializeTemplate();');

fclose($compressed);
?>