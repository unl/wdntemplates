<?php

/**
 * Function which mimics the includes processed by mod_include
 *
 * @param string $filename A filename to process
 * @param string $root     Path to the web root
 * 
 * @return string Processed HTML
 */
function mod_include_file($filename, $root = NULL)
{
    $contents = file_get_contents($filename);
    return mod_include_string($contents, $root);
}

/**
 * Function which mimics the includes processed by mod_include
 *
 * @param string $shtml HTML containing mod_include directives
 * @param string $root  Path to the web root
 *
 * @return string Processed HTML
 */
function mod_include_string($shtml, $root = NULL)
{
    if (!$root) {
        $root = $_SERVER['DOCUMENT_ROOT'];
    }

    $includes = array();
    preg_match_all('<!--#include virtual="([A-Za-z0-9\.\/_]+)" -->', $shtml, $includes);
    foreach ($includes[1] as $include) {

        $file = $root . $include;

        if (!file_exists($file)) {
            $contents = '[an error occurred while processing this directive]';
        } else {
            $contents = file_get_contents($file);
        }

        $shtml = str_replace('<!--#include virtual="'.$include.'" -->', $contents, $shtml);
    }
    return $shtml;
}
