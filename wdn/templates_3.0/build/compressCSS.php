<?php
  header('Content-type: text/css');
  ob_start("compress");
  function compress($buffer) {
    /* remove comments */
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    /* remove tabs, spaces, newlines, etc. */
    $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
    return $buffer;
  }

  /* your css files */
    $files = array(
    'reset',
    'wrapper',
    'header/header',
    'navigation/breadcrumbs',
    'navigation/navigation',
    'footer/footer',
    'content/basestyles',
    'content/columns',
    'content/headers',
    'content/images',
    'content/mime',
    'content/titlegraphic',
    'content/zenbox',
    'variations/liquid',
    'variations/fixed',
    );
  foreach ($files as $file) {
      $dir = '';
      if (strpos($file,'/')!==false) {
          list($dir) = explode('/',$file);
          $dir .= '/';
      }
      echo convertPaths(file_get_contents(dirname(__FILE__)."/../css/$file.css"), $dir);
  }

  function convertPaths($css, $dir) {
      return str_replace(array('../images/','images/','IMAGES'), array('IMAGES/',$dir.'images/','images'), $css);
  }
  
  ob_end_flush();
?>
