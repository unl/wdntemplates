--TEST--
Validate all SHTML .dwt files to ensure they're valid
--FILE--
<?php
require_once __DIR__ . '/../mod_include.php';

set_include_path('phar://' . __DIR__ . '/Services_W3C_HTMLValidator.phar/php');

require_once 'Services/W3C/HTMLValidator.php';

$files = new GlobIterator(__DIR__ . '/../../Templates/*.dwt', FilesystemIterator::CURRENT_AS_PATHNAME);

$validator = new Services_W3C_HTMLValidator();

foreach ($files as $filename) {
    $shtml = mod_include_file($filename);

    if (!$validator->validateFragment($shtml)) {
        echo "Invalid HTML in " . $filename;
    }
}


?>
===DONE===
--EXPECT--
===DONE===