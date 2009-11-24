<?php
  header('Content-type: text/css');
  echo '/**
 * This file is part of the UNL WDN templates.
 * http://wdn.unl.edu/
 * $Id$
 */'.PHP_EOL;
  ob_start("compress");
  function compress($buffer) {
    /* remove comments */
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    /* remove tabs, spaces, newlines, etc. */
    $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
    $buffer = str_replace(', ', ',', $buffer);
    return $buffer;
  }

  /* your css files */
    $files = array(
    'reset',
    'wrapper',
    'header/header',
    'header/toolbarcontent',
    'header/tooltabs',
    'header/toolbar',
    'header/idm',
    'header/colorbox',
    'navigation/breadcrumbs',
    'navigation/navigation',
    'footer/feedback',
    'footer/footer',
    'footer/rating',
    'content/basestyles',
    'content/tabs',
    'content/columns',
    'content/headers',
    'content/images',
    'content/mime',
    'content/titlegraphic',
    'content/zenbox',
    'content/zentable',
    'variations/liquid',
    'variations/fixed',
    'variations/popup',
    'variations/document',
    'variations/secure',
    );
  foreach ($files as $file) {
      $dir = '';
      if (strpos($file,'/')!==false) {
          list($dir) = explode('/',$file);
          $dir .= '/';
      }
      $corrected = convertPaths(file_get_contents(dirname(__FILE__)."/../css/$file.css"), $dir);
      echo preg_replace('/\@import[\s]+url\(.*\);/', '', $corrected);
  }

  function convertPaths($css, $dir) {
      return str_replace(array('../images/','images/','IMAGES'), array('IMAGES/',$dir.'images/','images'), $css);
  }
  
  ob_end_flush();
?>
